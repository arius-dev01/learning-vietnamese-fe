import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { startGame, submit } from "../service/gameService";
import { AnswerDTO, Question } from "../types/Question";

export default function ArrangeSentence() {
    const { nameGame, lessonId } = useParams();
    const { width, height } = useWindowSize();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [words, setWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>([]);
    const [result, setResult] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [playerGameId, setPlayerGameId] = useState<number>(0);
    const [typeGame, setTypeGame] = useState<string>("");
    const [bonusScore, setBonusScore] = useState(0);
    const { t } = useTranslation();
    const [gameId, setGameId] = useState<number>(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await startGame(nameGame, Number(lessonId));
                setQuestions(res.data.questions);
                setPlayerGameId(res.data.playerId);
                setTypeGame(res.data.type);
                setGameId(res.data.gameId);
                // tính index câu tiếp theo
                const lastQuestionId = res.data.lastQuestionId;
                const nextIndex = res.data.questions.findIndex(
                    (q: Question) => q.questionId === lastQuestionId
                ) + 1;
                setCurrentQuestionIndex(nextIndex >= 0 ? nextIndex : 0);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [nameGame, lessonId]);

    useEffect(() => {
        if (questions.length > 0) {
            const shuffledWords = shuffle(questions[currentQuestionIndex].sentence);
            setAvailableWords(shuffledWords);
            setWords([]);
            setResult("");
            setIsCorrect(false);
        }
    }, [questions, currentQuestionIndex]);

    const handleWordClick = (word: string, index: number) => {
        // Chuyển từ từ available words sang answer zone
        const newAvailableWords = availableWords.filter((_, i) => i !== index);
        const newWords = [...words, word];

        setAvailableWords(newAvailableWords);
        setWords(newWords);
    };

    const handleAnswerWordClick = (word: string, index: number) => {
        // Chuyển từ từ answer zone về available words
        const newWords = words.filter((_, i) => i !== index);
        const newAvailableWords = [...availableWords, word];

        setWords(newWords);
        setAvailableWords(newAvailableWords);
    };

    const resetGame = () => {
        if (questions.length > 0) {
            const shuffledWords = shuffle(questions[currentQuestionIndex].sentence);
            setAvailableWords(shuffledWords);
            setWords([]);
            setIsCorrect(false);
            setResult("");
        }
    };
    const [totalScore, setTotalScore] = useState(0);

    const handleSubmitAnswer = async (answerDTO: AnswerDTO) => {
        try {
            const res = await submit(answerDTO);
            setScore(res.data.newTotalScore);
            if (res.data.correct) {
                setCorrectAnswers(prev => prev + 1);
                setIsCorrect(true);
                setResult("✅ Correct!");
            } else {
                setIsCorrect(false);
                setResult("❌ Wrong, moving to next...");
            }

            if (res.data.complete) {
                setIsCompleted(true);
                setTotalScore(res.data.totalScore);
                if (res.data.bounus > 0) {
                    setBonusScore(i => i + 20);
                }
                setResult("🎉 You completed all questions!");
                return;
            }

            // Tự động next sau 2s
            setTimeout(() => {
                setCurrentQuestionIndex(prev => {
                    const nextIndex = prev + 1;
                    if (nextIndex >= questions.length) {
                        setIsCompleted(true);
                        return prev;
                    }
                    return nextIndex;
                });
            }, 2000);

        } catch (err) {
            console.error("Submit answer failed", err);
        }
    };

    const progressPercent =
        questions.length > 0
            ? ((currentQuestionIndex + 1) / questions.length) * 100
            : 0;

    if (!questions.length || currentQuestionIndex >= questions.length) {
        return (
            <div className="bg-gradient-to-br from-[#141f25] to-[#0f1419] min-h-screen flex flex-col justify-center items-center text-white p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p>Loading game...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#141f25] to-[#0f1419] min-h-screen flex flex-col justify-center items-center text-white p-4">
            <div className="max-w-2xl w-full">
                {isCorrect && <ReactConfetti width={width} height={height} />}
                {isCompleted && <ReactConfetti width={width} height={height} />}

                {isCompleted ? (
                    // Màn hình kết quả - giống MultipleGame
                    <div className="space-y-4 mb-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-2">🎉 {t("Game Complete!")}</h2>
                            <p className="text-gray-300">{t("Well done! Here are your results:")}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 p-6 rounded-xl text-center">
                                <h3 className="text-lg font-semibold text-blue-300 mb-3">{t("Base Score")}</h3>
                                <p className="text-3xl font-bold text-white">{totalScore}</p>
                                <p className="text-sm text-gray-400 mt-1">{t("points")}</p>
                            </div>

                            {bonusScore > 0 && (
                                <div className="mt-4 border-t border-blue-500/30 pt-4">
                                    <div className="flex justify-between text-yellow-300">
                                        <span>{t("Perfect Bonus")}</span>
                                        <span>+{bonusScore}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 text-green-400 font-semibold">
                                        <span>{t("Total")}</span>
                                        <span>{totalScore}</span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 p-6 rounded-xl text-center">
                                <h3 className="text-lg font-semibold text-green-300 mb-3">{t("Accuracy")}</h3>
                                <p className="text-3xl font-bold text-white">
                                    {Math.round((correctAnswers / questions.length) * 100)}%
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {correctAnswers}/{questions.length} {t("correct")}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 p-6 rounded-xl text-center">
                            <h3 className="text-lg font-semibold text-yellow-300 mb-3">{t("Performance Grade")}</h3>
                            <p className="text-2xl font-bold text-white">
                                {correctAnswers / questions.length >= 0.9
                                    ? <>🏆 {t("Excellent!")}</>
                                    : correctAnswers / questions.length >= 0.7
                                        ? <>⭐ {t("Good!")}</>
                                        : correctAnswers / questions.length >= 0.5
                                            ? <>👍 {t("Fair!")}</>
                                            : <>💪 {t("Keep trying!")}</>}
                            </p>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                            >
                                🔄 {t("Play Again")}
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                            >
                                📚 {t("Back to Topics")}
                            </button>
                        </div>
                    </div>

                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                            >
                                <span>←</span>
                                <span>{t('Back')}</span>
                            </button>

                            <div className="text-center">
                                <h1 className="text-xl font-bold">{t('Arrange Sentence')}</h1>
                                <p className="text-sm text-gray-400">{t('Question')} {currentQuestionIndex + 1} {t('of')} {questions.length}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-semibold text-blue-300">{t('Score')}: {score}</p>
                            </div>
                        </div>

                        <div className="bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>

                        <div className="border border-gray-600 rounded-xl p-4 space-y-4">
                            {/* <h2 className="text-xl text-center font-semibold text-white mb-4">
                                Arrange the words to ask about the weather:
                            </h2> */}

                            <div className="space-y-4">
                                <p className="text-sm text-blue-400 text-center">
                                    {t('Click words below to build your sentence.')}
                                </p>

                                {/* Answer Zone */}
                                <div className="min-h-[80px] border-2 border-dashed border-gray-600 bg-gray-800/30 rounded-xl p-4">
                                    <div className="flex flex-wrap gap-2 justify-center items-center min-h-[50px]">
                                        {words.length === 0 ? (
                                            <span className="text-gray-400 text-lg font-medium">{t('Click words to build your sentence...')}</span>
                                        ) : (
                                            words.map((word, index) => (
                                                <button
                                                    key={`answer-${index}`}
                                                    onClick={() => handleAnswerWordClick(word, index)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium cursor-pointer select-none transition-all duration-200 shadow-lg transform hover:scale-105"
                                                >
                                                    {word}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Available Words */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-3 text-center">
                                        {t('Available Words:')}
                                    </h3>
                                    <div className="flex flex-wrap gap-3 justify-center p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                                        {availableWords.length === 0 ? (
                                            <span className="text-gray-400 text-lg font-medium py-4">All words used!</span>
                                        ) : (
                                            availableWords.map((word, index) => (
                                                <button
                                                    key={`available-${index}`}
                                                    onClick={() => handleWordClick(word, index)}
                                                    className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-medium cursor-pointer select-none transition-all duration-200 shadow-lg transform hover:scale-105 border border-gray-600 hover:border-yellow-500"
                                                >
                                                    {word}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105"
                                    onClick={resetGame}
                                >
                                    🔀 {t('Shuffle Again')}
                                </button>
                                <button
                                    onClick={() => handleSubmitAnswer({
                                        gameId: Number(gameId),
                                        questionId: questions[currentQuestionIndex].questionId,
                                        lessonId: Number(lessonId),
                                        playerId: playerGameId,
                                        answer: words,
                                        optionId: 0
                                    })}
                                    disabled={words.length === 0}
                                    className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105 ${words.length === 0
                                        ? 'bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                        }`}
                                >
                                    {t('Submit Answer')}
                                </button>
                            </div>
                        </div>

                        {result && (
                            <div className={`p-4 rounded-xl text-center font-semibold transition-all duration-300 border backdrop-blur ${isCorrect
                                ? 'bg-gradient-to-r from-green-600/20 to-green-800/20 text-green-300 border-green-500/30 shadow-lg'
                                : 'bg-gradient-to-r from-red-600/20 to-red-800/20 text-red-300 border-red-500/30 shadow-lg'
                                }`}>
                                {result}
                                {isCorrect && (questions[currentQuestionIndex] as any)?.explanation && (
                                    <div className="mt-4 pt-4 border-t border-green-500/30 text-left flex gap-2">
                                        <p className="text-sm text-green-200 mb-2 font-medium">Explanation:</p>
                                        <div className="bg-green-900/20 rounded-lg ">
                                            <p className="text-white text-sm">
                                                {(questions[currentQuestionIndex] as any).explanation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* ✅ Hiển thị đáp án đúng nếu sai */}
                                {!isCorrect && questions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-red-500/30">
                                        <p className="text-sm text-red-200 mb-2">Correct answer:</p>
                                        <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/40">
                                            <p className="text-white font-medium text-lg">
                                                {questions[currentQuestionIndex]?.sentence?.join(' ')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}