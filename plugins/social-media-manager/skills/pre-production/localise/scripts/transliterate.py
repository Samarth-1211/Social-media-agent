#!/usr/bin/env python3
"""
transliterate.py: Roman <-> Devanagari for Hindi / Hinglish ad copy, plus Hindi number words.

Two modes, chosen automatically:
  indicxlit  AI4Bharat IndicXlit (pip package `ai4bharat-transliteration`, MIT) is installed:
             output is `script_check: verified` (names not in --map are still flagged).
  fallback   IndicXlit is missing (e.g. claude.ai chat, or Python 3.11+ where fairseq won't
             install): a built-in Hinglish lexicon plus phonetic rules. Output is ALWAYS
             `script_check: unverified`, and every word not in the lexicon is flagged so a person
             (or Claude, carefully) checks it. Never present fallback output as verified.

Protected tokens are never converted: numbers, ₹ amounts, percentages, dates like 25/11,
hashtags, @handles, URLs, emails, {{placeholders}}, [pause 0.3s] marks, ALL-CAPS acronyms
(RERA, EMI, BHK), and every --keep term. --map "term=देवनागरी" gives a fixed spelling instead.

Usage
  python3 transliterate.py --to devanagari "Diwali se pehle curtain aur sofa, 20% off."
  python3 transliterate.py --to devanagari --keep "Shubh Laundry" --map "Napier Town=नेपियर टाउन" --file lines.txt
  python3 transliterate.py --to roman "हर महीने, यही जगह शूट की।"
  python3 transliterate.py --number 1499            # Hindi words, Devanagari and Roman
  python3 transliterate.py --self-test
  Add --json for machine-readable output; --force-fallback to test the fallback path.

Run it with `python3 -I` (or `python -I` on Windows). Reads only its arguments and the input file.
"""

import argparse
import json
import re
import sys
import unicodedata

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ── Hindi number words (0-100), Devanagari and Roman (as people say them) ──────────────────
_HI = ("शून्य एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस "
       "इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस "
       "छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस "
       "अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ "
       "तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर "
       "छिहत्तर सतहत्तर अठहत्तर उन्यासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी "
       "नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे सौ").split()
_RO = ("shunya ek do teen chaar paanch chhah saat aath nau das gyaarah baarah terah chaudah pandrah solah "
       "satrah athaarah unnees bees ikkees baaees teyees chaubees pachchees chhabbees sattaees atthaees "
       "untees tees iktees battees taintees chauntees paintees chhattees saintees adtees untaalees chaalees "
       "iktaalees bayaalees taintaalees chavaalees paintaalees chhiyaalees saintaalees adtaalees unchaas "
       "pachaas ikyaavan baavan tirpan chauvan pachpan chhappan sattaavan atthaavan unsath saath iksath "
       "baasath tirsath chaunsath painsath chhiyaasath sadsath adsath unhattar sattar ikhattar bahattar "
       "tihattar chauhattar pachhattar chhihattar sathattar athhattar unyaasi assi ikyaasi bayaasi tiraasi "
       "chauraasi pachaasi chhiyaasi sattaasi atthaasi nawaasi nabbe ikyaanave baanave tiraanave chauraanave "
       "pachaanave chhiyaanave sattaanave atthaanave ninyaanave sau").split()
assert len(_HI) == 101 and len(_RO) == 101

_UNITS = [(10_000_000, "करोड़", "crore"), (100_000, "लाख", "lakh"), (1000, "हज़ार", "hazaar"), (100, "सौ", "sau")]


def hindi_number(n, roman=False):
    """Hindi words for a whole number, Indian system (lakh, crore). 1499 -> एक हज़ार चार सौ निन्यानवे."""
    words = _RO if roman else _HI
    n = int(n)
    if n <= 100:
        return words[n]
    out = []
    for size, hi, ro in _UNITS:
        q, n = divmod(n, size)
        if q:
            out += [hindi_number(q, roman), ro if roman else hi]
    if n:
        out.append(words[n])
    return " ".join(out)


