import { Question } from "../types/Question"
import api from "./axiosClient"

export const findAllQuestionsByLessonIdAndGame = (lessonId: number | null, gameId: number) => {
    return api.get(`/game/detail/${lessonId}/${gameId}`)
}

export const updateQuestion = (gameId: number, lessonId: number, questionDTO: Question[]) => {
    return api.put(`/question/update/${gameId}/${lessonId}`, questionDTO)
}

export const deleteQuestion = (questionId: number, gameId: number) => {
    return api.delete(`/question/delete/${gameId}/${questionId}`)
}

export const importQuestionExcelMC = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/question/import-question-mc', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const importQuestionExcelLC = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/question/import-question-lc', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const importQuestionExcelAR = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/question/import-question-ar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const addQuestion = (gameType: string, lessonId: number, questionDTO: Question[]) => {
    return api.post(`/question/add/${gameType}/${lessonId}`, questionDTO)
}