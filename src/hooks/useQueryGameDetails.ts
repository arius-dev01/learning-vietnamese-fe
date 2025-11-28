import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findAllQuestionsByLessonIdAndGame } from "../service/questionService";

export function useQueryGameDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ lessonId, gameId }: { lessonId: number, gameId: number }) => {
            
            const res = await findAllQuestionsByLessonIdAndGame(lessonId, gameId);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game"] });
        }

    })
}