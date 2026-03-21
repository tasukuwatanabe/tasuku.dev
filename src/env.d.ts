/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly QIITA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
