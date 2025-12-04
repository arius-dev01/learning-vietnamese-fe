import {
  faEdit,
  faPlus,
  faSearch,
  faTrash,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ModalUser from "../../component/dashboard/ModalUser";
import { useAddUser } from "../../hooks/useAddUser";
import { useDeleteRole } from "../../hooks/useDeleteUser";
import { useUpdateRole } from "../../hooks/useUpdateRole";
import { useUserQuery } from "../../hooks/useUser";
import { Role, type UserDTO } from "../../types/User";
import Swal from "sweetalert2";
import { t } from "i18next";
import { logout } from "../../service/userService";
import { useAuth } from "../../context/useAuth";

export default function AdminUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(Role.ALL);
  const [page, setPage] = useState(0);
  const { data } = useUserQuery(searchTerm, selectedRole, page);
  const users = data?.users || [];
  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      TEACHER: "bg-blue-100 text-blue-800 border-blue-200",
      STUDENT: "bg-green-100 text-green-800 border-green-200",
      USER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      badges[role as keyof typeof badges] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteUser } = useDeleteRole();
  const handleChangeRole = async (userId: number, role: Role) => {
    await updateRole({ userId, role });
  };
  const { user } = useAuth();
  const id = user?.id;
  const deleteUserById = async (userId: number) => {
    const result = await Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red
      cancelButtonColor: "#6b7280",
      confirmButtonText: "DELETE",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#000000",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser({ userId });
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully.",
          icon: "success",
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to delete user.",
          icon: "error",
        });
      }
    }
  };
  const getGenderBadge = (gender: string) => {
    const badges = {
      MALE: "bg-blue-100 text-blue-800 border-blue-200",
      FEMALE: "bg-pink-100 text-pink-800 border-pink-200",
      OTHER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      badges[gender as keyof typeof badges] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getDefaultAvatar = (fullName: string) => {
    const initials = fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=007AFF&color=fff&size=128&font-size=0.5`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO>();
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<UserDTO>({
    id: 0,
    fullName: "",
    email: "",
    password: "",
    roleName: "USER",
    gender: "OTHER",
    phoneNumber: "",
    birthdate: "",
    avatar: "",
    bio: "",
    createdAt: "",
    updatedAt: "",
    language: "EN",
    location: "",
    newPassword: "",
  });
  return (
    <div className=" p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Users Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => {
            setShowModalAdd(true);
            setMode("add");
          }}
          className="bg-[#007AFF] cursor-pointer hover:bg-[#0056CC] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl my-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg  text-sm font-medium tracking-tight"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole(Role.ALL);
                  setPage(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-150"
                title="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            )}
          </div>

          {/* Role Filter */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {data?.total}
          </p>
        </div>
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Admins</h3>
          <p className="text-2xl font-semibold text-purple-600 mt-1">
            {data?.totalAdmin}
          </p>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Users</h3>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {data?.totalUser}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  User
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Role
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Gender
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Phone
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Birthdate
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar || getDefaultAvatar(user.fullName)}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultAvatar(user.fullName);
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm tracking-tight">
                          {user.fullName}
                        </h3>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <select
                        className={`inline-flex cursor-pointer items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                          user.roleName
                        )}`}
                        value={user.roleName} // set selected
                        onChange={(e) =>
                          handleChangeRole(user.id, e.target.value as Role)
                        }
                      >
                        {["ADMIN", "USER"].map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getGenderBadge(
                          user.gender
                        )}`}
                      >
                        {user.gender}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {user.phoneNumber && (
                        <>
                          <span className="text-gray-600 text-sm">
                            {user.phoneNumber}
                          </span>
                        </>
                      )}
                      {!user.phoneNumber && (
                        <span className="text-gray-400 text-sm">
                          Not provided
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-500 text-sm">
                      {user.birthdate ? formatDate(user.birthdate) : "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {/* <button className="p-2  text-blue-600  rounded-lg transition-colors duration-150" title="View details">
                                                <FontAwesomeIcon icon={faEye} className="text-sm" />
                                            </button> */}
                      <button
                        className="p-2 cursor-pointer  text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                        title="Edit user"
                        onClick={() => {
                          setFormData(user);
                          setMode("edit");
                          setShowModalAdd(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </button>
                      {user.id !== id && (
                        <button
                          onClick={() => deleteUserById(user.id)}
                          className="p-2 cursor-pointer   text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="Delete user"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-400 text-xl"
              />
            </div>
            <p className="text-gray-500 text-sm mb-2">
              No users found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRole(Role.ALL);
              }}
              className="text-[#007AFF] cursor-pointer hover:text-[#0056CC] text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 0}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {data?.totalPage &&
              Array.from({ length: data.totalPage }).map((_, index) => (
                <button
                  onClick={() => setPage(index)}
                  className={`px-3 cursor-pointer py-2 text-sm font-medium ${
                    index === page ? "bg-[#007AFF] text-white" : "text-black"
                  }   rounded-lg`}
                >
                  {index + 1}
                </button>
              ))}

            <button
              disabled={page >= (data?.totalPage ?? 1) - 1}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3  py-2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showModalAdd && (
        <ModalUser
          mode={mode}
          setUser={() => setFormData("" as unknown as UserDTO)}
          user={formData}
          isOpen={showModalAdd}
          onClose={() => setShowModalAdd(false)}
        />
      )}
    </div>
  );
}
