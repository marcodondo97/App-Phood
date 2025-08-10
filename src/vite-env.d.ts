/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_USER_POOL_ID: string
  readonly VITE_AWS_CLIENT_ID: string
  readonly VITE_CLARIFAI_PAT: string
  readonly VITE_CLARIFAI_USER_ID: string
  readonly VITE_CLARIFAI_APP_ID: string
  readonly VITE_CLARIFAI_MODEL_ID: string
  readonly VITE_CLARIFAI_MODEL_VERSION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