def hindi_number_colloquial(n, roman=False):
    """1100-1999 the way shops say prices: 1499 -> चौदह सौ निन्यानवे. Other numbers: same as hindi_number."""
    n = int(n)
    if 1100 <= n <= 9999 and (n // 100) % 10 != 0:
        hundreds, rest = divmod(n, 100)
        words = _RO if roman else _HI
        out = [words[hundreds], "sau" if roman else "सौ"]
        if rest:
            out.append(words[rest])
        return " ".join(out)
    return hindi_number(n, roman)


# ── Protected tokens ───────────────────────────────────────────────────────────────────────
PROTECT_RE = re.compile(
    r"(\{\{.*?\}\}|\[pause\s+[0-9.]+\s*s\]|https?://\S+|www\.\S+|\S+@\S+\.\S+|[#@][\wऀ-ॿ]+"
    r"|₹\s?[\d,]+(?:\.\d+)?|\d+(?:[.,/:]\d+)*%?|\b[A-Z]{2,}\b|[A-Za-z]+(?:-[A-Za-z0-9]+)+-\d+)"
)

# ── Fallback lexicon: common Hinglish words as people write them in Devanagari ──────────────
LEXICON = {
    # function words and pronouns
    "hai": "है", "hain": "हैं", "ho": "हो", "ka": "का", "ki": "की", "ke": "के", "ko": "को", "se": "से",
    "pe": "पे", "par": "पर", "mein": "में", "me": "में", "aur": "और", "ya": "या", "bhi": "भी", "hi": "ही",
    "to": "तो", "toh": "तो", "na": "ना", "nahi": "नहीं", "nahin": "नहीं", "mat": "मत", "kya": "क्या",
    "kaise": "कैसे", "kyun": "क्यों", "kyon": "क्यों", "kab": "कब", "kahan": "कहाँ", "kitna": "कितना",
    "kitne": "कितने", "kitni": "कितनी", "yeh": "ये", "ye": "ये", "woh": "वो", "wo": "वो", "yahan": "यहाँ",
    "wahan": "वहाँ", "yahi": "यही", "wahi": "वही", "ab": "अब", "abhi": "अभी", "phir": "फिर",
    "pehle": "पहले", "baad": "बाद", "saath": "साथ", "liye": "लिए", "tak": "तक", "sirf": "सिर्फ़",
    "bas": "बस", "sab": "सब", "sabse": "सबसे", "kuch": "कुछ", "koi": "कोई", "apna": "अपना",
    "apne": "अपने", "apni": "अपनी", "aap": "आप", "aapka": "आपका", "aapke": "आपके", "aapki": "आपकी",
    "hum": "हम", "hamara": "हमारा", "humara": "हमारा", "hamare": "हमारे", "humare": "हमारे",
    "hamari": "हमारी", "main": "मैं", "mera": "मेरा", "meri": "मेरी", "mere": "मेरे", "tum": "तुम",
    "jo": "जो", "jab": "जब", "agar": "अगर", "lekin": "लेकिन", "kyunki": "क्योंकि", "isliye": "इसलिए",
    "wala": "वाला", "wale": "वाले", "wali": "वाली", "walon": "वालों", "dono": "दोनों", "har": "हर",
    "yahin": "यहीं", "ji": "जी", "haan": "हाँ", "theek": "ठीक", "bilkul": "बिल्कुल", "ekdum": "एकदम",
    "zaroor": "ज़रूर", "pakka": "पक्का", "khud": "ख़ुद", "upar": "ऊपर", "neeche": "नीचे", "andar": "अंदर",
    "bahar": "बाहर", "aisi": "ऐसी", "aisa": "ऐसा", "aise": "ऐसे", "isi": "इसी", "usi": "उसी",
    # numbers people write as words
    "ek": "एक", "do": "दो", "teen": "तीन", "char": "चार", "chaar": "चार", "paanch": "पाँच",
    # time and place
    "aaj": "आज", "kal": "कल", "din": "दिन", "roz": "रोज़", "mahina": "महीना", "mahine": "महीने",
    "saal": "साल", "subah": "सुबह", "shaam": "शाम", "raat": "रात", "baje": "बजे", "ghar": "घर",
    "dukaan": "दुकान", "jagah": "जगह", "sheher": "शहर", "khet": "खेत", "neev": "नींव",
    # verbs
    "karo": "करो", "karein": "करें", "kijiye": "कीजिए", "kariye": "करिए", "kar": "कर", "karna": "करना",
    "karte": "करते", "karta": "करता", "karti": "करती", "karenge": "करेंगे", "kiya": "किया", "ki.": "की।",
    "karwa": "करवा", "karwana": "करवाना", "karwaya": "करवाया", "karwayi": "करवाई", "karwao": "करवाओ",
    "hoga": "होगा", "hogi": "होगी", "honge": "होंगे", "gaya": "गया", "gayi": "गई", "gaye": "गए",
    "aaya": "आया", "aaye": "आए", "aayi": "आई", "aaiye": "आइए", "aao": "आओ", "aate": "आते",
    "dekho": "देखो", "dekhiye": "देखिए", "dekhna": "देखना", "dekhne": "देखने", "lo": "लो",
    "lijiye": "लीजिए", "dijiye": "दीजिए", "milega": "मिलेगा", "milegi": "मिलेगी", "milenge": "मिलेंगे",
    "chahiye": "चाहिए", "sakte": "सकते", "sakta": "सकता", "sakti": "सकती", "raha": "रहा", "rahe": "रहे",
    "rahi": "रही", "tha": "था", "the": "थे", "thi": "थी", "hota": "होता", "hoti": "होती", "hote": "होते",
    "le": "ले", "lene": "लेने", "ja": "जा", "jaate": "जाते", "jayenge": "जाएँगे", "jaayenge": "जाएँगे",
    "jaiye": "जाइए", "aane": "आने", "aana": "आना", "aati": "आती", "jaane": "जाने", "jaana": "जाना",
    "shuru": "शुरू", "rakho": "रखो", "rakhiye": "रखिए", "lagta": "लगता", "lagti": "लगती", "town.": "टाउन।", "bani": "बनी", "bana": "बना", "banaya": "बनाया", "dikhti": "दिखती",
    "dikhta": "दिखता", "dhulne": "धुलने", "pehen": "पहन", "bhejo": "भेजो", "bataiye": "बताइए",
    "batao": "बताओ", "bata": "बता", "denge": "देंगे", "lenge": "लेंगे",
    # nouns and adjectives common in local ads
    "kapde": "कपड़े", "kapda": "कपड़ा", "saaf": "साफ़", "naya": "नया", "nayi": "नई", "naye": "नए",
    "purana": "पुराना", "purane": "पुराने", "purani": "पुरानी", "achha": "अच्छा", "accha": "अच्छा",
    "achhi": "अच्छी", "bada": "बड़ा", "badi": "बड़ी", "chhota": "छोटा", "jaldi": "जल्दी",
    "mehmaan": "मेहमान", "baat": "बात", "sawaal": "सवाल", "log": "लोग", "bachche": "बच्चे",
    "maa": "माँ", "papa": "पापा", "behen": "बहन", "shaadi": "शादी", "tyohaar": "त्योहार",
    "mehnat": "मेहनत", "aasaan": "आसान", "taiyaar": "तैयार", "faisla": "फ़ैसला", "darj": "दर्ज",
    "pehla": "पहला", "pehli": "पहली", "wapas": "वापस", "dhulai": "धुलाई", "parda": "पर्दा", "parde": "पर्दे",
    "namaste": "नमस्ते", "shukriya": "शुक्रिया", "dhanyavaad": "धन्यवाद",
    # money and months (written in full in Devanagari)
    "lakh": "लाख", "crore": "करोड़", "hazaar": "हज़ार", "rupaye": "रुपये", "rupees": "रुपये",
    "jan": "जनवरी", "january": "जनवरी", "feb": "फ़रवरी", "february": "फ़रवरी", "march": "मार्च",
    "mar": "मार्च", "april": "अप्रैल", "apr": "अप्रैल", "may": "मई", "june": "जून", "jun": "जून",
    "july": "जुलाई", "jul": "जुलाई", "august": "अगस्त", "aug": "अगस्त", "september": "सितंबर",
    "sep": "सितंबर", "sept": "सितंबर", "october": "अक्टूबर", "oct": "अक्टूबर", "november": "नवंबर",
    "nov": "नवंबर", "december": "दिसंबर", "dec": "दिसंबर",
    # festivals
    "diwali": "दिवाली", "navratri": "नवरात्रि", "holi": "होली", "eid": "ईद", "rakhi": "राखी",
    # English loanwords, written the way Hindi readers expect
    "time": "टाइम", "free": "फ़्री", "offer": "ऑफ़र", "pickup": "पिकअप", "delivery": "डिलीवरी",
    "sofa": "सोफ़ा", "curtain": "कर्टन", "curtains": "कर्टन", "cleaning": "क्लीनिंग", "wash": "वॉश",
    "press": "प्रेस", "fold": "फ़ोल्ड", "whatsapp": "व्हाट्सऐप", "sale": "सेल", "discount": "डिस्काउंट",
    "percent": "परसेंट", "off": "ऑफ़", "flat": "फ़्लैट", "booking": "बुकिंग", "site": "साइट",
    "sample": "सैंपल", "possession": "पज़ेशन", "project": "प्रोजेक्ट", "number": "नंबर", "call": "कॉल",
    "visit": "विज़िट", "store": "स्टोर", "shop": "शॉप", "kurta": "कुर्ता", "saree": "साड़ी",
    "fitting": "फ़िटिंग", "set": "सेट", "family": "फ़ैमिली", "tension": "टेंशन", "easy": "ईज़ी",
    "column": "कॉलम", "camera": "कैमरा", "shoot": "शूट", "photo": "फ़ोटो", "video": "वीडियो",
    "director": "डायरेक्टर", "customer": "कस्टमर", "service": "सर्विस", "order": "ऑर्डर",
    "online": "ऑनलाइन", "dry": "ड्राई", "clean": "क्लीन", "iron": "आयरन", "balcony": "बालकनी",
    "lift": "लिफ़्ट", "parking": "पार्किंग", "office": "ऑफ़िस", "town": "टाउन", "heights": "हाइट्स",
    "message": "मैसेज", "link": "लिंक", "bio": "बायो", "ok": "ओके",
}
REV_LEXICON = {}
for _r, _d in LEXICON.items():
    REV_LEXICON.setdefault(_d.rstrip("।"), _r.rstrip("."))

# ── Fallback rules: Roman -> Devanagari ────────────────────────────────────────────────────
CONS = [
    ("chh", "छ"), ("kh", "ख"), ("gh", "घ"), ("ch", "च"), ("jh", "झ"), ("th", "थ"), ("dh", "ध"),
    ("ph", "फ"), ("bh", "भ"), ("sh", "श"), ("ng", "ंग"), ("k", "क"), ("g", "ग"), ("c", "क"), ("j", "ज"),
    ("t", "त"), ("d", "द"), ("n", "न"), ("p", "प"), ("b", "ब"), ("m", "म"), ("y", "य"), ("r", "र"),
    ("l", "ल"), ("v", "व"), ("w", "व"), ("s", "स"), ("h", "ह"), ("z", "ज़"), ("f", "फ़"), ("q", "क़"),
    ("x", "क्स"),
]
VOWELS = [  # (roman, independent, matra)
    ("aa", "आ", "ा"), ("ai", "ऐ", "ै"), ("au", "औ", "ौ"), ("ee", "ई", "ी"), ("ii", "ई", "ी"),
    ("oo", "ऊ", "ू"), ("uu", "ऊ", "ू"), ("ou", "औ", "ौ"), ("a", "अ", ""), ("i", "इ", "ि"),
    ("u", "उ", "ु"), ("e", "ए", "े"), ("o", "ओ", "ो"),
]
HALANT = "्"


def rules_to_devanagari(word):
    w = word.lower()
    out, i, prev_cons = [], 0, False
    while i < len(w):
        for ro, dev in CONS:
            if w.startswith(ro, i):
                if prev_cons and dev != "ंग":
                    out.append(HALANT)
                out.append(dev)
                i += len(ro)
                prev_cons = dev != "ंग"
                break
        else:
            for ro, ind, mat in VOWELS:
                if w.startswith(ro, i):
                    if prev_cons:
                        # word-final short 'a' after a consonant is usually a long 'aa' in Hinglish spelling
                        out.append("ा" if (ro == "a" and i + 1 == len(w) and len(w) > 2) else mat)
                    else:
                        out.append(ind)
                    i += len(ro)
                    prev_cons = False
                    break
            else:
                out.append(w[i])
                i += 1
                prev_cons = False
    return "".join(out)


# ── Fallback rules: Devanagari -> Roman ────────────────────────────────────────────────────
D_CONS = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh",
    "ञ": "n", "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d",
    "ध": "dh", "न": "n", "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r",
    "ल": "l", "व": "v", "श": "sh", "ष": "sh", "स": "s", "ह": "h", "क़": "q", "ख़": "kh", "ग़": "g",
    "ज़": "z", "ड़": "d", "ढ़": "rh", "फ़": "f",
}
D_IND = {"अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ए": "e", "ऐ": "ai", "ओ": "o",
         "औ": "au", "ऋ": "ri", "ऑ": "o"}
