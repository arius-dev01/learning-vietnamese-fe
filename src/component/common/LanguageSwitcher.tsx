import { useTranslation } from "react-i18next";
import { translationLanguage } from "../../service/userService";
import { use } from "react";
import { useAuth } from "../../context/useAuth";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本", flag: "🇯🇵" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const changeLanguage = async (langCode: string, languageName: string) => {
    if (user) {
      await translationLanguage(languageName === "日本" ? "Japan" : "English");
    }
    
    await i18n.changeLanguage(langCode);

    localStorage.setItem("i18nextLng", langCode);

    console.log("Changed language:", langCode, "-", languageName);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      {/* Main Button */}
      <button className="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 border border-gray-600">
        {/* <FontAwesomeIcon icon={faGlobe} className="text-cyan-400" /> */}
        <span className="text-white text-sm font-medium">
          {currentLanguage.name}
        </span>
        <svg
          className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180"
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
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 mt-2 w-44 bg-gray-800 border border-gray-600 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code, language.name)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
              i18n.language === language.code
                ? "bg-cyan-600/20 text-cyan-300 border-l-4 border-cyan-400"
                : "text-white hover:text-cyan-300"
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium text-sm flex-1">{language.name}</span>
            {i18n.language === language.code && (
              <span className="text-cyan-400 text-sm">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
