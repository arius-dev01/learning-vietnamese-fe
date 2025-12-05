import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useCreateLesson } from "../../hooks/useCreateLesson";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";
import type { LessonDTO } from "../../types/Lession";

interface ModalLessonProps {
  isOpen: boolean;
  onClose: () => void;
  lesson?: LessonDTO;
}

interface FormErrors {
  title?: string;
  titleJa?: string;
  describe?: string;
  describeJa?: string;
  content?: string;
  contentJa?: string;
  video_url?: string;
}

export default function ModalLesson({
  isOpen,
  onClose,
  lesson,
}: ModalLessonProps) {
  const { mutateAsync: mutateCreateLesson } = useCreateLesson();
  const { mutateAsync: mutateUpdateLesson } = useUpdateLesson();
  const [errors, setErrors] = useState<FormErrors>({});
  console.log(lesson);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Lesson title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Validate title Japanese
    if (!formData.titleJa?.trim()) {
      newErrors.titleJa = "Lesson title (Japanese) is required";
    }

    // Validate description
    if (!formData.describe.trim()) {
      newErrors.describe = "Description is required";
    } else if (formData.describe.trim().length < 10) {
      newErrors.describe = "Description must be at least 10 characters";
    }

    // Validate description Japanese
    if (!formData.describeJa?.trim()) {
      newErrors.describeJa = "Description (Japanese) is required";
    }

    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    // Validate content Japanese
    if (!formData.contentJa?.trim()) {
      newErrors.contentJa = "Content (Japanese) is required";
    }

    // Video URL is optional - no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (lesson) {
        await mutateUpdateLesson(formData);

        onClose();
      } else {
        await mutateCreateLesson(formData);
        onClose();
      }
    } catch (error) {
      console.error("Error adding/updating lesson:", error);
    }
  };
  const [formData, setFormData] = useState<LessonDTO>({
    id: lesson ? lesson.id : 0,
    title: lesson ? lesson.title : "",
    describe: lesson ? lesson.describe : "",
    level: lesson ? lesson.level : "Beginner",
    content: lesson ? lesson.content : "",
    video_url: lesson ? lesson.video_url : "",
    time: lesson ? lesson.time : "",
    vocabularies: [],
    created: "",
    updated: "",
    gameCount: 0,
    progress: 0,
    typeGames: [],
    titleJa: lesson ? lesson.titleJa : "",
    describeJa: lesson ? lesson.describeJa : "",
    contentJa: lesson ? lesson.contentJa : "",
  });

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
              {lesson ? "Edit Lesson" : "Create New Lesson"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {lesson
                ? "Update lesson content and settings"
                : "Add a new lesson to the curriculum"}
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
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.title
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter lesson title..."
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title (Japanese) *
                    </label>
                    <input
                      type="text"
                      name="titleJa"
                      value={formData.titleJa || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.titleJa
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="レッスンタイトルを入力..."
                    />
                    {errors.titleJa && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.titleJa}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full px-4 py-3 border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:ring-0 text-sm font-medium tracking-tight"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="describe"
                    value={formData.describe}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 text-sm font-medium tracking-tight resize-none ${
                      errors.describe ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Brief description of the lesson..."
                  />
                  {errors.describe && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.describe}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Japanese) *
                  </label>
                  <textarea
                    name="describeJa"
                    value={formData.describeJa || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 text-sm font-medium tracking-tight resize-none ${
                      errors.describeJa ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="レッスンの説明を入力..."
                  />
                  {errors.describeJa && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.describeJa}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Media & Resources
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                      errors.video_url ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.video_url && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.video_url}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Lesson Content
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 text-sm font-medium tracking-tight resize-none ${
                      errors.content ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter the lesson content..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.content}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Japanese) *
                  </label>
                  <textarea
                    name="contentJa"
                    value={formData.contentJa || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-0 text-sm font-medium tracking-tight resize-none ${
                      errors.contentJa ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="レッスン内容を入力..."
                  />
                  {errors.contentJa && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contentJa}
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
            onClick={() => handleAddOrUpdate()}
            className="px-6 cursor-pointer py-2.5 bg-[#007AFF] hover:bg-[#0056CC] text-white font-medium text-sm rounded-lg transition-colors duration-150"
          >
            {lesson ? "Update Lesson" : "Create Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
