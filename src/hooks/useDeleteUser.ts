import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../service/userService";
import { toast } from "react-toastify";

export function useDeleteRole() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId }: { userId: number }) => {
            await deleteUser(userId);
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ['users'] });
            toast.success("Delete user successfully");
        }
    })
}

