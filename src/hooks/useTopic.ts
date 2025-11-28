import { useQuery } from "@tanstack/react-query";
import { findAllTopic } from "../service/topicService";
import { TopicDTO } from "../types/Topic";
export interface topicResponse {
    totalPages: number;
    topics: TopicDTO[];
}
export function useTopicQuery(typeGameId?: number, page?: number, name?: string) {
    return useQuery<topicResponse>({
        queryKey: ["vocabularies", typeGameId, page, name],
        queryFn: () => {
            return findAllTopic(typeGameId ?? null, page || 0, name || "");
        },
    });
}
