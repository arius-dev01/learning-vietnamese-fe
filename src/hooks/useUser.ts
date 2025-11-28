import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../service/userService";
import { Role, UserDTO } from "../types/User";
export interface UserResponse {
    totalPage: number;
    users: UserDTO[];
}
export const useUserQuery = (keyword?: string, role?: Role, page?: number) => {
    return useQuery<UserResponse>({
        queryKey: ['users', keyword, role, page],
        queryFn: () => getUsers(keyword || '',role || Role.ALL, page || 0)
    })
}