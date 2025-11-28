import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteQuestion } from "../service/questionService";

export function useDeleteQuestion() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({ questionId, gameId }: { questionId: number; gameId: number }) => {
            try {
                await deleteQuestion(questionId, gameId);
                toast.success("Question deleted successfully!");
                return { questionId, gameId };
            } catch (error) {
                console.error("Failed to delete question:", error);
                toast.error("Failed to delete question!");
                throw error;
            }
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ['g'] });
        },
        onError: (error) => {
            console.error("Delete mutation error:", error);
        }
    });
}