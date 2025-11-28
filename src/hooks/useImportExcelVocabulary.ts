import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importExcel } from "../service/vocabularyService";

export function useImportExcelVocabulary() {
    const useQuery = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => {
            return importExcel(file);
        },
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ["vocabularies"] });
        }
    })
}