import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addUser } from "../service/userService";
import { UserDTO } from "../types/User";

export function useAddUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userDTO: UserDTO) => {
            await addUser(userDTO);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("Add user successfully");
        }
    })
}