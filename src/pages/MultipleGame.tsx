import {
  faArrowLeft,
  faSpinner,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import api from "../service/axiosClient";
import { startGame, submit } from "../service/gameService";
import type { AnswerDTO, Question } from "../types/Question";
import Swal from "sweetalert2";

const MultipleGame: React.FC = () => {
  const { nameGame, lessonId } = useParams();
  const { width, height } = useWindowSize();
  const [playerGameId, setPlayerGameId] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [typeGame, setTypeGame] = useState<string>("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [gameId, setGameId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [correctOption, setCorrectOption] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const speakText = async (text: string) => {
    try {
      const response = await api.get(`/tts?text=${encodeURIComponent(text)}`, {
        responseType: "blob", // quan trọng
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();

      // Giải phóng URL khi không dùng nữa
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExitGame = () => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("Are you sure you want to exit the game?"),

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, exit game"),
      cancelButtonText: t("Cancel"),
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };
  const handleSubmitAnswer = async (answerDTO: AnswerDTO) => {
    if (isSubmitting || hasSubmitted) return;
    setIsSubmitting(true);
    setHasSubmitted(true);
    setSelectedId(answerDTO.optionId);

    try {
      const res = await submit(answerDTO);
      setCorrectOption(res.data.correct);
      setCorrectOptionId(res.data.correctOptionId);

      if (res.data.correct) {
        setScore(res.data.newTotalScore);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setScore(res.data.newTotalScore);
      }

      if (res.data.complete) {
        setTotalScore(res.data.totalScore);
        if (res.data.bonus > 0) {
          setBonusScore((i) => i + 20);
        }
        // Đợi 2s trước khi hiển thị màn hình tổng kết
        setTimeout(() => {
          setIsCompleted(true);
        }, 2000);
      }
      console.log("Submit response:", res.data);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await startGame(nameGame, Number(lessonId));
        setQuestions(res.data.questions);
        const lastQuestionId = res.data.lastQuestionId;

        let nextIndex = 0;
        if (lastQuestionId) {
          const lastIndex = res.data.questions.findIndex(
            (q: Question) => q.questionId === lastQuestionId
          );
          nextIndex =
            lastIndex + 1 >= res.data.questions.length ? 0 : lastIndex + 1;
        }
        console.log(res.data);
        setPlayerGameId(res.data.playerId);
        setGameId(res.data.gameId);
        setTypeGame(res.data.type);
        setCurrentQuestionIndex(nextIndex);
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };
    fetchData();
  }, [nameGame, lessonId]);

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="bg-[#141f25] min-h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedId(null);
      setHasSubmitted(false);
      setCorrectOptionId(null);
      setCorrectOption(false);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="bg-[#141f25] min-h-screen flex flex-col justify-center items-center text-white p-4">
      <div className="max-w-2xl w-full">
        {isCompleted && <ReactConfetti width={width} height={height} />}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleExitGame()}
            className="flex cursor-pointer items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{t("Back")}</span>
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold">{t("Multiple Choice")}</h1>
            <p className="text-sm text-gray-400">
              {t("Question")} {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-blue-400">
              {t("Score")}: {score}
            </p>
            <p className="text-sm text-gray-400">
              {correctAnswers} {t("correct")}
            </p>
          </div>
        </div>

        {isCompleted ? (
          <div className="space-y-4 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                🎉{t("Game Complete!")}
              </h2>
              <p className="text-gray-300">
                {t("Well done! Here are your results:")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1e2a30] border border-blue-500/30 p-6 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">
                  {t("Base Score")}
                </h3>
                <p className="text-3xl font-bold text-white">{score}</p>
                {bonusScore > 0 && (
                  <div className="mt-4 border-t border-blue-500/30 pt-4">
                    <div className="flex justify-between text-yellow-300">
                      <span>{t("Perfect Bonus")}</span>
                      <span>+{bonusScore}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-green-400 font-semibold">
                      <span>{t("Total")}</span>
                      <span>{totalScore + bonusScore}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#1e2a30] border border-green-500/30 p-6 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-green-300 mb-3">
                  {t("Accuracy")}
                </h3>
                <p className="text-3xl font-bold text-white">
                  {Math.round((correctAnswers / questions.length) * 100)}%
                </p>
                <p className="text-sm text-gray-400">
                  {correctAnswers}/{questions.length} {t("correct")}
                </p>
              </div>
            </div>

            <div className="bg-[#1e2a30] border border-yellow-500/30 p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                {t("Performance")}
              </h3>
              <p className="text-2xl font-bold text-white">
                <p className="text-2xl font-bold text-white">
                  {correctAnswers / questions.length >= 0.9
                    ? t("Excellent!")
                    : correctAnswers / questions.length >= 0.7
                    ? t("Good!")
                    : correctAnswers / questions.length >= 0.5
                    ? t("Fair!")
                    : t("Keep Trying!")}
                </p>
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 {t("Play Again")}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                📚 {t("Back to Topics")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Question */}
            <div className="bg-[#1e2a30] border border-gray-700 rounded-xl p-6 text-center">
              {!currentQuestion.audio_url ? (
                <h2 className="text-xl font-semibold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              ) : (
                <button
                  onClick={() => speakText(currentQuestion.questionText)}
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faVolumeUp} />
                  <span>{t("Listen")}</span>
                </button>
              )}

              {currentQuestion.image_url && (
                <img
                  src={currentQuestion.image_url}
                  alt="Question"
                  className="max-w-md mx-auto mt-4 rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedId === option.id;
                const isCorrectAnswer = correctOptionId === option.id;
                const isWrongAnswer =
                  hasSubmitted && isSelected && !isCorrectAnswer;
                const showResult = hasSubmitted && !isSubmitting;

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleSubmitAnswer({
                        questionId: currentQuestion.questionId,
                        optionId: option.id,
                        gameId: gameId,
                        lessonId: Number(lessonId),
                        answer: [],
                        playerId: playerGameId,
                      })
                    }
                    disabled={hasSubmitted}
                    className={`flex cursor-pointer items-center space-x-3 rounded-xl p-4 transition-all duration-300 text-left font-medium
                      ${
                        showResult && isCorrectAnswer
                          ? "bg-green-700 border border-green-500 shadow-lg scale-105"
                          : showResult && isWrongAnswer
                          ? "bg-red-700 border border-red-500"
                          : "bg-[#1f2d34] border border-gray-600 hover:border-blue-500 hover:bg-[#253843] hover:scale-105"
                      }`}
                  >
                    <span className="flex items-center justify-center bg-white/20 rounded-full w-10 h-10 text-white font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option.content}</span>
                    {isSubmitting && isSelected && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin text-blue-400"
                      />
                    )}
                    {showResult && isCorrectAnswer && (
                      <span className="text-xl">✅</span>
                    )}
                    {showResult && isWrongAnswer && (
                      <span className="text-xl">❌</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {hasSubmitted && !isSubmitting && (
              <div className="bg-[#1e2a30] border border-gray-600 rounded-xl p-6 text-center">
                {correctOption ? (
                  <div className="text-green-400">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-xl font-semibold">{t("Excellent!")}</p>
                    <p className="text-green-300">{t("That’s correct!")}</p>
                  </div>
                ) : (
                  <div className="text-red-400">
                    <div className="text-3xl mb-2">💔</div>
                    <p className="text-xl font-semibold">
                      {t("Not quite right")}
                    </p>
                    <p className="text-red-300">{t("Keep trying!")}</p>
                  </div>
                )}

                {currentQuestion.explanation && (
                  <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600 mt-4">
                    <p className="text-gray-300 leading-relaxed">
                      <span className="font-semibold text-white">
                        💡 {t("Explanation")}:{" "}
                      </span>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                <button
                  className="mt-6 cursor-pointer bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>➡️ {t("Next Question")}</>
                  ) : (
                    <>🏁 {t("View Results")}</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleGame;
