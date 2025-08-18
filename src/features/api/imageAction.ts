import axiosInstance from "./axiosInstance";

export const uploadProductImage = async (
    file: Blob,
    fileName?: string | number
): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    if (fileName != null) form.append("fileName", String(fileName));

    const { data } = await axiosInstance.post("/files", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
    });

    if (data?.url) return data.url;
    if (typeof data === "string") return data;
    throw new Error("Upload failed: no url in response");
};
