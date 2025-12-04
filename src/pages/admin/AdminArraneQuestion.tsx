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

export default function AdminArrangeQuestion({
    isOpen,
    onClose,
    data = [],
}: AdminArrangeQuestionProps) {
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions(data);
        }
    }, [data]);

    if (!isOpen) return null;

    const handleChange = (index: number, field: keyof Question, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
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
    const handleSave = async () => {
        try {
            await updateQuestion(questions[0].gameId, questions[0].lessonId, questions);
            console.log(questions);
            toast.success("Questions updated successfully!");
            data = [];
            onClose();
        } catch (error) {
            toast.error("Failed to update questions.");
        }
    }
    const handleDeleteQuestion = async (questionId: number, gameId: number) => {
        try {
            await deleteQuestion(questionId, gameId);
            toast.success("Question deleted successfully!");
            setQuestions(questions.filter(q => q.questionId !== questionId));
        } catch (error: any) {
            console.error(error.response.message);
        }
    }
    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[700px] p-6 rounded-xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">📋 Admin - Arrange Question</h1>
                    <button
                        className="text-gray-500 hover:text-red-500 text-2xl"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>

                {/* Danh sách câu hỏi */}
                <div className="space-y-6 max-h-[400px] overflow-y-auto">
                    {questions.map((q, index) => (
                        <div
                            key={q.id}
                            className="p-4 bg-gray-100 rounded-lg space-y-3 relative"
                        >
                            <button onClick={() => handleDeleteQuestion(q.questionId, q.gameId)} className="absolute right-0 -top-2 text-sm text-white rounded-full bg-red-500"><FontAwesomeIcon icon={faX} /></button>
                            {/* <input
                                type="text"
                                onChange={(e) =>
                                    handleChange(index, "questionText", e.target.value)
                                }
                                className="w-full border rounded p-2"
                                value=""
                                readOnly
                            /> */}

                            <textarea
                                value={q.sentence?.join(" ") || ""}
                                onChange={(e) =>
                                    handleChange(index, "sentence", e.target.value.split(" "))
                                }
                                className="w-full border rounded p-2"
                                placeholder="Enter sentence parts separated by spaces"
                                rows={2}
                            />
                        </div>
                    ))}
                    <span className="flex justify-end">
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            Add Question
                        </button>
                    </span>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-between">
                    <button
                        className="px-4 py-2 border rounded-lg"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave()}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Update Question
                    </button>
                </div>
            </div>
        </div>
    );
}
