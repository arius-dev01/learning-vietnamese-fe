import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addVocabulary } from "../service/vocabularyService";
import { VocabularyDTO } from "../types/Lession";

export function useAddVocabulary() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: ({ vocabularyDTO, lessonId }: { vocabularyDTO: VocabularyDTO[], lessonId: number }) => {
            return addVocabulary(vocabularyDTO, lessonId);
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ["vocabularies"] });
        }
    })
}