#!/usr/bin/env node
// Creates a new skill folder from docs/skill-template.md.
// Usage: node scripts/new-skill.mjs <group> <skill-name> [--plugin social-media-manager]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const args = process.argv.slice(2);
const pluginFlag = args.indexOf('--plugin');
const pluginName = pluginFlag >= 0 ? args.splice(pluginFlag, 2)[1] : 'social-media-manager';
const [group, name] = args;

function fail(msg) {
  console.error(`✘ ${msg}`);
  process.exit(1);
}

if (!group || !name) fail('Usage: node scripts/new-skill.mjs <group> <skill-name> [--plugin <plugin>]');
if (!KEBAB.test(name)) fail(`Skill name "${name}" must be kebab-case (lowercase letters, digits, hyphens).`);

const pluginDir = path.join(ROOT, 'plugins', pluginName);
const skillsRoot = path.join(pluginDir, 'skills');
if (!fs.existsSync(skillsRoot)) fail(`Plugin "${pluginName}" not found at ${path.relative(ROOT, pluginDir)}`);

const groups = fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
if (!groups.includes(group)) fail(`Unknown group "${group}". Groups: ${groups.join(', ')}`);
if (groups.includes(name)) fail(`"${name}" is a group name; pick a different skill name.`);

for (const g of groups) {
  if (fs.existsSync(path.join(skillsRoot, g, name))) fail(`Skill "${name}" already exists in group "${g}". Skill names must be unique across groups.`);
}

const template = fs.readFileSync(path.join(ROOT, 'docs', 'skill-template.md'), 'utf8');
const skillMd = template
  .replace(/<skill-name>/g, name)
  .replace(/^description: .*$/m, 'description: TODO one line, third person - what it does and when to use it.');

const skillDir = path.join(skillsRoot, group, name);
fs.mkdirSync(skillDir, { recursive: true });
fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMd);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(skillDir, 'CHANGELOG.md'),
  `# Changelog: ${name}\n\n## 0.1.0 - ${today}\n\n### Added\n- Created from template.\n`,
);

const manifest = JSON.parse(fs.readFileSync(path.join(pluginDir, '.claude-plugin', 'plugin.json'), 'utf8'));
const registered = [].concat(manifest.skills ?? []).map((p) => p.replace(/\/+$/, ''));
const groupEntry = `./skills/${group}`;

const relSkill = path.relative(ROOT, skillDir).split(path.sep).join('/');
console.log(`✔ Created ${relSkill}/SKILL.md and CHANGELOG.md\n`);
console.log('Next:');
console.log(`  1. Write SKILL.md: replace the TODO description and fill every section (max 200 lines).`);
console.log(`     Add references/, prompts/, templates/, examples/, checklists/, scripts/ only if needed.`);
if (!registered.includes(groupEntry)) {
  console.log(`  2. Register the group: add "${groupEntry}" to "skills" in plugins/${pluginName}/.claude-plugin/plugin.json`);
} else {
  console.log(`  2. Group "${group}" is already registered in plugin.json.`);
}
console.log(`  3. Update library/contracts/stages.yaml: point the stage's "skill" at "${name}" and set its status (placeholder | active).`);
console.log(`  4. Bump the plugin version in plugin.json and add a CHANGELOG.md entry.`);
console.log(`  5. Run: node scripts/validate.mjs`);
