import { useQuery } from "@tanstack/react-query";
import { getVocabularies } from "../service/vocabularyService";
import { VocabularyDTO } from "../types/Lession";
export interface vocabularyResponse {
    totalPage: number;
    // totalItem: number;
    vocabularies: VocabularyDTO[];
}
export function useVocabularyQuery(word?: string, lessonId?: number, page?: number) {
    return useQuery<vocabularyResponse>({
        queryKey: ["vocabularies", word, page, lessonId],
        queryFn: () => {
            return getVocabularies(word || "", lessonId ?? null, page || 0);
        },
    });
}
