import postcss from 'postcss';
import postcssWrapLayer from './postcssWrapLayer';

async function run(input: string, layer = 'shell') {
  const result = await postcss([postcssWrapLayer({ layer })]).process(input, { from: undefined });
  return result.css.trim();
}

describe('postcssWrapLayer', () => {
  it('wraps a plain rule in the named layer', async () => {
    const output = await run('.foo { color: red; }');
    expect(output).toMatch(/^@layer shell\s*\{[\s\S]*\.foo[\s\S]*\}\s*$/);
  });

  it('leaves @charset at the root', async () => {
    const output = await run('@charset "UTF-8";\n.foo { color: red; }');
    expect(output).toMatch(/^@charset "UTF-8";/);
    expect(output).toContain('@layer shell{');
    expect(output).toContain('.foo');
  });

  it('leaves @import at the root', async () => {
    const output = await run('@import "other.css";\n.foo { color: red; }');
    expect(output).toMatch(/^@import "other\.css";/);
    expect(output).toContain('@layer shell{');
  });

  it('leaves @use at the root', async () => {
    const output = await run('@use "other";\n.foo { color: red; }');
    expect(output).toMatch(/^@use "other";/);
    expect(output).toContain('@layer shell{');
  });

  it('leaves @forward at the root', async () => {
    const output = await run('@forward "other";\n.foo { color: red; }');
    expect(output).toMatch(/^@forward "other";/);
    expect(output).toContain('@layer shell{');
  });

  it('leaves @layer order statements at the root', async () => {
    const output = await run('@layer shell, app, brand, site;\n.foo { color: red; }');
    expect(output).toMatch(/^@layer shell, app, brand, site;/);
    expect(output).toContain('@layer shell{');
    // The order statement is not nested inside the wrap.
    expect(output).not.toMatch(/@layer shell\s*\{[\s\S]*@layer shell, app, brand, site;/);
  });

  it('leaves existing @layer blocks at the root (does not nest them)', async () => {
    const output = await run('@layer paragon { .bar { color: blue; } }\n.foo { color: red; }');
    // The paragon block stays at the root.
    expect(output).toMatch(/^@layer paragon \{/);
    // The .foo rule is wrapped in shell; the paragon block is not inside it.
    expect(output).not.toMatch(/@layer shell\s*\{[\s\S]*@layer paragon/);
    expect(output).toMatch(/@layer shell\s*\{/);
  });

  it('emits nothing extra when there is no wrappable content', async () => {
    const output = await run('@layer shell, app, brand, site;');
    expect(output).toBe('@layer shell, app, brand, site;');
    expect(output).not.toContain('@layer shell{');
  });

  it('wraps multiple sibling rules in a single layer block in source order', async () => {
    const output = await run('.a { color: red; }\n.b { color: blue; }\n.c { color: green; }');
    expect(output.match(/@layer shell\s*\{/g)).toHaveLength(1);
    const a = output.indexOf('.a');
    const b = output.indexOf('.b');
    const c = output.indexOf('.c');
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });
});
