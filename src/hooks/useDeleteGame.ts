import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGame } from "../service/gameService";

export function useDeleteGame() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (gameId: number) => {
            await deleteGame(gameId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game"] });
        }
    })

}