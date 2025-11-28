import { useQuery } from "@tanstack/react-query";
import { findAllQuestionsByLessonIdAndGame } from "../service/questionService";

export function useQueryQuestion(lessonId?: number | null, gameId?: number) {
    return useQuery({
        queryKey: ['question', lessonId, gameId],
        queryFn: () => {
            findAllQuestionsByLessonIdAndGame(lessonId || null, gameId || 0);
        }
    })
}