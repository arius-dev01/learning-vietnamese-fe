import {
  faCalendar,
  faEnvelope,
  faMapMarker,
  faPhone,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useAddUser } from "../../hooks/useAddUser";
import { toast } from "react-toastify";
import type { UserDTO } from "../../types/User";
import { useEditUser } from "../../hooks/useEditUser";

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  setUser: (user: UserDTO | undefined) => void;
  user?: UserDTO;
  mode: "add" | "edit";
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthdate?: string;
  location?: string;
  bio?: string;
}

export default function ModalUser({
  isOpen,
  onClose,
  user,
  setUser,
  mode,
}: ModalUserProps) {
  const [formData, setFormData] = useState<UserDTO>({
    id: user?.id || 0,
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location || "",
    avatar: user?.avatar || "",
    createdAt: user?.createdAt || "",
    updatedAt: user?.updatedAt || "",
    bio: user?.bio || "",
    birthdate: user?.birthdate || "",
    gender: user?.gender || "MALE",
    language: user?.language || "vietnamese",
    newPassword: "",
    roleName: user?.roleName || "USER",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: editUser } = useEditUser();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Only allow digits, no letters or special characters
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = "Full name must be less than 100 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation (required)
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (10-11 digits)";
    }

    // Birthdate validation (required)
    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required";
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 100);

      if (birthDate > today) {
        newErrors.birthdate = "Birthdate cannot be in the future";
      } else if (birthDate < minAge) {
        newErrors.birthdate = "Please enter a valid birthdate";
      }
    }

    // Location validation (required)
    if (!formData.location || !formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.length > 200) {
      newErrors.location = "Location must be less than 200 characters";
    }

    // Bio validation (optional)
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (userDTO: UserDTO) => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (mode === "add") {
        await addUser(userDTO);
        onClose();
      } else {
        await editUser(userDTO);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
      console.error(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {user ? "Edit User" : "Create New User"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {user
                ? "Update user information and settings"
                : "Add a new user to the system"}
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setUser(undefined);
            }}
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        <div className="flex max-h-[calc(90vh-140px)]">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-[#007AFF]" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter full name..."
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Enter email address..."
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Enter phone number..."
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthdate <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        className={`w-full cursor-pointer pl-10 pr-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                          errors.birthdate
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                    {errors.birthdate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.birthdate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full cursor-pointer px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleInputChange}
                      className="w-full px-4 cursor-pointer py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                        >
                                            <option value="vietnamese">Vietnamese</option>
                                            <option value="english">English</option>
                                            <option value="japanese">Japanese</option>
                                        </select>
                                    </div> */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faMapMarker}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                    />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm font-medium tracking-tight ${
                        errors.location ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter location..."
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Additional Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-0 focus:outline text-sm font-medium tracking-tight resize-none ${
                      errors.bio ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {formData.bio?.length || 0}/500 characters
                  </p>
                </div>

                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Avatar URL
                                    </label>
                                    <input
                                        type="url"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              setUser(undefined);
            }}
            className="px-6 cursor-pointer py-2.5 text-gray-700 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(formData)}
            className="px-6 py-2.5 cursor-pointer bg-[#007AFF] hover:bg-[#0056CC] text-white font-medium text-sm rounded-lg transition-colors duration-150"
          >
            {mode === "edit" ? "Update User" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
