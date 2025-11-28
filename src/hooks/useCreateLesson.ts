import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLesson } from "../service/lessonService";
import { LessonDTO } from "../types/Lession";
import { toast } from "react-toastify";

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (lessonDTO: LessonDTO) => addLesson(lessonDTO),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            toast.success("Lesson created successfully");
        }
    })
}