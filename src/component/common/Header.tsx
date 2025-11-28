import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // ✅ Thêm import này
import { logout } from "../../service/userService";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../../context/useAuth";

export default function Header() {
    const { t } = useTranslation(); // ✅ Thêm hook này
    const {logout} = useAuth();
    const handleLogout = async () => {
        await logout();
        logout();
        window.location.href = "/login";
    }

    const [showMenu, setShowMenu] = useState(false);
    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMenu])
    
    return (
        <header className='bg-[#14222a] text-white'>
            <nav className='container mx-auto max-w-[1200px] w-full px-2 py-4 shadow-2xl flex justify-between relative '>
                <a href="/home" className='text-2xl font-bold'>
                    {t('Learn Vietnamese')} {/* ✅ Dùng translation */}
                </a>

                <div className="hidden md:flex items-center space-x-6">
                    <a href="/home" className="hover:text-blue-200 transition">
                        {t('Home')} {/* ✅ Dùng translation */}
                    </a>
                    <a href="/profile" className="hover:text-blue-200 transition">
                        {t('Profile')} {/* ✅ Dùng translation */}
                    </a>
                    <button onClick={() => handleLogout()}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                        {t('LOG OUT')} {/* ✅ Dùng translation */}
                    </button>
                    <LanguageSwitcher />

                </div>

                <button className="md:hidden block ">
                    <FontAwesomeIcon onClick={() => setShowMenu(!showMenu)} icon={faBars} />
                </button>

                {showMenu && (
                    <div className=" fixed top-0 right-0 h-full flex flex-col gap-2 bg-[#14222a] p-4 w-[300px] rounded shadow-lg z-50">
                        <button className="text-white self-end" onClick={() => setShowMenu(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        <div className="flex flex-col justify-center items-center flex-1 gap-6 text-lg">
                            <a href="/" className="hover:text-blue-200 transition">
                                {t('Home')} {/* ✅ Dùng translation */}
                            </a>
                            <a href="/profile" className="hover:text-blue-200 transition">
                                {t('Profile')} {/* ✅ Dùng translation */}
                            </a>
                            <a href="/games" className="hover:text-blue-200 transition">
                                Games {/* Có thể thêm vào translation file */}
                            </a>

                            {/* ✅ Thêm Language Switcher cho mobile */}
                            <div className="mt-4">
                                <LanguageSwitcher />
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-auto w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            {t('LOG OUT')} {/* ✅ Dùng translation */}
                        </button>
                    </div>
                )}
            </nav>
        </header>
    )
}