import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

// Run the actual embedded scripts with a small DOM/canvas adapter and a controlled
// animation clock. These checks exercise game behavior, not browser rendering.
const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../checkpoints');
const files = readdirSync(directory).filter(file => file.endsWith('.html')).sort();

function load(file) {
  const html = readFileSync(path.join(directory, file), 'utf8');
  const elements = new Map();
  const listeners = new Map();
  const frames = [];
  const drawCalls = [];
  const context2d = new Proxy({}, {
    get(target, name) {
      return name in target ? target[name] : (...args) => drawCalls.push([name, ...args]);
    },
    set(target, name, value) { target[name] = value; return true; }
  });
  for (const match of html.matchAll(/<([a-z]+)\b[^>]*\bid="([^"]+)"[^>]*>/gi)) {
    elements.set(match[2], {
      tagName: match[1].toUpperCase(), textContent: '', checked: false, disabled: false,
      width: 800, height: 300, hidden: false, listeners: {}, focus() {},
      getContext() { return context2d; },
      addEventListener(name, callback) { this.listeners[name] = callback; }
    });
  }
  const context = vm.createContext({
    document: { getElementById: id => elements.get(id) },
    window: { addEventListener: (name, callback) => listeners.set(name, callback) },
    requestAnimationFrame: callback => { frames.push(callback); return frames.length; }
  });
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, 'one embedded script');
  vm.runInContext(scripts[0][1], context, { filename: file, timeout: 1000 });
  const run = source => vm.runInContext(source, context, { timeout: 1000 });
  const value = source => JSON.parse(run(`JSON.stringify(${source})`));
  const key = (repeat = false, target = 'CANVAS') => {
    let prevented = false;
    listeners.get('keydown')({ code: 'Space', repeat, target: { tagName: target }, preventDefault() { prevented = true; } });
    return prevented;
  };
  const tick = time => {
    assert.equal(frames.length, 1, 'exactly one queued animation frame');
    frames.shift()(time);
    assert.equal(frames.length, 1, 'frame schedules one successor');
  };
  return { html, elements, drawCalls, frames, run, value, key, tick };
}

assert.equal(files.length, 5, 'five standalone save points');

