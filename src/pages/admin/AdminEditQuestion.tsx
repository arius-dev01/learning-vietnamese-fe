import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteQuestion, updateQuestion } from "../../service/questionService";
import { Question } from "../../types/Question";

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
            correct: idx === oIndex
        }))

        setFormData(newData);
    }
    const handleChange = (qIndex: number, field: keyof Question, value: any) => {
        const newData = [...formData];
        newData[qIndex] = { ...newData[qIndex], [field]: value };
        setFormData(newData);
    };
    const handleSave = async () => {
        try {
            console.log(formData)
            await updateQuestion(data[0].gameId, data[0].lessonId, formData);
            toast.success("Questions updated successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to update questions.");
        }
    }

    const handleDeleteQuestion = async (questionId: number, gameId: number) => {
        try {
            await deleteQuestion(questionId, gameId);
            toast.success("Question deleted successfully!");
            setFormData(formData.filter(q => q.questionId !== questionId));
        } catch (error: any) {
            console.error(error.response.message);
        }
    }
    const addQuestion = () => {
        setFormData([
            ...formData,
            {
                id: 0,
                questionText: "",
                sentence: [""],
                audio_url: "",
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
                    }
                ],
                image_url: "",
                questionId: 0,
                explanation: "",
                lessonId: data[0]?.lessonId || 0,
                gameId: data[0]?.gameId || 0,
                questionTextJa: "",
                explanationJa: "",
            },
        ])
    }
    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newData = [...formData];
        newData[qIndex].options[oIndex] = {
            ...newData[qIndex].options[oIndex],
            content: value,
        };
        setFormData(newData);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Edit Questions</h1>

                <div className="space-y-6">
                    {formData.map((q, qIndex) => (
                        <div key={q.id} className="border p-4 rounded-lg space-y-3 relative">
                            <button onClick={() => handleDeleteQuestion(q.questionId, q.gameId)} className="absolute right-0 -top-2 text-sm text-white rounded-full bg-red-500"><FontAwesomeIcon icon={faX} /></button>

                            <h2 className="font-semibold">Question {q.id}</h2>

                            <input
                                type="text"
                                value={q.questionText}
                                onChange={(e) =>
                                    handleChange(qIndex, "questionText", e.target.value)
                                }
                                className="w-full p-2 border rounded"
                            />

                            <textarea
                                value={q.explanation || ""}
                                onChange={(e) =>
                                    handleChange(qIndex, "explanation", e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                rows={3}
                            />

                            <div className="">
                                <p className="font-medium mb-2">Options:</p>
                                {q.options.map((opt, oIndex) => (
                                    <div key={opt.id} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={opt.content}
                                            onChange={(e) =>
                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                            }
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <input
                                            type="radio"
                                            checked={opt.correct}
                                            onChange={() => handleCorrectOption(qIndex, oIndex)}
                                        />

                                        <span>Correct</span>
                                    </div>
                                ))}
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

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
