import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAddVocabulary } from "../../hooks/useAddVocabulary";
import { useImportExcelVocabulary } from "../../hooks/useImportExcelVocabulary";
import { useQueryLesson } from "../../hooks/useLesson";
import { useUpdateVocabulary } from "../../hooks/useUpdateVocabulary";
import type { VocabularyDTO } from "../../types/Lession";
import { downloadFileFormatVocabulary } from "../../service/vocabularyService";

interface ModalVocabularyProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function ModalVocabulary({
  isOpen = true,
  onClose,
}: ModalVocabularyProps) {
  const { mutateAsync: mutateImportExcel } = useImportExcelVocabulary();
  const { mutateAsync: mutateAddVocabulary } = useAddVocabulary();
  const { mutateAsync: mutateUpdateVocabulary } = useUpdateVocabulary();

  const [vocabulay, setVocabulary] = useState<VocabularyDTO[]>([]);
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await mutateImportExcel(file);
      setVocabulary(res.data);
    }
    // Reset input value to allow re-importing same file
    e.target.value = "";
  };
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const { data: lessonData } = useQueryLesson();
  const handleChangeInput = (
    index: number,
    field: keyof VocabularyDTO,
    value: string
  ) => {
    setVocabulary((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleDeleteVocabulary = (index: number) => {
    setVocabulary((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    try {
      if (vocabulay.length > 0) {
        await mutateAddVocabulary({
          vocabularyDTO: vocabulay,
          lessonId: selectedLessonId || 0,
        });
        toast.success("Vocabularies added successfully");
        onClose();
      }
    } catch (error: any) {
      console.error("Error adding vocabularies:", error.message);
    }
  };
  const verifyVocabulary = () => {
    if (selectedLessonId === null) {
      toast.error("Please select a lesson");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await downloadFileFormatVocabulary();
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vocabulary_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error: any) {
      console.error(
        "Error downloading template:",
        error.response?.data?.message || error.message
      );
    }
  };
  if (!isOpen) return null;
  const options = lessonData?.lesson?.map((l) => ({
    value: l.id,
    label: l.title,
  }));
  console.log(vocabulay);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 ">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Vocabularies
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add one or multiple vocabulary entries. You can also import from
              Excel.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-full transition-all duration-200"
          >
            <FontAwesomeIcon icon={faX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Lesson <span className="text-red-500">*</span>
                </label>
                <Select
                  options={options}
                  onChange={(option) =>
                    setSelectedLessonId(option ? option.value : null)
                  }
                  placeholder="Choose a leasson..."
                  className="w-full cursor-pointer"
                  isSearchable
                  isClearable
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Import File
                </label>
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Import Excel
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  id="fileInput"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">Excel Format:</p>
                    <p className="text-blue-700">
                      Columns: Vietnamese Word | English Meaning | Pronunciation
                    </p>
                    <p>
                      Data will be read from <strong>row 2 onwards</strong>{" "}
                      (header row 1 will be skipped)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadTemplate()}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Template
                </button>
              </div>
            </div>
          </div>

          {vocabulay.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Imported Vocabularies ({vocabulay.length})
                </h3>
                {/* <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                </div> */}
              </div>

              <div className="grid gap-4">
                {vocabulay.map((item, index) => (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteVocabulary(index)}
                        className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Vietnamese Word
                        </label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Xin chào"
                          onChange={(e) =>
                            handleChangeInput(index, "word", e.target.value)
                          }
                          value={item.word}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          English Meaning
                        </label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Hello"
                          onChange={(e) =>
                            handleChangeInput(index, "meaning", e.target.value)
                          }
                          value={item.meaning}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Pronunciation
                        </label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="sin chao"
                          onChange={(e) =>
                            handleChangeInput(
                              index,
                              "pronunciation",
                              e.target.value
                            )
                          }
                          value={item.pronunciation}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vocabulay.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No vocabularies yet
              </h3>
              <p className="text-gray-500 mb-4">
                Import an Excel file to get started
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {vocabulay.length > 0 && (
              <span className="font-medium">
                {vocabulay.length} vocabularies ready to save
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border cursor-pointer border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSubmit();
                verifyVocabulary();
              }}
              disabled={vocabulay.length === 0}
              className="px-6 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Save {vocabulay.length > 0 && `(${vocabulay.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
