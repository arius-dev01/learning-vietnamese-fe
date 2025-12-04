import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGame } from "../service/gameService";
import { deleteVocabulary } from "../service/vocabularyService";
import { toast } from "react-toastify";

export function useDeleteVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gameId: number) => {
      await deleteVocabulary(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularies"] });
      toast.success("Delete vocabulary successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete vocabulary"
      );
    },
  });
}
