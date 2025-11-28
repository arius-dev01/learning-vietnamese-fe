import { useQuery } from "@tanstack/react-query";
import { findGameByLessonId } from "../service/gameService";
import { GameDTO } from "../types/Game";
export interface GameResponse {
    games: GameDTO[];
    totalPages: number;
}
export function useQueryGame(lessonId?: number, page?: number) {
    return useQuery<GameResponse>({
        queryKey: ["game", lessonId, page],
        queryFn: async () => {
            const res = await findGameByLessonId(lessonId ?? null, page || 0);
            return res.data;
        }

    })
}