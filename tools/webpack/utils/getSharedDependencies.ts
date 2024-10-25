export default function getSharedDependencies({ isShell }: { isShell: boolean }) {
  return {
    react: {
      singleton: true,
      requiredVersion: '^17.0.0',
      eager: isShell,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^17.0.0',
      eager: isShell,
    },
    '@openedx/paragon': {
      requiredVersion: '^22.0.0',
      eager: isShell,
    },
    '@openedx/frontend-base': {
      singleton: true,
      eager: isShell,
      requiredVersion: '^1',
    },
    'react-redux': {
      requiredVersion: '^7.2.9',
      eager: isShell
    },
    'react-router': {
      requiredVersion: '^6.22.3',
      eager: isShell
    },
    'react-router-dom': {
      requiredVersion: '^6.22.3',
      eager: isShell
    },
    redux: {
      requiredVersion: '^4.2.1',
      eager: isShell
    },
  };
}
