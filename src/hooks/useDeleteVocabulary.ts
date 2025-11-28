import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGame } from "../service/gameService";
import { deleteVocabulary } from "../service/vocabularyService";

export function useDeleteVocabulary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (gameId: number) => {
            await deleteVocabulary(gameId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
        }
    })
}