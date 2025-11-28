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
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅ Add translation
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LanguageSwitcher from '../component/common/LanguageSwitcher'; // ✅ Add language switcher
import { UserDTO } from '../types/User';

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
    roleName: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof UserDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  };

  const handleSignup = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8082/api/register", formData);
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data);

      if (error.response?.data && typeof error.response.data === "object" && !error.response.data.message) {
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


  const inputWrap = 'relative';
  const inputBase =
    'w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-10 py-3 transition';
  const labelBase = 'text-sm text-[#c8e2e3]/80 mb-1 block';

  return (
    <div className="bg-[#141f25] min-h-screen">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto p-4">
        <button
          type="button" // ✅ Add type button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white transition"
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
            {t('LOG IN')} {/* ✅ Add translation */}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 pb-10">
        <div className="max-w-[480px] w-full">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-center text-white font-semibold text-xl">
              {t('Create your profile')} {/* ✅ Add translation */}
            </h2>

            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className={labelBase}>{t('Name')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    type="text"
                    placeholder={t('Your name')}
                    className={inputBase}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>{t('Email')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className={inputBase}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>{t('Password')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    className={inputBase}
                    required
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

              <div>
                <label className={labelBase}>{t('Phone')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    type="text"
                    placeholder={t('Your phone number')}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>{t('Birthday')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                  <input
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                    type="date"
                    className={inputBase}
                  />
                </div>
              </div>
              <div>
                <label className={labelBase}>{t('Location')}</label> {/* ✅ Add translation */}
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  <input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    type="text"
                    placeholder={t('Your addressr')}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>{t('Language')}</label>
                <div className={inputWrap}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <FontAwesomeIcon icon={faLanguage} />
                  </span>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    className={`${inputBase} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="">{t('Select language')}</option>
                    <option value="EN">English</option>
                    <option value="JP">Japanese</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className={labelBase}>{t('Sex')}</label> {/* ✅ Add translation (using Sex instead of Gender) */}
                <div className={inputWrap}>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className={`${inputBase} appearance-none pr-10`}
                  >
                    <option value="">{t('Select gender')}</option> {/* ✅ Add translation */}
                    <option value="MALE">{t('MALE')}</option> {/* ✅ Add translation */}
                    <option value="FEMALE">{t('FEMALE')}</option> {/* ✅ Fix typo: FEMALW -> FEMALE */}
                    <option value="OTHER">{t('Other')}</option> {/* ✅ Add translation */}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c8e2e3]">▼</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-10 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl py-3 transition shadow-lg"
              >
                {t('Create Account')} {/* ✅ Add translation */}
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