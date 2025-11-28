import { faArrowLeft, faBirthdayCake, faBook, faCalendar, faFire, faGamepad, faLocationPin, faPen, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../service/axiosClient";
import { getUserAchievement } from "../service/userAchievement";
import { getInforUser } from "../service/userService";
import { UserDTO } from "../types/User";
import { UserAchievementDTO } from "../types/userAchiemenet";

export default function Profile() {
    const { t } = useTranslation();
    const [totalStreak, setTotalStreak] = useState(0);
    const [user, setUser] = useState<UserDTO | null>(null);
    useEffect(() => {
        document.title = "Profile"
    })
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getInforUser();
                setUser(res.data);
                console.log(res.data)
            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchUser()
    }, []);

    const [achievement, setAchievement] = useState<UserAchievementDTO>();
    useEffect(() => {
        const fetchUserAchievement = async () => {
            const res = await getUserAchievement();
            setAchievement(res);
        }
        fetchUserAchievement();
    }, []);
    useEffect(() => {
        const fetchUserAchievement = async () => {
            const res = await api.get("/daily-streak/total");
            setTotalStreak(res.data.totalCheckInDays || 0);
        }
        fetchUserAchievement();
    }, []);

    const navigate = useNavigate();
    const parts = user && user.fullName.trim().split(/\s+/);
    const first = parts && parts[parts.length - 2]?.charAt(0).toUpperCase() || "";
    const last = parts && parts[parts.length - 1]?.charAt(0).toUpperCase() || "";

    return (
        <div className="bg-[#141f25] min-h-screen text-white py-10">
            <div className="max-w-[1200px] mx-auto space-y-6 px-4">
                <button onClick={() => navigate("/home")}><FontAwesomeIcon icon={faArrowLeft} /></button>

                <div className="flex justify-between items-center gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">{t('Profile')}</h1>
                        <p className=" text-[10px] sm:text-sm text-gray-400">
                            {t('Manage your personal information and preferences')}
                        </p>
                    </div>
                    <button onClick={() => navigate("/edit-profile")} className="flex items-center gap-[2px] sm:gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-[10px] sm:text-sm transition">
                        <FontAwesomeIcon icon={faPen} />
                        {t('Edit Profile')}
                    </button>
                </div>

                <div className="w-full border border-gray-700 rounded-xl p-6 shadow-lg bg-white/5">
                    {user && (
                        <div className="max-w-[600px] w-full flex gap-2 sm:gap-6 items-center">
                            {
                                user.avatar && user.avatar !== "Unknow" ? (
                                    <img
                                        src={user.avatar}
                                        alt="avatar"
                                        className="w-10 h-10 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-500 shadow-md object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 p-4 sm:w-28 sm:h-28 bg-white text-black rounded-full flex items-center text-[10px] sm:text-2xl justify-center">
                                        {first + last}
                                    </div>
                                )
                            }
                            <div>
                                <h1 className="text-2xl font-semibold">{user.fullName}</h1>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                                <div className="flex gap-4 text-sm text-gray-400 mt-2">
                                    <span>{t('Member since')} {user?.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short', // "Aug"
                                            day: 'numeric'
                                        })
                                        : 'N/A'}</span>
                                </div>
                                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                                    {user.bio}
                                </p>
                                <div className="flex gap-4 text-sm mt-3">
                                    <p className="flex gap-2 items-center text-gray-400">
                                        <FontAwesomeIcon icon={faBirthdayCake} />
                                        {user.birthdate
                                            ? new Date().getFullYear() - parseInt(user.birthdate.split("-")[0], 10)
                                            : "N/A"}
                                    </p>

                                    <p className="flex gap-2 items-center text-gray-400">
                                        <FontAwesomeIcon icon={faLocationPin} />
                                        {user.location}
                                    </p>
                                    <p className="flex gap-2 items-center text-gray-400">
                                        <FontAwesomeIcon icon={faPhone} />
                                        {user.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Score */}
                    <div className="border border-gray-700 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                                <FontAwesomeIcon icon={faStar} />
                            </span>
                            <p className="text-sm text-gray-300">{t('Total Score')}</p>
                        </div>
                        <p className="font-bold text-xl pl-12 mt-1">{achievement?.totalScore}</p>
                    </div>

                    <div className="border border-gray-700 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                                <FontAwesomeIcon icon={faBook} />
                            </span>
                            <p className="text-sm text-gray-300">{t('Lessons Completed')}</p>
                        </div>
                        <p className="font-bold text-xl pl-12 mt-1">{achievement?.totalLesson}</p>
                    </div>

                    {/* Games Played */}
                    <div className="border border-gray-700 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-white">
                                <FontAwesomeIcon icon={faGamepad} />
                            </span>
                            <p className="text-sm text-gray-300">{t('Games Played')}</p>
                        </div>
                        <p className="font-bold text-xl pl-12 mt-1">{achievement?.totalGame}</p>
                    </div>

                    {/* Learning Streak */}
                    <div className="border border-gray-700 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white">
                                <FontAwesomeIcon icon={faFire} />
                            </span>
                            <p className="text-sm text-gray-300">{t('Learning Streak')}</p>
                        </div>
                        <p className="font-bold text-xl pl-12 mt-1">{totalStreak} {t('days')}</p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="border border-gray-700 rounded-xl p-5 bg-white/5">
                        <p className="flex gap-2 items-center mb-2 text-lg font-medium">
                            <FontAwesomeIcon icon={faUser} />
                            {t('Basic Information')}
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                            {t('Your personal details and contact information')}
                        </p>
                        <div className="divide-y divide-gray-700 text-sm">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Full name')}</span>
                                <span className="font-medium">{user?.fullName}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Email')}</span>
                                <span className="font-medium">{user?.email}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Phone')}</span>
                                <span className="font-medium">{user?.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Location')}</span>
                                <span className="font-medium">{user?.location}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-400">{t('Bio')}</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{user?.bio}</p>
                        </div>
                    </section>

                    <section className="border border-gray-700 rounded-xl p-5 bg-white/5">
                        <p className="flex gap-2 items-center mb-2 text-lg font-medium">
                            <FontAwesomeIcon icon={faCalendar} />
                            {t('Personal Details')}
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                            {t('Additional personal information')}
                        </p>
                        <div className="divide-y divide-gray-700 text-sm">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Sex')}</span>
                                <span className="font-medium">{t(user?.gender || '')}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Birthday')}</span>
                                <span className="font-medium">{user?.birthdate}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Native language')}</span>
                                <span className="font-medium">{user?.language}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">{t('Member since')}</span>
                                <span className="font-medium">        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}