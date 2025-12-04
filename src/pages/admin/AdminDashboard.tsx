import { faBook, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryLesson } from "../../hooks/useLesson";
import { getRecentActivities } from "../../service/gameService";
import { getLessonTop10Completed } from "../../service/lessonService";
import type { LessonDTO } from "../../types/Lession";
import type { RecentActivityDTO } from "../../types/RecentActivity";

export default function AdminDashboard() {
  const { t } = useTranslation();

  const [activies, setActivities] = useState<RecentActivityDTO[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getRecentActivities();
      setActivities(res.data);
    };
    fetchData();
  }, []);

  const [formLesson, setFormLesson] = useState<LessonDTO[]>([]);
  useEffect(() => {
    const fetData = async () => {
      const res = await getLessonTop10Completed();
      setFormLesson(res.data);
    };
    fetData();
  }, []);
  const start = (totalCompleted?: number) => {
    const totalUsers = formLesson?.[0]?.totalUser ?? 1;
    const completed = totalCompleted ?? 0;
    const result = (completed / (totalUsers || 1)) * 5;
    return result.toFixed(1);
  };

  const { data } = useQueryLesson();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">
          {t(
            "Welcome back! Here's what's happening with your Vietnamese learning platform."
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("Total Users")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {" "}
                {formLesson.length > 0
                  ? formLesson[0].totalUser?.toLocaleString()
                  : "---"}
              </p>
              <div className="flex items-center mt-2">
                {/* <FontAwesomeIcon icon={faArrowUp} className="text-green-500 text-sm mr-1" /> */}
                {/* <span className="text-sm text-green-600">+12% {t('from last month')}</span> */}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-blue-600 text-xl"
              />
            </div>
          </div>
        </div>

        {/* Total Lessons */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("Total Lessons")}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {data?.lesson.length}
              </p>
              {/* <div className="flex items-center mt-2">
                                <FontAwesomeIcon icon={faArrowUp} className="text-green-500 text-sm mr-1" />
                                <span className="text-sm text-green-600">+3 {t('this week')}</span>
                            </div> */}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBook}
                className="text-green-600 text-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("Recent Activities")}
            </h2>
          </div>

          <div className="space-y-4">
            {activies.map((activity) => (
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {activity.avatar ? (
                    <img
                      className="w-full h-full rounded-full object-cover"
                      src={activity.avatar}
                      alt={activity.fullName || "User avatar"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                    <span class="text-blue-600 font-semibold text-sm">
                        ${
                          activity.fullName
                            ? activity.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "?"
                        }
                    </span>
                `;
                      }}
                    />
                  ) : (
                    <span className="text-blue-600 font-semibold text-sm">
                      {activity.fullName
                        ? activity.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.fullName}</span>{" "}
                    {activity.action.toLowerCase()}
                    {activity.title && (
                      <span className="text-blue-600"> "{activity.title}"</span>
                    )}
                    {activity.typeGame && (
                      <span className="text-purple-600">
                        {" "}
                        ({activity.typeGame})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.minutesAgo < 1
                      ? "Just now"
                      : activity.minutesAgo < 60
                      ? `${activity.minutesAgo} minutes ago`
                      : activity.minutesAgo < 1440
                      ? `${Math.floor(activity.minutesAgo / 60)} hours ago`
                      : `${Math.floor(activity.minutesAgo / 1440)} days ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Lessons */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("Top Lessons")}
            </h2>
            {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {t('Manage')}
                        </button> */}
          </div>

          <div className="space-y-4">
            {formLesson.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {lesson.title}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {lesson.countCompleted} completions
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs text-gray-500 ml-1">
                        {start(lesson.countCompleted)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
