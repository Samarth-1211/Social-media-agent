# Transcreation rules

Localising is not translating. Keep what each line **does** (the meaning, the feeling, the retention device, the fact) and say it the way this audience says it in daily life. A reader should never sense that a line was ever written in another language.

## 1. What must not change

| Keep exactly | Why |
|---|---|
| Every price, percentage, date, condition and the CTA (`script.downstream.keep_as_is`, `offer_detail`) | The client approved them; the back-translation check compares them |
| Brand, product and place names | Spelled as the client spells them; pronunciation in `client.pronunciation` |
| The hook's punch: its promise, its first word's job, its card's ≤ 6 words | The first 1.5 s decide the video |
| Each scene's `retention_device` (open loop, reveal, number…) and its timing | The script's structure was picked by the editor |
| Real customer phrases (research `customer_phrases`, profile `customer_words`) | Verbatim, never "corrected" |
| `{{needed: …}}` placeholders | They stay visible until the client fills them; translated inside only |

## 2. What may change

- **Words and word order**, to sound spoken: Hindi puts the verb last; Hinglish puts the English noun where people put it ("sofa cleaning karwao", not "cleaning of sofa karwao").
- **Idioms**: swap an English idiom for the local one, or drop it ("piece of cake" → "bilkul aasaan").
- **Register** to fit the audience (`hinglish-style.md` §3).
- **The card wording**, as long as it stays ≤ 6 words, says the same thing and keeps the number.
- **A customer phrase** from research may replace a written line when it says the same thing better ("kapde time pe chahiye").

## 3. Method, per line

1. **Say the English (or the script's Roman) meaning in one plain sentence** to yourself: what does this line do here?
2. **Ask how the shop owner would say it** to a customer at the counter, in this city.
3. **Write that**, in the target language and script.
4. **Count the spoken words** against the scene's seconds (`voiceover-pacing.md`). Over → shorter local phrasing, never a faster read.
5. **Check the facts** against `keep_as_is`.
6. **Read it aloud.** Anything stiff, "too pure" or translated → step 2 again.

## 4. Local everyday language

- **Use the word people use, even if it's English:** pickup, delivery, booking, offer, flat, EMI, sale, fitting, possession, sample flat. Not sangrahan, vitaran, aarakshan, chhoot, kabza.
- **Use the city's own words** where the profile or research gives them (area names, "mohalla", the shop's nickname).
- **Concrete over abstract:** "kapde ekdum saaf" over "swachhata"; "ghar time pe milega" over "samay par hastantaran".
- **No borrowed slogans:** no translated American taglines, no 1990s pamphlet rhymes.

## 5. Before / after

| Script line (meaning) | Too literal | Transcreated |
|---|---|---|
| "Before Diwali, curtains and sofa, 20% off." | "Diwali se poorv aapke parde aur sofe par 20 pratishat ki chhoot." | "Diwali se pehle curtain aur sofa, 20% off." |
| "We'll pick it up from your home." | "Hum aapke ghar se sangrahan karenge." | "Hum ghar se le jaayenge." |
| "Come see it yourself." | "Kripya swayam aakar avlokan karein." | "Aaiye, khud dekhiye." |
| "Guests are coming, and the curtains?" (Devanagari, 45+) | "अतिथि आने वाले हैं, और पर्दों की स्थिति?" | "मेहमान आने वाले हैं, और पर्दे?" |
