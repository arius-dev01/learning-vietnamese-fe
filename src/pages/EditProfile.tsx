import {
  faArrowLeft,
  faPen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { uploadImage } from "../service/uploadService";
import { editProdile, getInforUser } from "../service/userService";
import type { UserDTO } from "../types/User";

export default function EditProfile() {
  const [form, setForm] = useState<UserDTO>({
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
    roleName: "",
    newPassword: "",
  });
  const [originalData, setOriginalData] = useState<UserDTO>({
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
    roleName: "",
    language: "",
    gender: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchform = async () => {
      try {
        const res = await getInforUser();
        setForm(res.data);
        setOriginalData(res.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchform();
  }, []);
  const isChanged = JSON.stringify(form) !== JSON.stringify(originalData);
  const handleInputChange = (field: keyof UserDTO, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const [file, setFile] = useState<File>();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    try {
      await editProdile(form);
      if (file) {
        await uploadImage(file);
      }
      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
      await toast.success("Update profile successfully");
      navigate("/profile"); // reload lại trang
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update profile failed");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const parts = form?.fullName?.trim().split(/\s+/);
  const first =
    (parts && parts[parts.length - 2]?.charAt(0).toUpperCase()) || "";
  const last =
    (parts && parts[parts.length - 1]?.charAt(0).toUpperCase()) || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  return (
    <div className="bg-[#141f25] min-h-screen text-white py-10">
      <div className="max-w-[1200px] mx-auto  px-4">
        <button  onClick={() => navigate("/profile")} className="mb-4 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <form action="" onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-3 relative w-28 h-28 ">
            <label className="font-semibold" htmlFor="">
              Avatar
            </label>
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-28 h-28 rounded-full border-2 border-cyan-500 shadow-md object-cover"
              />
            ) : form.avatar && form.avatar !== "Unknow" ? (
              <img
                src={form?.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full border-2 border-cyan-500 shadow-md object-cover"
              />
            ) : (
              <div className="w-28 h-28 bg-white text-black rounded-full flex items-center text-2xl justify-center">
                {first + last}
              </div>
            )}
            <label
              htmlFor="imageInp"
              className="absolute cursor-pointer top-8 right-0 bg-cyan-600 hover:bg-cyan-700 text-white p-2 w-[20px] h-[20px] flex items-center justify-center rounded-full shadow"
            >
              <FontAwesomeIcon className="text-[8px]" icon={faPen} />
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setFile(file);
                  handleInputChange("avatar", URL.createObjectURL(file));
                  setPreview(URL.createObjectURL(file));
                }
              }}
              accept="image/*"
              className="hidden"
              name=""
              id="imageInp"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              value={form?.fullName}
              className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              Email
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("email", e.target.value)}
              value={form?.email}
              className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              Phone
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              value={form?.phoneNumber}
              className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
            />
          </div>
          <div className="space-y-2 ">
            <label htmlFor="" className="font-semibold">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                autoComplete="new-password"
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2  right-3"
              >
                {form.password &&
                  form.password.length > 0 &&
                  (showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ))}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              New password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
              />
              <button
                type="button"
                onClick={() => setNewShowPassword(!showNewPassword)}
                className="absolute top-2  right-3"
              >
                {form.newPassword &&
                  form.newPassword.length > 0 &&
                  (showNewPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ))}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              Location
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("location", e.target.value)}
              value={form?.location}
              className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="font-semibold">
              Bio
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("bio", e.target.value)}
              value={form?.bio}
              className="w-full bg-[#202f36] text-white placeholder:text-[#c8e2e3]/70 rounded-xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 px-4 py-2 transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isChanged}
              className={`bg-cyan-600 px-4 py-2 flex items-center rounded-xl hover:bg-cyan-800 ${
                isChanged ? "" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
