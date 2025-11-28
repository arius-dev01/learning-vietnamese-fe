import { LessonsResponse } from "../hooks/useLesson";
import { LessonDTO } from "../types/Lession";
import api from "./axiosClient";

export async function getLessons(page: number,title: string, level: string | null, size: number): Promise<LessonsResponse> {
    const res = await api.get<LessonsResponse>('/lesson', { params: {page, title, level,size } });
    return res.data;
}

export function addLesson(lessonDTO: LessonDTO) {
    return api.post('/lesson/add_lesson', lessonDTO);
}


export function updateLesson(lessonDTO: LessonDTO) {
    return api.put('/lesson/update_lesson', lessonDTO);
}

export function getLessonByTitle(title: string) {
    return api.get(`/lesson/findByTitle/${title}`);
}

export function deleteLesson(id: number) {
    return api.delete(`/lesson/delete_lesson/${id}`);
}

export async function getLessonsByUser(page: number,title: string, level: string, size: number): Promise<LessonsResponse> {
    const res = await api.get<LessonsResponse>('/lesson/findByUser', { params: {page, title, level,size } });
    return res.data;
}

export function getLessonTop10Completed() {
    return api.get(`/lesson/top-lesson`);
}
