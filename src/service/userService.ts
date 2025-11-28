import { UserResponse } from "../hooks/useUser";
import { Role, UserDTO } from "../types/User";
import api from "./axiosClient";

export const getInforUser = () => {
    return api.get("/user/me");
};
export const logout = () => {
    return api.delete("/logout");
}
export const editProdile = (userDTO: UserDTO) => {
    return api.put("/user/edit-profile", userDTO)
}

export const addUser = (userDTO: UserDTO) => {
    return api.post("/add", userDTO)
}
export async function getUsers(keyword: string, role: Role, page: number): Promise<UserResponse> {
    const res = await api.get<UserResponse>("/user", { params: { keyword, role, page } });
    return res.data;
}

export const changeRole = (userId: number, role: Role) => {
    return api.put(`/update-role/${userId}/${role}`);
}
export const translationLanguage = (language: string) => {
    return api.put(`/user/translate-language`,null, { params: { language } });
}
export const deleteUser = (userId: number) => {
    return api.delete(`/delete/${userId}`);
}