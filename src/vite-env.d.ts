interface ImportMetaEnv
{
    VITE_IMAGEKIT_EMPTY_PHOTO: any;
    VITE_IMAGEKIT_ENDPOINT: any;
    readonly VITE_BASE_API_URL: string;
    readonly VITE_BASE_PRODUCT_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
