import { transform } from '@formatjs/ts-transformer';
import { RuleSetRule } from 'webpack';

export default function getCodeRules(mode: 'dev' | 'production', resolvedSiteConfigPath: string) {

  const rules: RuleSetRule[] = [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      include: [
        /src/,
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
            return {
              before: [
                transform({
                  overrideIdFn: '[sha512:contenthash:base64:6]',
                }),
              ],
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