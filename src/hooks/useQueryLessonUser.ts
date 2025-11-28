import { useQuery } from "@tanstack/react-query";
import { getLessons, getLessonsByUser } from "../service/lessonService";
import { LessonDTO } from "../types/Lession";
export interface LessonsResponse {
    lesson: LessonDTO[];
    totalPage: number;
}
export function useQueryLessonUser(page?: number, title?: string, level?: string, size?: number, language?: string) {
    return useQuery<LessonsResponse>({
        queryKey: ['lesson', title, level, page, language],
        queryFn: () =>
            getLessonsByUser(page || 0, title || "", level || '', size || 100)

    })
}