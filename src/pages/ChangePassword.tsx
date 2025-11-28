// src/pages/ChangePassword.jsx
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPwd, setShowPwd] = useState(false);

    // Lấy token từ query string
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        try {
            await axios.post("http://192.168.1.109:8082/api/reset-password", { token: token, newPassword: password })
            navigate("/login")
        } catch (error: any) {
            setMessage("Server error: " + error.message);
        }
    };

    return (
        <div className="bg-[#141f25] min-h-screen flex justify-center items-center px-4">
            <div className=" w-full max-w-md p-8 mx-auto ">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                    {token ? (
                        <div>
                            <h2 className="text-center text-white font-semibold">Change Password</h2>
                            <form onSubmit={handleSubmit} action="" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-white " htmlFor="">Password</label>
                                    <div className="relative w-full">
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full bg-[#202f36] text-white placeholder:text-gray-400 
                                    rounded-xl px-4 py-3 border border-white/10 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                                    transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3] hover:text-white"
                                            aria-label={showPwd ? 'Hide password' : 'Show password'}
                                        >
                                            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white " htmlFor="">Confirm Password</label>
                                    <div className="relative w-full">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Enter your confirm password"
                                            className="w-full bg-[#202f36] text-white placeholder:text-gray-400 
                                    rounded-xl px-4 py-3 border border-white/10 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                                    transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3] hover:text-white"
                                            aria-label={showPwd ? 'Hide password' : 'Show password'}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl py-3 transition shadow-lg"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <p>No</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
