import {
  faBookOpen,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryLessonUser } from "../hooks/useQueryLessonUser";

const PAGE_SIZE = 6;

export default function LessonCard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { i18n } = useTranslation();
  console.log(i18n.language);
  const { data } = useQueryLessonUser(
    currentPage,
    searchTerm,
    level,
    PAGE_SIZE,
    i18n.language
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lessons = data?.lesson || [];
  console.log(data);
  const totalPages = data?.totalPage || 0;

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    setCurrentPage(0);
  };

  const badgeClass = (level: string) =>
    ((
      {
        beginner:
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
        intermediate:
          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
        advanced: "bg-rose-500/20 text-rose-400 border border-rose-500/40",
      } as Record<string, string>
    )[level] || "bg-gray-500/20 text-gray-400 border border-gray-500/40");

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-2 text-white min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[26px] font-semibold">{t("Lessons")}</h1>{" "}
            {/* ✅ Sửa từ t('Lessons') thành {t('Lessons')} */}
            <p className="text-gray-400 text-sm">
              {t("Choose a lesson to start learning")}
            </p>{" "}
            {/* ✅ Thêm translation */}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              placeholder={t("Search lessons")}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#2a3b45] text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
          <div className="relative w-40">
            <select
              onChange={(e) => handleLevelChange(e.target.value)}
              className="w-full  cursor-pointer appearance-none bg-[#2a3b45] text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-0"
            >
              <option value="">{t("All Levels")}</option>{" "}
              {/* ✅ Thêm translation */}
              <option value="beginner">{t("Beginner")}</option>{" "}
              {/* ✅ Thêm translation */}
              <option value="intermediate">{t("Intermediate")}</option>{" "}
              {/* ✅ Thêm translation */}
              <option value="advanced">{t("Advanced")}</option>{" "}
              {/* ✅ Thêm translation */}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lessons.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {t("No lessons found")}
              </h3>
              <p className="text-gray-400 mb-6">
                {t(
                  "Try adjusting your search or filter to find what you're looking for"
                )}
              </p>
              {(searchTerm || level) && (
                <button
                  onClick={() => {
                    handleSearchChange("");
                    handleLevelChange("");
                  }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium cursor-pointer transition-colors"
                >
                  {t("Clear all filters")}
                </button>
              )}
            </div>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-col border border-white/10 rounded-xl p-5 bg-[#1c2a32] hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 h-full"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[15px] leading-snug">
                    {lesson.title}
                  </h3>
                  <div className="w-12 h-12">
                    <svg style={{ height: 0 }}>
                      <defs>
                        <linearGradient
                          id="gradient"
                          gradientTransform="rotate(90)"
                        >
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Progress
                      type="circle"
                      percent={lesson.progress}
                      size={35}
                      strokeColor="#1677ff"
                      format={(percent) => (
                        <span style={{ color: "white" }}>{percent}%</span>
                      )}
                    />
                  </div>
                </div>

                <p className="text-[13px] text-gray-300 mt-2 leading-snug line-clamp-3">
                  {lesson.describe}
                </p>

                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-[11px] px-2 py-[3px] rounded-md font-medium capitalize ${badgeClass(
                      lesson.level.toLowerCase()
                    )}`}
                  >
                    {t(
                      lesson.level.charAt(0).toUpperCase() +
                        lesson.level.slice(1)
                    )}
                  </span>
                  {/* <span className="text-[12px] text-gray-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} /> {lesson.time}
                </span> */}
                </div>

                <div className="mt-auto pt-5">
                  <button
                    onClick={() =>
                      navigate(
                        `/lessons/${lesson.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    className="w-full cursor-pointer text-[13px] font-medium rounded-md flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white shadow-md min-h-[44px]"
                  >
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="text-[12px]"
                    />
                    <span>{t("Start Learning")}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}
      {totalPages && lessons.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-lg bg-[#2a3b45] cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a4b55] transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`min-w-[36px] cursor-pointer  h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                    : "bg-[#2a3b45] text-gray-300 hover:bg-[#3a4b55]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-lg cursor-pointer bg-[#2a3b45] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a4b55] transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
}
