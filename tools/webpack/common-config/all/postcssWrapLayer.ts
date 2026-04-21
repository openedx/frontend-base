import { AtRule, Plugin, Root } from 'postcss';

/*
 * Wraps every top-level rule in the stylesheet in a single `@layer <name> { ... }`
 * block, so that downstream cascade-layer ordering applies uniformly to everything
 * produced by this compilation unit.
 *
 * Nodes left at the root (not moved into the layer):
 * - `@charset`, `@import`, `@use`, `@forward` (must stay at the top of a stylesheet)
 * - `@layer` statements and blocks (already layered, or declaring layer order)
 */
export default function postcssWrapLayer({ layer }: { layer: string }): Plugin {
  const keepAtTop = new Set(['charset', 'import', 'use', 'forward', 'layer']);
  return {
    postcssPlugin: 'postcss-wrap-layer',
    Once(root: Root) {
      const layerRule = new AtRule({ name: 'layer', params: layer });
      root.each(node => {
        if (node.type === 'atrule' && keepAtTop.has(node.name)) {
          return;
        }
        node.remove();
        layerRule.append(node);
      });
      if (layerRule.nodes && layerRule.nodes.length > 0) {
        root.append(layerRule);
      }
    },
  };
}
