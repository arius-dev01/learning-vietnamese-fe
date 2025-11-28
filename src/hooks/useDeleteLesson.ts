import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteLesson } from "../service/lessonService";

export function useDeleteLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => {
            return deleteLesson(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            toast.success('Lesson deleted successfully!');
        }
    })
}