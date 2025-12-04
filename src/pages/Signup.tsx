import {
  faArrowLeft,
  faCalendar,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLanguage,
  faLock,
  faMapMarkerAlt,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // ✅ Add translation
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LanguageSwitcher from "../component/common/LanguageSwitcher"; // ✅ Add language switcher
import type { UserDTO } from "../types/User";

export default function Signup() {
  const { t } = useTranslation(); // ✅ Add translation hook
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState<UserDTO>({
    id: 0,
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    avatar: "",
    bio: "",
    birthdate: "",
    createdAt: "",
    updatedAt: "",
    location: "",
    language: "",
    gender: "",
    newPassword: "",
    roleName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof UserDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("Name is required");
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t("Name must be at least 2 characters");
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = t("Name must be less than 50 characters");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("Email is required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("Please enter a valid email address");
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = t("Password is required");
    } else if (formData.password.length < 8) {
      newErrors.password = t("Password must be at least 8 characters");
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = t("Password must contain at least one number");
    }

    // Validate phone number (optional but if provided must be valid)
    if (formData.phoneNumber) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
        newErrors.phoneNumber = t(
          "Please enter a valid phone number (10-11 digits)"
        );
      }
    }

    // Validate birthdate (optional but if provided must be valid)
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (birthDate > today) {
        newErrors.birthdate = t("Birthdate cannot be in the future");
      } else if (age < 5) {
        newErrors.birthdate = t("You must be at least 5 years old");
      } else if (age > 120) {
        newErrors.birthdate = t("Please enter a valid birthdate");
      }
    }

    // Validate language
    if (!formData.language) {
      newErrors.language = t("Please select a language");
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = t("Please select a gender");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fix the errors before submitting"));
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, formData);
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data);

      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        !error.response.data.message
      ) {
        const errors = error.response.data;
        Object.values(errors).forEach((msg: any) => toast.error(msg));
        return;
      }

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Signup failed!";

      toast.error(message);
    }
  };

  const inputWrap = "relative";
  const inputBase =
    "w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-10 py-3 transition";
  const inputError =
    "border-red-500/50 focus:border-red-500 focus:ring-red-500/20";
  const labelBase = "text-sm text-[#c8e2e3]/80 mb-1 block";
  const errorText = "text-red-400 text-xs mt-1";

  return (
    <div className="bg-[#141f25] min-h-screen">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto p-4">
        <button
          type="button" // ✅ Add type button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white transition cursor-pointer"
          aria-label="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="flex items-center gap-4">
          <LanguageSwitcher /> {/* ✅ Add language switcher */}
          <Link
            to="/login"
            className="text-white/90 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-xl shadow-lg transition"
          >
            {t("LOG IN")} {/* ✅ Add translation */}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 pb-10">
        <div className="max-w-[480px] w-full">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-center text-white font-semibold text-xl">
              {t("Create your profile")} {/* ✅ Add translation */}
            </h2>

            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className={labelBase}>
                  {t("Name")} <span className="text-red-400">*</span>
                </label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    type="text"
                    placeholder={t("Your name")}
                    className={`${inputBase} ${
                      errors.fullName ? inputError : ""
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className={errorText}>{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>
                  {t("Email")} <span className="text-red-400">*</span>
                </label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className={`${inputBase} ${errors.email ? inputError : ""}`}
                  />
                </div>
                {errors.email && <p className={errorText}>{errors.email}</p>}
              </div>

              <div>
                <label className={labelBase}>
                  {t("Password")} <span className="text-red-400">*</span>
                </label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    type={showPwd ? "text" : "password"}
                    placeholder={t("At least 8 characters")}
                    className={`${inputBase} ${
                      errors.password ? inputError : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10  cursor-pointer"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <p className={errorText}>{errors.password}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>{t("Phone")}</label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    type="text"
                    placeholder={t("Your phone number")}
                    className={`${inputBase} ${
                      errors.phoneNumber ? inputError : ""
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className={errorText}>{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className={labelBase}>{t("Birthday")}</label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                  <input
                    value={formData.birthdate}
                    onChange={(e) =>
                      handleInputChange("birthdate", e.target.value)
                    }
                    type="date"
                    className={`${inputBase} ${
                      errors.birthdate ? inputError : ""
                    }`}
                  />
                </div>
                {errors.birthdate && (
                  <p className={errorText}>{errors.birthdate}</p>
                )}
              </div>
              <div>
                <label className={labelBase}>{t("Location")}</label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  <input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    type="text"
                    placeholder={t("Your address")}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>
                  {t("Language")} <span className="text-red-400">*</span>
                </label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faLanguage} />
                  </span>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      handleInputChange("language", e.target.value)
                    }
                    className={`${inputBase} appearance-none pr-10 cursor-pointer ${
                      errors.language ? inputError : ""
                    }`}
                  >
                    <option value="">{t("Select language")}</option>
                    <option value="EN">English</option>
                    <option value="JP">Japanese</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
                {errors.language && (
                  <p className={errorText}>{errors.language}</p>
                )}
              </div>
              <div>
                <label className={labelBase}>
                  {t("Sex")} <span className="text-red-400">*</span>
                </label>
                <div className={inputWrap}>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className={`${inputBase} appearance-none pr-10 cursor-pointer ${
                      errors.gender ? inputError : ""
                    }`}
                  >
                    <option value="">{t("Select gender")}</option>
                    <option value="MALE">{t("MALE")}</option>
                    <option value="FEMALE">{t("FEMALE")}</option>
                    <option value="OTHER">{t("Other")}</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    ▼
                  </span>
                </div>
                {errors.gender && <p className={errorText}>{errors.gender}</p>}
              </div>

              <button
                type="submit"
                className="w-full mt-10 bg-gradient-to-r cursor-pointer from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl py-3 transition shadow-lg"
              >
                {t("Create Account")} {/* ✅ Add translation */}
              </button>

              {/* Google Signup Button (commented out) */}
              {/* <div className="flex items-center gap-4 my-5">
                <hr className="flex-1 border-gray-600" />
                <span className="text-gray-400 text-sm">{t('OR')}</span>
                <hr className="flex-1 border-gray-600" />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-3 border border-gray-500 w-full bg-[#202f36] text-white font-medium py-3 rounded-xl hover:bg-gray-100 transition hover:text-black"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                {t('Continue with Google')}
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