D_MAT = {"ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
         "ृ": "ri", "ॉ": "o"}


def rules_to_roman(word):
    w = unicodedata.normalize("NFC", word)
    out, i = [], 0
    while i < len(w):
        ch = w[i]
        if i + 1 < len(w) and w[i + 1] == "़" and (ch + "़") in D_CONS:
            ch, i = ch + "़", i + 1
        if ch in D_CONS:
            out.append(D_CONS[ch])
            nxt = w[i + 1] if i + 1 < len(w) else ""
            if nxt in D_MAT:
                out.append(D_MAT[nxt])
                i += 1
            elif nxt == HALANT:
                i += 1
            elif i + 1 < len(w) and nxt not in "ंँः।":
                out.append("a")
        elif ch in D_IND:
            out.append(D_IND[ch])
        elif ch in "ंँ":
            out.append("n")
        elif ch == "ः":
            out.append("h")
        elif ch == "।":
            out.append(".")
        else:
            out.append(ch)
        i += 1
    s = "".join(out)
    return s


# ── Engine selection ───────────────────────────────────────────────────────────────────────
def load_indicxlit(direction):
    try:
        from ai4bharat.transliteration import XlitEngine  # noqa: WPS433
    except Exception:  # missing, or fairseq/torch broken
        return None
    try:
        if direction == "devanagari":
            return XlitEngine("hi", beam_width=10, rescore=True)
        return XlitEngine(src_script_type="indic", beam_width=10, rescore=False)
    except Exception:
        return None


