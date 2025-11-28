import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addQuestion } from "../service/questionService";
import { Question } from "../types/Question";

interface AddQuestionParams {
    gameType: string;
    lessonId: number;
    questions: Question[];
}

export function useAddQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ gameType, lessonId, questions }: AddQuestionParams) => {
            return await addQuestion(gameType, lessonId, questions);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] });
            queryClient.invalidateQueries({ queryKey: ['game'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add questions");
        }
    });
}