import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addUser, editUser } from "../service/userService";
import type { UserDTO } from "../types/User";

export function useEditUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userDTO: UserDTO) => {
            await editUser(userDTO);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("Edit user successfully");
        }
    })
}