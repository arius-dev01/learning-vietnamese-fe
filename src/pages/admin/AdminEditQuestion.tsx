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
}

export default function AdminEditQuestion({
  isOpen,
  onClose,
  data = [],
}: EditQuestionProps) {
  const [formData, setFormData] = useState<Question[]>([]);
  useEffect(() => {
    setFormData(data);
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
  };
  const handleSave = async () => {
    try {
      await updateQuestion(data[0].gameId, data[0].lessonId, formData);
      console.log(formData);

      toast.success("Questions updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update questions.");
    }
  };

  const handleDeleteQuestion = async (questionId: number, gameId: number) => {
    try {
      await deleteQuestion(questionId, gameId);
      toast.success("Question deleted successfully!");
      setFormData(formData.filter((q) => q.questionId !== questionId));
    } catch (error: any) {
      console.error(error.response.message);
    }
  };
  const addQuestion = () => {
    setFormData([
      ...formData,
      {
        id: 0,
        questionText: "",
        sentence: [""],
        audio_url: false,
        options: [
          {
            id: 0,
            content: "",
            correct: false,
          },
          {
            id: 0,
            content: "",
            correct: false,
          },
          {
            id: 0,
            content: "",
            correct: false,
          },
          {
            id: 0,
            content: "",
            correct: false,
          },
        ],
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
                  onClick={() => handleDeleteQuestion(q.questionId, q.gameId)}
                  className="absolute -right-2 -top-2 cursor-pointer w-5 h-5  text-sm text-white rounded-full bg-red-500"
                >
                  <FontAwesomeIcon icon={faX} className="" />
                </button>

                <h2 className="font-semibold text-lg text-blue-600">
                  Question {qIndex + 1}
                </h2>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text (Vietnamese) {q.audio_url && <span className="text-blue-500 text-xs ml-1">🔊 Audio</span>}
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) =>
                      handleChange(qIndex, "questionText", e.target.value)
                    }
                    placeholder="Enter question text in Vietnamese..."
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {!q.audio_url && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Text (Japanese)
                    </label>
                    <input
                      type="text"
                      value={q.questionTextJa}
                      onChange={(e) =>
                        handleChange(qIndex, "questionTextJa", e.target.value)
                      }
                      placeholder="Enter question text in Japanese..."
                      className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Explanation (Vietnamese)
                  </label>
                  <textarea
                    value={q.explanation || ""}
                    onChange={(e) =>
                      handleChange(qIndex, "explanation", e.target.value)
                    }
                    placeholder="Enter explanation in Vietnamese..."
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Explanation (Japanese)
                  </label>
                  <textarea
                    value={q.explanationJa || ""}
                    onChange={(e) =>
                      handleChange(qIndex, "explanationJa", e.target.value)
                    }
                    placeholder="Enter explanation in Japanese..."
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={opt.id} className="flex items-center gap-2">
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
                          className="flex-1 p-2  border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            className="cursor-pointer w-4 h-4 text-green-600"
                            checked={opt.correct}
                            onChange={() => handleCorrectOption(qIndex, oIndex)}
                          />
                          <span className="text-sm text-gray-600">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <span className="flex justify-end">
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
