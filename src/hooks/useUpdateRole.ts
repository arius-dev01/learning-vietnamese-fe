import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { changeRole } from "../service/userService";
import { Role } from "../types/User";

export function useUpdateRole() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }: { userId: number, role: Role }) => {
            await changeRole(userId, role);
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ['users'] });
            toast.success("Update role successfully");
        }
    })
}

