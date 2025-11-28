import { topicResponse } from "../hooks/useTopic";
import api from "./axiosClient";

export const findAllTopic = async (typeGameId: number | null, page: number, name: string): Promise<topicResponse> => {
    const res = await api.get<topicResponse>("/topic", { params: { typeGameId, page, name } });
    return res.data;
}


