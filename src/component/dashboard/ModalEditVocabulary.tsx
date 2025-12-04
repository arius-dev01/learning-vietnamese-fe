import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import type { VocabularyDTO } from "../../types/Lession";
import { useUpdateVocabulary } from "../../hooks/useUpdateVocabulary";
import { toast } from "react-toastify";

interface ModalEditVocabularyProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary?: VocabularyDTO;
}

interface FormErrors {
  word?: string;
  meaning?: string;
  meaningJa?: string;
  pronunciation?: string;
}

export default function ModalEditVocabulary({
  isOpen,
  onClose,
  vocabulary,
}: ModalEditVocabularyProps) {
  const { mutateAsync: mutateUpdateVocabulary } = useUpdateVocabulary();
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<VocabularyDTO>({
    id: vocabulary?.id || 0,
    lessonId: vocabulary?.lessonId || 0,
    word: vocabulary?.word || "",
    meaning: vocabulary?.meaning || "",
    pronunciation: vocabulary?.pronunciation || "",
    lesson: vocabulary?.lesson || "",
    meaningJa: vocabulary?.meaningJa || "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.word.trim()) {
      newErrors.word = "Vietnamese word is required";
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = "English meaning is required";
    }

    if (!formData.meaningJa.trim()) {
      newErrors.meaningJa = "Japanese meaning is required";
    }

    if (!formData.pronunciation.trim()) {
      newErrors.pronunciation = "Pronunciation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await mutateUpdateVocabulary(formData);
      toast.success("Vocabulary updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update vocabulary"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50  ">
      <div className="bg-white rounded-2xl  w-full  max-w-5xl  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Edit Vocabulary
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Update vocabulary information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        <div className="flex max-h-[calc(90vh-140px)]">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vocabulary Information
                </h3>

                {/* Lesson (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson
                  </label>
                  <input
                    type="text"
                    value={formData.lesson}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium tracking-tight bg-gray-100 text-gray-500"
                  />
                </div>

                {/* Vietnamese Word */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vietnamese Word <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={formData.word}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                      errors.word ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter Vietnamese word..."
                  />
                  {errors.word && (
                    <p className="mt-1 text-sm text-red-500">{errors.word}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* English Meaning */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Meaning <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="meaning"
                      value={formData.meaning}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.meaning ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter English meaning..."
                    />
                    {errors.meaning && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.meaning}
                      </p>
                    )}
                  </div>

                  {/* Japanese Meaning */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Japanese Meaning <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="meaningJa"
                      value={formData.meaningJa}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.meaningJa ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter Japanese meaning..."
                    />
                    {errors.meaningJa && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.meaningJa}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pronunciation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pronunciation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pronunciation"
                    value={formData.pronunciation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                      errors.pronunciation
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder="Enter pronunciation..."
                  />
                  {errors.pronunciation && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.pronunciation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 cursor-pointer py-2.5 text-gray-700 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 cursor-pointer py-2.5 bg-[#007AFF] hover:bg-[#0056CC] text-white font-medium text-sm rounded-lg transition-colors duration-150"
          >
            Update Vocabulary
          </button>
        </div>
      </div>
    </div>
  );
}
