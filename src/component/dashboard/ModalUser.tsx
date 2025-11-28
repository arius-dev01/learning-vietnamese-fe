import { faCalendar, faEnvelope, faMapMarker, faPhone, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useAddUser } from '../../hooks/useAddUser';
import { UserDTO } from '../../types/User';

interface ModalUserProps {
    isOpen: boolean;
    onClose: () => void;
    user?: UserDTO;
}

export default function ModalUser({ isOpen, onClose, user }: ModalUserProps) {
    const [formData, setFormData] = useState<UserDTO>({
        id: user?.id || 0,
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        phoneNumber: user?.phoneNumber || '',
        location: user?.location || '',
        avatar: user?.avatar || '',
        createdAt: user?.createdAt || '',
        updatedAt: user?.updatedAt || '',
        bio: user?.bio || '',
        birthdate: user?.birthdate || '',
        gender: user?.gender || 'MALE',
        language: user?.language || 'vietnamese',
        newPassword: '',
        roleName: user?.roleName || 'USER'
    });
    const { mutateAsync: addUser } = useAddUser();
    const handleAdd = async (userDTO: UserDTO) => {
        try {
            await addUser(userDTO); // dùng mutateAsync để chờ mutation hoàn tất
            onClose();
        } catch (error) {
            console.error(error);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                            {user ? 'Edit User' : 'Create New User'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {user ? 'Update user information and settings' : 'Add a new user to the system'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
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
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                            placeholder="Enter full name..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                                placeholder="Enter email address..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                                placeholder="Enter phone number..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Birthdate
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="date"
                                                name="birthdate"
                                                value={formData.birthdate}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                            />
                                        </div>
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="TEACHER">Teacher</option>
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
                                        Location
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faMapMarker} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
                                            placeholder="Enter location..."
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Bio Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:outline  text-sm font-medium tracking-tight resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
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
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-700 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleAdd(formData)}
                        className="px-6 py-2.5 bg-[#007AFF] hover:bg-[#0056CC] text-white font-medium text-sm rounded-lg transition-colors duration-150"
                    >
                        {user ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
}