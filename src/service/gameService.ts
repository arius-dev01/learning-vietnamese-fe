import type { AnswerDTO } from "../types/Question";
import api from "./axiosClient";

export function startGame(typeGame?: string, lessonId?: number) {
    return api.post(`/game/${typeGame}/start/${lessonId}`)
}

export function submit(answerDTO: AnswerDTO) {
    return api.post("/game/submit_answer", answerDTO);
}

export function findGameByLessonId(lessonId: number | null, page?: number) {
    return api.get(`/game`, { params: { page, lessonId } });
}

export function deleteGame(gameId: number) {
    return api.delete(`/game/delete/${gameId}`);
}

export function getRecentActivities() {
    return api.get("/game/recent-activities");
}