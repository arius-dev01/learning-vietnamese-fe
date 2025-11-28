import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AvatarSetup() {
    const [prevViewImage, setPrevViewImage] = useState<string | null>(null);
    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            console.log(url);
            setPrevViewImage(url);
        }
    }
    return (
        <div className="min-h-screen bg-[#141f25] flex items-center justify-center p-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-md text-center">
                <h2 className="text-white font-semibold text-xl mb-2">
                    Choose your Avatar
                </h2>
                <p className="text-white/60 mb-6">
                    Upload your photo or pick a default avatar
                </p>

                <div className="flex justify-center mb-6">
                    {prevViewImage ? (
                        <img src={prevViewImage} alt="" className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className="text-gray-500 w-32 h-32"
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="avatarUpload" className="cursor-pointer inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition" >
                        Upload from device
                    </label>
                    <input type="file" accept="image/*" id="avatarUpload" className="hidden" onChange={handleSelectImage} />
                </div>

                <div className="flex justify-between">
                    <button className="px-4 py-2 text-white/70 hover:text-white transition">
                        Skip for now
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition">
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
