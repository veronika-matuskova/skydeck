// The terminal's font list (#154; S2 12.6): the one xterm.js draws with (web/terminal-view.js) and
// the one the page measures the terminal's area with (style.css `--term-font`) are one list, and it
// names no symbol or emoji font, so that what its fonts lack is drawn by the system's fallback. On
// Windows a font named in the list wins over that fallback for every character it has: "Segoe UI
// Symbol" has a glyph of one colour for every emoji (the red, orange, yellow and white circles came
// out grey, a joined emoji as its parts squashed into two cells), and "Segoe UI Emoji" would draw
// Claude Code's ⏺ ⚠ as colour emoji, whatever colour the program gives them.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const WEB = new URL('../../web/', import.meta.url);
const read = (name: string): string => readFileSync(new URL(name, WEB), 'utf8');

/** The families of a CSS font list, unquoted. */
const families = (list: string): string[] =>
  list.split(',').map((family) => family.trim().replace(/^(['"])(.*)\1$/, '$2'));

const view = /^const FONT = '([^']*)';$/m.exec(read('terminal-view.js'))?.[1];
const sheet = /^\s*--term-font:\s*([^;]*);$/m.exec(read('style.css'))?.[1];

test('xterm.js draws with the list the page measures with (style.css `--term-font`)', () => {
  assert.ok(view, 'terminal-view.js has its FONT');
  assert.ok(sheet, 'style.css has --term-font');
  assert.deepEqual(families(view), families(sheet));
});

test('the list is the monospace fonts and the generic family: emoji and symbols are the system fallback’s', () => {
  assert.ok(view);
  assert.deepEqual(families(view), ['Cascadia Mono', 'Cascadia Code', 'Consolas', 'monospace']);
});
