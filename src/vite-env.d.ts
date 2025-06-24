/// <reference types="vite/client" />
interface ImportMetaEnv
{
    readonly VITE_BASE_PRODUCT_URL: string;
    readonly VITE_IMAGEKIT_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