// The extracted foundation must retain the same baseline behavior and offline format.
for (const file of [...files, '../foundation/runner.html']) {
  test(`${file}: standalone, starts ready, and runs the drawing code`, () => {
    const game = load(file);
    assert.doesNotMatch(game.html, /<(script|link|img|iframe|audio|video)\b[^>]*(src|href)\s*=/i);
    assert.doesNotMatch(game.html, /@import|url\s*\(|\b(fetch|WebSocket|XMLHttpRequest)\s*\(/i);
    assert.equal(game.value('state.mode'), 'ready');
    assert.equal(game.value('state.score'), 0);
    assert.equal(game.elements.get('overlay').hidden, false);
    assert.ok(game.drawCalls.some(call => call[0] === 'fillRect'));
    game.tick(0);
    game.tick(16);
  });

  test(`${file}: jump, gravity, held key, landing, and fixed horizontal position`, () => {
    const game = load(file);
    assert.equal(game.key(), true, 'Space prevents page scrolling');
    assert.equal(game.value('state.mode'), 'running');
    assert.equal(game.elements.get('overlay').hidden, true);
    game.run('state.spawnTimer = 100; update(0.1)');
    const airborne = game.value('dino');
    assert.ok(airborne.y < 196);
    assert.ok(airborne.velocityY < 0);
    game.key(true);
    assert.equal(game.value('dino.velocityY'), airborne.velocityY, 'held key does not renew the jump');
    if (!file.includes('double')) {
      game.key();
      assert.equal(game.value('dino.velocityY'), airborne.velocityY, 'baseline blocks another airborne jump');
    }
    for (let i = 0; i < 150; i++) game.run('update(1 / 120)');
    assert.equal(game.value('dino.y + dino.height'), 244);
    assert.equal(game.value('dino.velocityY'), 0);
    assert.equal(game.value('dino.x'), 92);
    game.key();
    assert.ok(game.value('dino.velocityY') < 0, 'can jump after landing');
  });

  test(`${file}: scoring once, collision, frozen game over, and restart without extra loops`, () => {
    const game = load(file);
    game.key();
    game.run("state.spawnTimer = 100; state.obstacles = [{x: 70, y: 202, width: 28, height: 42, passed: false}]; dino.y = 80; update(0.04)");
    assert.equal(game.value('state.score'), 1);
    game.run('update(0.01)');
    assert.equal(game.value('state.score'), 1, 'one cactus only scores once');
    game.run('update(0.3)');
    assert.equal(game.value('state.obstacles.length'), 0, 'offscreen cactus is removed');
    game.run("dino.y = GROUND - dino.height; dino.velocityY = 0; state.obstacles = [{x: dino.x + 4, y: 202, width: 28, height: 42, passed: false}]; update(0)");
    assert.equal(game.value('state.mode'), 'gameover');
    assert.equal(game.elements.get('overlay').hidden, false);
    const frozen = game.value('{state, dino}');
    game.key();
    game.run('update(0.05)');
    assert.deepEqual(game.value('{state, dino}'), frozen);
    for (let i = 0; i < 3; i++) game.elements.get('restart').listeners.click();
    assert.equal(game.value('state.mode'), 'ready');
    assert.equal(game.value('state.score'), 0);
    assert.equal(game.value('state.obstacles.length'), 0);
    assert.equal(game.value('state.distance'), 0);
    assert.equal(game.value('state.spawnTimer'), 1);
    assert.equal(game.frames.length, 1, 'restart never schedules extra frames');
  });

  test(`${file}: a correctly timed jump can clear a cactus`, () => {
    const game = load(file);
    game.run("state.mode = 'running'; state.spawnTimer = 100; state.obstacles = [{x: 210, y: 202, width: 28, height: 42, passed: false}]");
    game.key();
    for (let i = 0; i < 200; i++) game.run('update(1 / 120)');
    assert.equal(game.value('state.mode'), 'running');
    assert.equal(game.value('state.score'), 1);
  });

  test(`${file}: long frame is capped and collision overlay uses the real rectangles`, () => {
    const game = load(file);
    game.key();
    game.tick(1000);
    game.tick(11000);
    assert.equal(game.value('state.distance'), 15, 'ten-second pause advances at most 0.05 seconds');
    game.drawCalls.length = 0;
    game.run('CONFIG.showHitboxes = true; draw()');
    const rectangles = game.drawCalls.filter(call => call[0] === 'strokeRect');
    assert.equal(rectangles.length, 1);
    assert.deepEqual(rectangles[0].slice(1), game.value('[dino.x, dino.y, dino.width, dino.height]'));
  });
}

function measureJump(file, moon = false) {
  const game = load(file);
  if (moon) game.elements.get('moon').checked = true;
  game.key();
  game.run('state.spawnTimer = 100');
  let minY = 196, seconds = 0;
  do {
    game.run('update(1 / 240)');
    seconds += 1 / 240;
    minY = Math.min(minY, game.value('dino.y'));
  } while (game.value('dino.y') < 196 && seconds < 3);
  return { height: 196 - minY, seconds };
}

test('higher jump: the single parameter change increases height and airtime', () => {
  const original = measureJump('01-baseline.html');
  const higher = measureJump('02-higher-jump.html');
  assert.ok(original.height > 100 && original.height < 110);
  assert.ok(higher.height > 148 && higher.height < 155);
  assert.ok(higher.seconds > original.seconds);
});

test('double jump: second press works, third is blocked, landing and restart restore allowance', () => {
  const game = load('03a-double-jump.html');
  game.key();
  game.run('state.spawnTimer = 100; update(0.1)');
  assert.equal(game.value('state.jumpsUsed'), 1);
  game.key();
  assert.equal(game.value('state.jumpsUsed'), 2);
  assert.equal(game.value('dino.velocityY'), -780);
  game.run('update(0.1)');
  const velocity = game.value('dino.velocityY');
  game.key();
  assert.equal(game.value('dino.velocityY'), velocity);
  for (let i = 0; i < 240; i++) game.run('update(1 / 120)');
  assert.equal(game.value('state.jumpsUsed'), 0);
  game.key();
  assert.equal(game.value('state.jumpsUsed'), 1);
  game.run('restart()');
  assert.equal(game.value('state.jumpsUsed'), 0);
});

test('Moon mode: more height and airtime; mode locks during a run and survives restart', () => {
  const normal = measureJump('03b-moon-mode.html');
  const moon = measureJump('03b-moon-mode.html', true);
  assert.ok(moon.height > normal.height * 1.7);
  assert.ok(moon.seconds > normal.seconds * 1.7);
  const game = load('03b-moon-mode.html');
  const checkbox = game.elements.get('moon');
  assert.equal(checkbox.disabled, false);
  assert.equal(game.key(false, 'INPUT'), false, 'Space on checkbox is left to the browser');
  assert.equal(game.value('state.mode'), 'ready');
  checkbox.checked = true;
  game.key();
  assert.equal(checkbox.disabled, true);
  game.run("state.mode = 'gameover'; updateHud()");
  assert.equal(checkbox.disabled, true);
  game.run('restart()');
  assert.equal(checkbox.disabled, false);
  assert.equal(checkbox.checked, true);
  checkbox.checked = false;
  game.key();
  game.run('update(0.1)');
  assert.equal(game.value('dino.velocityY'), -580, 'normal gravity is restored');
  assert.equal(game.value('CONFIG.gravity'), 2000);
});

test('progressive speed: boundaries, cap, all cacti moving together, no compounding, restart', () => {
  const game = load('03c-progressive-speed.html');
  for (const [score, expected] of [[0, 1], [4, 1], [5, 1.1], [9, 1.1], [10, 1.2], [40, 1.8], [45, 1.8]]) {
    game.run(`state.score = ${score}; updateHud()`);
    assert.equal(game.value('speedMultiplier()'), expected);
    assert.equal(game.elements.get('speed').textContent, `Speed: ${expected.toFixed(1)}×`);
  }
  game.run("state.mode = 'running'; state.score = 5; state.spawnTimer = 100; state.obstacles = [{x: 500, y: 202, width: 28, height: 42, passed: false}, {x: 700, y: 202, width: 28, height: 42, passed: false}]; update(0.1); update(0.1)");
  assert.deepEqual(game.value('state.obstacles.map(cactus => cactus.x)'), [434, 634]);
  assert.equal(game.value('CONFIG.runSpeed'), 300);
  game.run('restart()');
  assert.equal(game.value('speedMultiplier()'), 1);
});

test('high jumps: rendering follows the dinosaur without changing collision coordinates', () => {
  const game = load('03b-moon-mode.html');
  game.elements.get('moon').checked = true;
  game.key();
  game.run('state.spawnTimer = 100');
  for (let i = 0; i < 80; i++) game.run('update(1 / 120)');
  const worldY = game.value('dino.y');
  assert.ok(worldY < 0);
  game.drawCalls.length = 0;
  game.run('draw()');
  const translation = game.drawCalls.find(call => call[0] === 'translate');
  assert.ok(Math.abs(worldY + translation[2] - 24) < 0.001);
  assert.equal(game.value('dino.y'), worldY, 'camera movement does not alter physics');
});
