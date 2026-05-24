/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full origin for quote API when the app is not served from the same host (e.g. local Vite → deployed Vercel API). */
  readonly VITE_QUOTE_API_URL?: string;
}

declare const __BASE_PATH__: string;
declare const __IS_PREVIEW__: boolean;
declare const __READDY_PROJECT_ID__: string;
declare const __READDY_VERSION_ID__: string;
declare const __READDY_AI_DOMAIN__: string;