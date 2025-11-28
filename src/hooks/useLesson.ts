import { useQuery } from "@tanstack/react-query";
import { getLessons } from "../service/lessonService";
import { LessonDTO } from "../types/Lession";
export interface LessonsResponse {
    lesson: LessonDTO[];
    totalPage: number;
}
export function useQueryLesson(page?: number, title?: string, level?: string, size?: number) {
    return useQuery<LessonsResponse>({
        queryKey: ['lessons', title, level, page],
        queryFn: () =>
            getLessons(page || 0, title || "", level || '', size || 100)

    })
}