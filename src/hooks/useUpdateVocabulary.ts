import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVocabulary } from "../service/vocabularyService";
import { VocabularyDTO } from "../types/Lession";

export function useUpdateVocabulary() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: (vocabularyDTO: VocabularyDTO) => {
            return updateVocabulary(vocabularyDTO);
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ["vocabularies"] });
        }
    })
}