interface Option {
    id: number;
    content: string;

    correct: boolean;
}

export interface Question {
    id: number;
    questionText: string;
    questionTextJa: string;

    image_url: string;
    gameId: number;
    lessonId: number;
    questionId: number;
    audio_url: boolean;
    options: Option[];
    sentence: string[];
    explanation: string;
    explanationJa: string;
}

interface AnswerDTO {
    gameId: number;
    questionId: number;
    playerId: number;
    lessonId: number;
    answer: string[];
    optionId: number;
}