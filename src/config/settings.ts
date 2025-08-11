function getEnvVar(name: string): string {
  const value = (import.meta as any).env[name];
  if (!value) {
    console.warn(`Environment variable ${name} is not set. Using default value for development.`);
    return `dev_${name.toLowerCase()}`;
  }
  return value;
}

export const SETTINGS = {
  aws: {
    cognito: {
      userPoolId: getEnvVar('VITE_AWS_USER_POOL_ID'),
      userPoolClientId: getEnvVar('VITE_AWS_CLIENT_ID')
    }
  },
  clarifai: {
    PAT: getEnvVar('VITE_CLARIFAI_PAT'),
    USER_ID: getEnvVar('VITE_CLARIFAI_USER_ID'),
    APP_ID: getEnvVar('VITE_CLARIFAI_APP_ID'),
    MODEL_ID: getEnvVar('VITE_CLARIFAI_MODEL_ID'),
    MODEL_VERSION_ID: getEnvVar('VITE_CLARIFAI_MODEL_VERSION_ID')
  },
  corsProxies: [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ]
} as const;
