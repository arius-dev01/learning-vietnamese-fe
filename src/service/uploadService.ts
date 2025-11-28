import api from "./axiosClient";

export const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}