WORD_RE = re.compile(r"[A-Za-z]+(?:'[A-Za-z]+)?|[ऀ-ॣ०-ॿ]+")  # not the danda (।, ॥)


def convert_line(line, direction, engine, keep, mapping):
    flagged = []
    # 1. fixed spellings and kept terms (longest first), then protected tokens
    holds = []

    def hold(text):
        # private-use characters, no digits, so later patterns can't match inside a held token
        holds.append(text)
        return "" + chr(0xE100 + len(holds) - 1) + ""

    s = line
    for term in sorted(mapping, key=len, reverse=True):
        if direction == "devanagari":
            s = re.sub(re.escape(term), lambda m: hold(mapping[term]), s, flags=re.IGNORECASE)
        else:
            s = s.replace(mapping[term], hold(term))
    for term in sorted(keep, key=len, reverse=True):
        s = re.sub(re.escape(term), lambda m: hold(m.group(0)), s, flags=re.IGNORECASE)
    s = PROTECT_RE.sub(lambda m: hold(m.group(0)), s)

    # 2. word by word
    def repl(m):
        word = m.group(0)
        if direction == "devanagari":
            if not re.match(r"[A-Za-z]", word):
                return word
            low = word.lower()
            if engine is not None:
                try:
                    out = engine.translit_word(low, topk=1)
                    out = out["hi"][0] if isinstance(out, dict) else out[0]
                except Exception:
                    out = None
                if out:
                    if word[:1].isupper() and m.start() > 0:
                        flagged.append(word)  # a name: check its spelling
                    return out
            if low in LEXICON:
                return LEXICON[low]
            flagged.append(word)
            return rules_to_devanagari(low)
        # to roman
        if not re.match(r"[ऀ-ॿ]", word):
            return word
        if engine is not None:
            try:
                out = engine.translit_word(word, lang_code="hi", topk=1)
                out = out[0] if isinstance(out, list) else out["hi"][0]
                if out:
                    return out
            except Exception:
                pass
        if word in REV_LEXICON:
            return REV_LEXICON[word]
        flagged.append(word)
        return rules_to_roman(word)

    s = WORD_RE.sub(repl, s)
    if direction == "devanagari":
        s = re.sub(r"(?<=[ऀ-ॿ])\.(?=\s|$)", "।", s)  # full stop after Hindi → danda
    else:
        s = s.replace("।", ".")
    s = re.sub("(.)", lambda m: holds[ord(m.group(1)) - 0xE100], s)
    return s, flagged


