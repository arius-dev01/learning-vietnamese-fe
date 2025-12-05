import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteQuestion, updateQuestion } from "../../service/questionService";
import type { Question } from "../../types/Question";

interface EditQuestionProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Question[];
  gameType?: "MC" | "LS";
}

interface ValidationErrors {
  [key: string]: string;
}

export default function AdminEditQuestion({
  isOpen,
  onClose,
  data = [],
  gameType = "MC",
}: EditQuestionProps) {
  const [formData, setFormData] = useState<Question[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  console.log(data);

  useEffect(() => {
    setFormData(data);
    setErrors({});
  }, [data]);

  if (!isOpen) return null;
  const handleCorrectOption = (qIndex: number, oIndex: number) => {
    const newData = [...formData];
    newData[qIndex].options = newData[qIndex].options.map((opt, idx) => ({
      ...opt,
      correct: idx === oIndex,
    }));

    setFormData(newData);
  };
  const handleChange = (qIndex: number, field: keyof Question, value: any) => {
    const newData = [...formData];
    newData[qIndex] = { ...newData[qIndex], [field]: value };
    setFormData(newData);
    // Clear error when typing
    const errorKey = `${qIndex}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    formData.forEach((q, qIndex) => {
      // Validate question text
      if (!q.questionText || !q.questionText.trim()) {
        newErrors[`${qIndex}-questionText`] =
          "Question text (Vietnamese) is required";
      }

      // Validate question text Japanese (only if not audio)
      if (!q.audio_url && (!q.questionTextJa || !q.questionTextJa.trim())) {
        newErrors[`${qIndex}-questionTextJa`] =
          "Question text (Japanese) is required";
      }

      // Validate explanation
      if (!q.explanation || !q.explanation.trim()) {
        newErrors[`${qIndex}-explanation`] =
          "Explanation (Vietnamese) is required";
      }

      // Validate explanation Japanese
      if (!q.explanationJa || !q.explanationJa.trim()) {
        newErrors[`${qIndex}-explanationJa`] =
          "Explanation (Japanese) is required";
      }

      // Validate options
      q.options.forEach((opt, oIndex) => {
        if (!opt.content || !opt.content.trim()) {
          newErrors[
            `${qIndex}-option-${oIndex}`
          ] = `Option ${String.fromCharCode(65 + oIndex)} is required`;
        }
      });

      // Validate at least one correct option
      const hasCorrectOption = q.options.some((opt) => opt.correct);
      if (!hasCorrectOption) {
        newErrors[`${qIndex}-correctOption`] = "Please select a correct answer";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateQuestion(data[0].gameId, data[0].lessonId, formData);

      toast.success("Questions updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update questions.");
    }
  };

  const handleDeleteQuestion = async (
    questionId: number,
    gameId: number,
    questionIndex: number
  ) => {
    // Nếu question mới (questionId === 0) thì chỉ xóa trên UI, không call API
    if (questionId === 0) {
      setFormData(formData.filter((_, idx) => idx !== questionIndex));
      toast.success("Question removed!");
      return;
    }

    try {
      await deleteQuestion(questionId, gameId);
      toast.success("Question deleted successfully!");
      setFormData(formData.filter((q) => q.questionId !== questionId));
    } catch (error: any) {
      console.error(error.response.message);
    }
  };
  const addQuestion = () => {
    // Tạo 4 options cho MC, 6 options cho LS
    const optionCount = gameType === "LS" ? 6 : 4;
    const options = Array.from({ length: optionCount }, () => ({
      id: 0,
      content: "",
      correct: false,
    }));

    setFormData([
      ...formData,
      {
        id: 0,
        questionText: "",
        sentence: [""],
        audio_url: gameType === "LS", // LS thì có audio
        options,
        image_url: "",
        questionId: 0,
        explanation: "",
        lessonId: data[0]?.lessonId || 0,
        gameId: data[0]?.gameId || 0,
        questionTextJa: "",
        explanationJa: "",
      },
    ]);
  };
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newData = [...formData];
    newData[qIndex].options[oIndex] = {
      ...newData[qIndex].options[oIndex],
      content: value,
    };
    setFormData(newData);
    // Clear error when typing
    const errorKey = `${qIndex}-option-${oIndex}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleCorrectOptionWithClear = (qIndex: number, oIndex: number) => {
    handleCorrectOption(qIndex, oIndex);
    // Clear correct option error
    const errorKey = `${qIndex}-correctOption`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Edit Questions</h1>
          <button
            onClick={onClose}
            className="w-8 h-8 flex cursor-pointer items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {formData.map((q, qIndex) => (
              <div
                key={q.id}
                className="border border-gray-200 p-4 rounded-lg space-y-3 relative"
              >
                <button
                  onClick={() =>
                    handleDeleteQuestion(q.questionId, q.gameId, qIndex)
                  }
                  className="absolute -right-2 -top-2 cursor-pointer w-5 h-5  text-sm text-white rounded-full bg-red-500"
                >
                  <FontAwesomeIcon icon={faX} className="" />
                </button>

                <h2 className="font-semibold text-lg text-blue-600">
                  Question {qIndex + 1}
                </h2>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text (Vietnamese){" "}
                    <span className="text-red-500">*</span>{" "}
                    {q.audio_url && (
                      <span className="text-blue-500 text-xs ml-1">
                        🔊 Audio
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) =>
                      handleChange(qIndex, "questionText", e.target.value)
                    }
                    placeholder="Enter question text in Vietnamese..."
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`${qIndex}-questionText`]
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {errors[`${qIndex}-questionText`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`${qIndex}-questionText`]}
                    </p>
                  )}
                </div>

                {!q.audio_url && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Text (Japanese){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={q.questionTextJa}
                      onChange={(e) =>
                        handleChange(qIndex, "questionTextJa", e.target.value)
                      }
                      placeholder="Enter question text in Japanese..."
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${qIndex}-questionTextJa`]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {errors[`${qIndex}-questionTextJa`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`${qIndex}-questionTextJa`]}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Explanation (Vietnamese){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={q.explanation || ""}
                    onChange={(e) =>
                      handleChange(qIndex, "explanation", e.target.value)
                    }
                    placeholder="Enter explanation in Vietnamese..."
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`${qIndex}-explanation`]
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    rows={3}
                  />
                  {errors[`${qIndex}-explanation`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`${qIndex}-explanation`]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Explanation (Japanese){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={q.explanationJa || ""}
                    onChange={(e) =>
                      handleChange(qIndex, "explanationJa", e.target.value)
                    }
                    placeholder="Enter explanation in Japanese..."
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`${qIndex}-explanationJa`]
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    rows={3}
                  />
                  {errors[`${qIndex}-explanationJa`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`${qIndex}-explanationJa`]}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options <span className="text-red-500">*</span>
                  </label>
                  {errors[`${qIndex}-correctOption`] && (
                    <p className="text-red-500 text-xs mb-2">
                      {errors[`${qIndex}-correctOption`]}
                    </p>
                  )}
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={opt.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500 w-6">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <input
                            type="text"
                            value={opt.content}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + oIndex
                            )}...`}
                            className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[`${qIndex}-option-${oIndex}`]
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              className="cursor-pointer w-4 h-4 text-green-600"
                              checked={opt.correct}
                              onChange={() =>
                                handleCorrectOptionWithClear(qIndex, oIndex)
                              }
                            />
                            <span className="text-sm text-gray-600">
                              Correct
                            </span>
                          </label>
                        </div>
                        {errors[`${qIndex}-option-${oIndex}`] && (
                          <p className="text-red-500 text-xs ml-6">
                            {errors[`${qIndex}-option-${oIndex}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <span className="flex justify-end">
              <button
                onClick={addQuestion}
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                Add Question
              </button>
            </span>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-6 cursor-pointer py-2.5 text-gray-700 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 cursor-pointer py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
