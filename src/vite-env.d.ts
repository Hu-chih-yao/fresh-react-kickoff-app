
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_SEARCH_API_KEY: string;
  readonly VITE_GOOGLE_SEARCH_CX: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