def run(lines, direction, keep, mapping, force_fallback=False):
    engine = None if force_fallback else load_indicxlit(direction)
    mode = "indicxlit" if engine is not None else "fallback"
    results, all_flags = [], []
    for line in lines:
        out, flags = convert_line(line, direction, engine, keep, mapping)
        results.append({"in": line, "out": out, "flagged": flags})
        for f in flags:
            if f not in all_flags:
                all_flags.append(f)
    note = ("IndicXlit converted every word; names outside --map are flagged for a spelling check."
            if mode == "indicxlit" else
            "IndicXlit not available: lexicon + rules. Treat as a draft. Every flagged word needs a "
            "careful check by Claude or a native reader before use; mark script_check unverified.")
    return {
        "mode": mode,
        "script_check": "verified" if mode == "indicxlit" else "unverified",
        "tool": "indicxlit" if mode == "indicxlit" else "manual",
        "direction": direction,
        "lines": results,
        "flagged_words": all_flags,
        "note": note,
    }


def self_test():
    checks = [
        (hindi_number(299), "दो सौ निन्यानवे"),
        (hindi_number(1499), "एक हज़ार चार सौ निन्यानवे"),
        (hindi_number_colloquial(1499), "चौदह सौ निन्यानवे"),
        (hindi_number(4500000), "पैंतालीस लाख"),
        (hindi_number(25, roman=True), "pachchees"),
        (hindi_number(10000000), "एक करोड़"),
    ]
    r = run(["Diwali se pehle curtain aur sofa, 20% off.", "Pickup free, ₹299 se upar."], "devanagari",
            keep=[], mapping={}, force_fallback=True)
    checks.append((r["lines"][0]["out"], "दिवाली से पहले कर्टन और सोफ़ा, 20% ऑफ़।"))
    checks.append((r["lines"][1]["out"], "पिकअप फ़्री, ₹299 से ऊपर।"))
    checks.append((r["script_check"], "unverified"))
    r2 = run(["RERA: P-JBP-21-1234, Napier Town"], "devanagari", keep=[], mapping={"Napier Town": "नेपियर टाउन"},
             force_fallback=True)
    checks.append((r2["lines"][0]["out"], "RERA: P-JBP-21-1234, नेपियर टाउन"))
    r3 = run(["हर महीने, यही जगह शूट की।"], "roman", keep=[], mapping={}, force_fallback=True)
    checks.append((r3["lines"][0]["out"], "har mahine, yahi jagah shoot ki."))
    bad = [(got, want) for got, want in checks if got != want]
    for got, want in bad:
        print(f"FAIL  got {got!r}  want {want!r}")
    print(f"{len(checks) - len(bad)}/{len(checks)} self-test checks passed")
    return 0 if not bad else 1


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("text", nargs="*", help="Lines to convert (or use --file).")
    p.add_argument("--to", choices=["devanagari", "roman"], help="Target script.")
    p.add_argument("--file", help="UTF-8 text file, one line per caption / card / VO line ('-' = stdin).")
    p.add_argument("--keep", action="append", default=[], help="Term to leave exactly as written (repeatable).")
    p.add_argument("--map", action="append", default=[], help='Fixed spelling "Roman=देवनागरी" (repeatable).')
    p.add_argument("--number", type=int, help="Print Hindi words for this number and exit.")
    p.add_argument("--json", action="store_true", help="Machine-readable output.")
    p.add_argument("--force-fallback", action="store_true", help="Ignore IndicXlit even if installed (tests).")
    p.add_argument("--self-test", action="store_true")
    a = p.parse_args(argv)

    if a.self_test:
        return self_test()
    if a.number is not None:
        res = {"number": a.number, "devanagari": hindi_number(a.number), "roman": hindi_number(a.number, True),
               "colloquial_devanagari": hindi_number_colloquial(a.number),
               "colloquial_roman": hindi_number_colloquial(a.number, True)}
        print(json.dumps(res, ensure_ascii=False, indent=1) if a.json else
              f"{res['devanagari']}  ({res['roman']}); shop style: {res['colloquial_devanagari']} ({res['colloquial_roman']})")
        return 0
    if not a.to:
        p.error("--to is required (devanagari or roman)")
    if a.file:
        src = sys.stdin.read() if a.file == "-" else open(a.file, encoding="utf-8").read()
        lines = [l for l in src.splitlines() if l.strip()]
    else:
        lines = a.text
    if not lines:
        p.error("no text given")
    mapping = {}
    for m in a.map:
        if "=" not in m:
            p.error(f'--map needs "Roman=देवनागरी", got {m!r}')
        k, v = m.split("=", 1)
        mapping[k.strip()] = v.strip()
    res = run(lines, a.to, a.keep, mapping, a.force_fallback)
    if a.json:
        print(json.dumps(res, ensure_ascii=False, indent=1))
    else:
        for r in res["lines"]:
            print(r["out"])
        print(f"\n# mode: {res['mode']} · script_check: {res['script_check']}")
        if res["flagged_words"]:
            print("# check these words: " + ", ".join(res["flagged_words"]))
        print("# " + res["note"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
