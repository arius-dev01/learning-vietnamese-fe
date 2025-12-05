import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteQuestion, updateQuestion } from "../../service/questionService";
import type { Question } from "../../types/Question";

interface AdminArrangeQuestionProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Question[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function AdminArrangeQuestion({
  isOpen,
  onClose,
  data = [],
}: AdminArrangeQuestionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (data) {
      setQuestions(data);
      setErrors({});
    }
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);

    // Clear error when typing
    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleAdd = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        audio_url: false,
        questionText: `New Question ${newId}`,
        sentence: [""],
        options: [],
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
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    questions.forEach((q, index) => {
      // Validate sentence - phải có ít nhất 2 từ
      const sentence = q.sentence?.join(" ").trim();
      if (!sentence || sentence.length === 0) {
        newErrors[`${index}-sentence`] = "Sentence is required";
      } else if (q.sentence && q.sentence.filter((s) => s.trim()).length < 2) {
        newErrors[`${index}-sentence`] = "Sentence must have at least 2 words";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Chỉ validate khi có question
    if (questions.length > 0 && !validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const gameId = questions[0]?.gameId || data[0]?.gameId || 0;
      const lessonId = questions[0]?.lessonId || data[0]?.lessonId || 0;
      await updateQuestion(gameId, lessonId, questions);
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
      setQuestions(questions.filter((_, idx) => idx !== questionIndex));
      toast.success("Question removed!");
      return;
    }

    try {
      await deleteQuestion(questionId, gameId);
      toast.success("Question deleted successfully!");
      setQuestions(questions.filter((q) => q.questionId !== questionId));
    } catch (error: any) {
      console.error(error.response.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">📋 Admin - Arrange Question</h1>
          <button
            className="text-gray-500 cursor-pointer hover:text-red-500 text-2xl"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto pt-5">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="p-4  rounded-lg space-y-3 relative"
            >
              <button
                onClick={() =>
                  handleDeleteQuestion(q.questionId, q.gameId, index)
                }
                className="absolute cursor-pointer right-1 w-5 h-5 -top-2 text-sm text-white rounded-full bg-red-500"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
              {/* <input
                                type="text"
                                onChange={(e) =>
                                    handleChange(index, "questionText", e.target.value)
                                }
                                className="w-full border rounded p-2"
                                value=""
                                readOnly
                            /> */}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sentence <span className="text-red-500">*</span>
              </label>
              <textarea
                value={q.sentence?.join(" ") || ""}
                onChange={(e) =>
                  handleChange(index, "sentence", e.target.value.split(" "))
                }
                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[`${index}-sentence`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter sentence parts separated by spaces"
                rows={2}
              />
              {errors[`${index}-sentence`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-sentence`]}
                </p>
              )}
            </div>
          ))}
          <span className="flex justify-end">
            <button
              onClick={handleAdd}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Add Question
            </button>
          </span>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between">
          <button
            className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Update Question
          </button>
        </div>
      </div>
    </div>
  );
}
