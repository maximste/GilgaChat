declare module "@fontsource/inter";

interface ImportMetaEnv {
  readonly VITE_API_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
