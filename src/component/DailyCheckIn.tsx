import { faCalendarCheck, faCheckCircle, faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import api from '../service/axiosClient';

export default function DailyCheckIn() {
    const [showModal, setShowModal] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(3);
    const [hasCheckedToday, setHasCheckedToday] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await api.get("/daily-streak/total");
                console.log("Streak data:", res);
                setCurrentStreak(res.data.totalCheckInDays || 0);

                if (!res.data.checkIn) {
                    setTimeout(() => setShowModal(true), 1500);
                } else {
                    setHasCheckedToday(true);
                }
            } catch (error) {
                console.error("Error fetching streak:", error);
            }
        };

        fetchStreak();
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);


    const handleCheckIn = async () => {
        if (hasCheckedToday || isChecking) return;

        setIsChecking(true);
        try {
            await api.post('/daily-streak/check-in');
            setHasCheckedToday(true);
            setCurrentStreak(prev => prev + 1);
            localStorage.setItem('lastCheckIn', new Date().toDateString());

            setTimeout(() => setShowModal(false), 2000);
        } catch (err) {
            console.error('Check-in failed:', err);
        } finally {
            setIsChecking(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#141f25] text-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold ">Daily Check-in</h2>

                </div>

                <div className="text-center mb-6">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 
      ${currentStreak > 0 ? 'bg-orange-100' : 'bg-gray-200'}`}
                    >
                        <FontAwesomeIcon
                            icon={faFire}
                            className={`text-2xl ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`}
                        />
                    </div>

                    {currentStreak > 0 ? (
                        <>
                            <p className="text-lg font-semibold">{currentStreak} Day Streak 🔥</p>
                            <p className="text-gray-400 text-sm">Keep it up!</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-semibold text-gray-400">Start your first check-in!</p>
                            <p className="text-gray-500 text-sm">Build your daily streak now.</p>
                        </>
                    )}
                </div>


                {/* Check-in Status */}
                {hasCheckedToday ? (
                    <div className="text-center py-6">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-3" />
                        <p className="text-green-600 font-bold text-lg">Already checked in today!</p>
                        <p className="text-gray-600 text-sm">Come back tomorrow</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={handleCheckIn}
                            disabled={isChecking}
                            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${isChecking
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {isChecking ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Checking in...</span>
                                </div>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                                    Check In Now
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => { setShowModal(false); localStorage.setItem('skippedToday', new Date().toDateString()) }}
                            className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Skip for now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}