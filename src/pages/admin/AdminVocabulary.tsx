import {
  faBook,
  faCheck,
  faEdit,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import ModalVocabulary from "../../component/dashboard/ModalVocabulary";
import { useDeleteVocabulary } from "../../hooks/useDeleteVocabulary";
import { useQueryLesson } from "../../hooks/useLesson";
import { useVocabularyQuery } from "../../hooks/useVocabulay";
import type { VocabularyDTO } from "../../types/Lession";
import ModalEditVocabulary from "../../component/dashboard/ModalEditVocabulary";
import Swal from "sweetalert2";

export default function AdminVocabulary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabularyDTO>();
  const [page, setPage] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [initialData, setInitialData] = useState<VocabularyDTO>();
  const { data } = useVocabularyQuery(
    searchTerm,
    selectedLesson || undefined,
    page
  );
  const [showModalAddVocab, setShowModalAddVocab] = useState(false);

  const { data: lessonData } = useQueryLesson();
  const lessonOptions =
    lessonData &&
    lessonData.lesson.map((l) => ({
      value: l.id,
      label: l.title,
    }));
  const vocabularies = data?.vocabularies || [];
  const { mutateAsync: mutateDeleteVocabulary } = useDeleteVocabulary();
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Vocabulary",
      text: "Are you sure you want to delete this vocabulary? This action cannot be undone.",
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
      await mutateDeleteVocabulary(id);
    }
  };
  return (
    <div className=" p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Vocabulary Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage Vietnamese vocabulary and their English translations
          </p>
        </div>
        <button
          onClick={() => {
            setShowModalAddVocab(true);
          }}
          className="bg-[#007AFF] cursor-pointer hover:bg-[#0056CC] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          Add New Vocabulary
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search by Vietnamese"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent text-sm font-medium tracking-tight"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLesson(null);
                  setPage(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-150"
                title="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>
            )}
          </div>

          <div>
            <Select
              options={lessonOptions}
              value={
                lessonOptions?.find((opt) => opt.value === selectedLesson) ||
                null
              }
              onChange={(option) => {
                setSelectedLesson(option ? option.value : null);
                setPage(0);
              }}
              placeholder="Filter by Lesson"
              className="w-full md:w-64 focus:ring-0 focus:outline-none"
              isSearchable
              isClearable
            />
          </div>

          {(searchTerm || selectedLesson) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLesson(null);
                setPage(0);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  ID
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Lesson
                </th>

                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Vietnamese Word
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  English Meaning
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Japan Meaning
                </th>

                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Pronunciation
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vocabularies.map((vocab) => (
                <tr
                  key={vocab.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-500">
                      #{vocab.id}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{vocab.lesson}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {vocab.word}
                      </h3>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{vocab.meaning}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{vocab.meaningJa}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{vocab.pronunciation}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowModalEdit(true);
                          setInitialData(vocab);
                        }}
                        className="p-2 cursor-pointer  text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                        title="Edit vocabulary"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </button>

                      <button
                        onClick={() => handleDelete(vocab.id)}
                        className="p-2 cursor-pointer   text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        title="Delete vocabulary"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vocabularies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faBook}
                className="text-gray-400 text-xl"
              />
            </div>
            <p className="text-gray-500 text-sm mb-2">
              No vocabulary found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLesson(null);
                setPage(0);
              }}
              className="text-[#007AFF] cursor-pointer hover:text-[#0056CC] text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedVocab ? "Edit Vocabulary" : "Add New Vocabulary"}
            </h3>
            <p className="text-gray-600 mb-4">
              Modal content will be implemented here.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVocab(undefined);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0056CC]">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {vocabularies.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 0}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 cursor-pointer py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-3 cursor-pointer py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showModalAddVocab && (
        <ModalVocabulary
          isOpen={showModalAddVocab}
          onClose={() => setShowModalAddVocab(false)}
        />
      )}
      {showModalEdit && (
        <ModalEditVocabulary
          isOpen={showModalEdit}
          vocabulary={initialData}
          onClose={() => setShowModalEdit(false)}
        />
      )}
    </div>
  );
}
