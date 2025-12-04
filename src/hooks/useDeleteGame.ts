import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGame } from "../service/gameService";
import { toast } from "react-toastify";

export function useDeleteGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gameId: number) => {
      await deleteGame(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      toast.success("Delete game successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete game");
    },
  });
}
