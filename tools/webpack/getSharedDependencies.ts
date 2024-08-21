export default function getSharedDependencies() {
  return {
    react: {
      singleton: true,
      requiredVersion: '^17.0.0',
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^17.0.0',
    },
    '@openedx/paragon': {
      requiredVersion: '^22.0.0',
    },
    '@openedx/frontend-base': {
      singleton: true,
      requiredVersion: '^1',
    },
    'react-redux': {
      requiredVersion: '^7.2.9',
    },
    'react-router': {
      requiredVersion: '^6.22.3',
    },
    'react-router-dom': {
      requiredVersion: '^6.22.3',
    },
    redux: {
      requiredVersion: '^4.2.1',
    },
  }
}
