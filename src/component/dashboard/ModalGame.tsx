import { useEffect, useState } from "react";
import { useQueryLesson } from "../../hooks/useLesson";

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    type: "multiple" | "listen" | "arrange";
    question: string;
    audioUrl?: string;
    options: Option[];
    explanation: string;
}

interface ModalGameQuestionProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (question: Question) => void;
    initialData?: Question;
    gameType: "multiple" | "listen" | "arrange";
}

export default function ModalGame({
    isOpen,
    onClose,
    onSave,
    initialData,
    gameType,
}: ModalGameQuestionProps) {
    const [question, setQuestion] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [explanation, setExplanation] = useState("");

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setQuestion(initialData.question);
            setOptions(initialData.options || []);
            setExplanation(initialData.explanation || "");
            if (gameType === "listen" && initialData.audioUrl) {
                setAudioUrl(initialData.audioUrl);
            }
        } else {
            resetForm();
        }
    }, [initialData, gameType]);

    const resetForm = () => {
        setQuestion("");
        setAudioUrl("");
        if (gameType === "multiple" || gameType === "listen") {
            setOptions([
                { id: "1", text: "", isCorrect: false },
                { id: "2", text: "", isCorrect: false },
                { id: "3", text: "", isCorrect: false },
                { id: "4", text: "", isCorrect: false },
            ]);
        } else if (gameType === "arrange") {
            setOptions([{ id: "1", text: "", isCorrect: true }]);
        }
        setExplanation("");
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectAnswerChange = (index: number) => {
        const newOptions = options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index,
        }));
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        const questionData: Question = {
            id: initialData?.id || Date.now().toString(),
            type: gameType,
            question,
            audioUrl: gameType === "listen" ? audioUrl : undefined,
            options,
            explanation,
        };
        onSave(questionData);
        resetForm();
        onClose();
    };

    const { data } = useQueryLesson();
    const lessons = data?.lesson || [];

    if (!isOpen) return null;

    // ----------- Render Options UI theo gameType -------------
    const renderOptions = () => {
        if (gameType === "multiple" || gameType === "listen") {
            return (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options (select the correct one)
                    </label>
                    {options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-3 mb-3">
                            <input
                                type="radio"
                                name="correctAnswer"
                                checked={option.isCorrect}
                                onChange={() => handleCorrectAnswerChange(index)}
                            />
                            <span className="font-medium text-gray-600 w-8">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                className="flex-1 p-2 border border-gray-300 rounded-md "
                            />
                        </div>
                    ))}
                </div>
            );
        }

        if (gameType === "arrange") {
            return (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arrange Text (system will split into words automatically)
                    </label>
                    <input
                        type="text"
                        value={options[0]?.text || ""}
                        onChange={(e) =>
                            setOptions([{ id: "1", text: e.target.value, isCorrect: true }])
                        }
                        placeholder="Enter text e.g. 'Nguyễn Quang Anh'"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Example: If you type <b>Nguyễn Quang Anh</b>, system will split
                        into [Nguyễn, Quang, Anh].
                    </p>
                </div>
            );
        }

        return null;
    };
    // ---------------------------------------------------------

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {initialData ? "Edit Question" : "Create New Question"} ({gameType})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Lessons */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Lessons
                    </label>
                    <select className="border border-gray-200 rounded w-full px-4 py-1 focus:outline-none focus:ring-0 mt-2">
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Audio field nếu là listen */}
                {gameType === "listen" && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Audio URL
                        </label>
                        <input
                            type="text"
                            value={audioUrl}
                            onChange={(e) => setAudioUrl(e.target.value)}
                            placeholder="Enter audio URL..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {audioUrl && (
                            <audio controls className="mt-2 w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                )}

                {/* Question */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question
                    </label>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter the question..."
                        className="w-full p-3 border border-gray-300 rounded-md "
                        rows={3}
                    />
                </div>

                {/* Options (theo gameType) */}
                {renderOptions()}

                {/* Explanation */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation
                    </label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Enter explanation for the correct answer..."
                        className="w-full p-3 border border-gray-300 rounded-md "
                        rows={3}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {initialData ? "Save Changes" : "Create Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}
