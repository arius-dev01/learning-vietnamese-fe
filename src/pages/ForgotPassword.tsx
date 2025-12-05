import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        document.title = "Forgot Password"
    })
    const handleSubmit = async () => {
        setLoading(true)
        try {
            await axios.post( `${import.meta.env.VITE_API_URL}/forgot-password`, { email });
            setSuccess(true);
            setMessage("We have sent password reset instructions to your email.");
        } catch (e: any) {
            console.error(e);
            setSuccess(false);
            setMessage("Failed to send email. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-[#141f25] min-h-screen flex items-center justify-center px-4">
            <div className="bg-[#1e2a32] shadow-lg rounded-2xl w-full max-w-md p-8">
                {
                    success ? (
                        <p className="text-center mt-4 text-sm text-cyan-400">{message}</p>

                    ) : (
                        <div>
                            <h1 className="text-white text-3xl font-bold text-center">
                                Forgot Password
                            </h1>
                            <p className="text-gray-300 text-center mt-3 text-sm">
                                Enter your email and we’ll send you instructions to reset your password.
                            </p>

                            <div className="mt-6">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-[#202f36] text-white placeholder:text-gray-400 
                                    rounded-xl px-4 py-3 border border-white/10 
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                                    transition"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !email}
                                className={`mt-5 flex gap-2 items-center justify-center w-full 
                                bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 
                                rounded-xl transition-all shadow-md
                                ${loading || !email ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                                {loading ? "Submitting..." : "Submit"}
                            </button>

                        </div>
                    )
                }
            </div>
        </div>
    );
}
