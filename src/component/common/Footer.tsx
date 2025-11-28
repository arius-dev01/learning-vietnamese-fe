import { faFacebook, faGithub, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#14222a] text-gray-300 relative shadow-2xl overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto px-6 py-12 ">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div className="md:w-1/2">
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              {t("NQA")}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {t(
                "Your ultimate platform to master the Vietnamese language through interactive lessons, engaging quizzes, and consistent daily practice."
              )}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="uppercase text-xs tracking-wider text-gray-500">
              {t("Follow us")}
            </p>
            <div className="flex gap-5">
              {[
                { icon: faFacebook, color: "hover:text-blue-500" },
                { icon: faTwitter, color: "hover:text-sky-400" },
                { icon: faYoutube, color: "hover:text-red-500" },
                { icon: faGithub, color: "hover:text-gray-200" },
              ].map(({ icon, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className={`text-gray-400 ${color} transition-colors duration-300 transform hover:scale-110`}
                >
                  <FontAwesomeIcon icon={icon} className="text-2xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-gray-500">
            {t("© 2025")} <span className="text-white font-medium">{t("NQA")}</span>. {t("All rights reserved.")}
          </p>
          <p className="text-gray-400 flex items-center gap-2">
            {t("Made with")}{" "}
            <FontAwesomeIcon icon={faHeart} className="text-red-500 animate-pulse" />{" "}
            {t("by")} <span className="font-semibold text-white">{t("NQA Team")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
