import { transform } from '@formatjs/ts-transformer';
import ReactRefreshTypeScript from 'react-refresh-typescript';

import { RuleSetRule } from 'webpack';

export default function getCodeRules(mode: 'dev' | 'production', resolvedSiteConfigPath: string) {
  const rules: RuleSetRule[] = [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      include: [
        /src/,
        /node_modules\/@openedx\/frontend-base/,
        resolvedSiteConfigPath,
      ],
      use: {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
          compilerOptions: {
            noEmit: false,
          },
          getCustomTransformers() {
            const before = [
              transform({
                overrideIdFn: '[sha512:contenthash:base64:6]',
              }),
            ]
            if (mode === 'dev') {
              before.push(ReactRefreshTypeScript());
            }
            return {
              before,
            };
          },
        },
      },
    },
  ]

  if (mode === 'production') {
    rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: [
        require.resolve('source-map-loader'),
      ],
      enforce: 'pre',
    })
  }

  return rules;
}
