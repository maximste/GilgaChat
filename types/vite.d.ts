declare module "@fontsource/inter";

interface ImportMetaEnv {
  readonly VITE_API_HOST?: string;
  readonly VITE_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
