import { UserAchievementDTO } from "../types/userAchiemenet";
import api from "./axiosClient";

export const getUserAchievement = async (): Promise<UserAchievementDTO> => {
    const res = await api.get<UserAchievementDTO>(`/user-achievement`);
    return res.data;
}