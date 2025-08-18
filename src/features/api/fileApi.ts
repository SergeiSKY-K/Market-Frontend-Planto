import axiosInstance from "./axiosInstance";

export const uploadFile = async (file: File | Blob, fileName?: string): Promise<string> => {
    const form = new FormData();
    // если Blob — добавим имя, чтобы на бэке не было "blob"
    if (file instanceof File) {
        form.append("file", file);
    } else {
        form.append("file", file, fileName && fileName.trim() ? fileName.trim() : "upload.bin");
    }
    if (fileName && fileName.trim()) {
        form.append("fileName", fileName.trim());
    }

    const { data } = await axiosInstance.post("/files", form /* без headers: Content-Type */);

    if (!data?.url) throw new Error("Upload failed: no URL returned from backend");
    return data.url as string;
};
