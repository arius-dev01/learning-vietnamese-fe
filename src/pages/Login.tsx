import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../component/common/LanguageSwitcher";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

export default function Login() {
    const [value, setValue] = useState("");
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8082/api/login", {
                email, password
            }, { withCredentials: true });
            login(res.data.access_token);
            const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
            console.log(payload);
            const role = payload.role;
            if (role === "ADMIN") {
                navigate('/admin')
            } else {
                navigate('/home')
            }

        } catch (err: any) {
            toast.error(err.response.data.message);
        }
    }
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        }
    })

    return (
        <div className="bg-[#141f25] min-h-screen">
            <div className="flex justify-between items-center max-w-[1200px] mx-auto p-4">
                <button className="text-gray-500 " onClick={() => navigate("/")}><FontAwesomeIcon icon={faX} /></button>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button onClick={() => navigate('/signup')} className="border-2 border-gray-500 px-4 py-2 text-white rounded-xl ">
                        {t('SIGN UP')} {/* ✅ Translation */}
                    </button>
                </div>
            </div>
            <div className=" flex items-center justify-center">
                <div className=' max-w-[400px] w-full p-4 rounded-md'>
                    <h2 className="text-center text-white text-[25px] font-bold mb-4">{t('Log in')}</h2> {/* ✅ Translation */}
                    <form action="" onSubmit={handleLogin} className="flex flex-col space-y-4 mt-5">
                        <div className="relative">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='border-2 border-gray-500 rounded-xl focus:ring-0 focus:outline-none px-3 py-2 bg-[#202f36] placeholder:font-semibold placeholder:text-[16px] placeholder:text-[#c8e2e3] caret-white focus:border-white text-white  w-full'
                                placeholder={t('Email')}
                            />
                            {value && (
                                <button onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-4 h-4  bg-gray-600 flex items-center justify-center font-semibold">
                                    <FontAwesomeIcon icon={faX} className="text-[10px] " />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('Password')}
                                className='border-2 border-gray-500 rounded-xl focus:ring-0 focus:outline-none px-3 py-2 bg-[#202f36] placeholder:font-semibold placeholder:text-[16px] placeholder:text-[#c8e2e3] caret-white focus:border-white text-white w-full'
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-2 right-3">
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (<FontAwesomeIcon icon={faEyeSlash} />)}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-cyan-500 hover:underline  text-sm"
                            >
                                {t('Forgot password?')} {/* ✅ Translation */}
                            </button>
                        </div>
                        <button type="submit" className="bg-[#49C0F8] font-semibold py-4 rounded-xl">
                            {t('LOG IN')} {/* ✅ Translation */}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}
