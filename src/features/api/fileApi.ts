import axiosInstance from "./axiosInstance";

export type UploadResult = { url: string; fileId: string };

export const uploadFile = async (
    file: File | Blob,
    fileName?: string | number
): Promise<UploadResult> => {
    const form = new FormData();

    if (file instanceof File) {
        form.append("file", file);
    } else {
        form.append("file", file, String(fileName ?? "upload.bin"));
    }
    if (fileName != null && String(fileName).trim()) {
        form.append("fileName", String(fileName).trim());
    }


    const { data } = await axiosInstance.post("/files", form);

    if (data?.error) throw new Error(data.error);
    if (!data?.url || !data?.fileId) {
        throw new Error("Upload failed: backend didn't return {url, fileId}");
    }
    return { url: data.url as string, fileId: data.fileId as string };
};
