import {
  faEdit,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminImportExcelModalQ from "../../component/dashboard/AdminImportExcelModalQ";
import { useDeleteGame } from "../../hooks/useDeleteGame";
import { useQueryLesson } from "../../hooks/useLesson";
import { useQueryGame } from "../../hooks/useQueryGame";
import { useQueryGameDetail } from "../../hooks/useQueryGameDetails";
import AdminArrangeQuestion from "./AdminArraneQuestion";
import AdminEditQuestion from "./AdminEditQuestion";
import type { Question } from "../../types/Question";
import Swal from "sweetalert2";

export default function AdminLessonGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModaArrangelOpen, setIsModaArrangeModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  console.log(page);
  const { mutateAsync: mutateQuery } = useQueryGameDetail();
  const [mcData, setMcData] = useState<Question[]>([]);
  const [showModalExport, setShowModalExport] = useState(false);
  const [arrangeData, setArrangeData] = useState<Question[]>([]);
  const handleEdit = async (
    lessonId: number,
    gameId: number
  ): Promise<Question[]> => {
    const res = await mutateQuery({ lessonId, gameId });
    return res.data;
  };
  const [selectedLessonId, setSelectedLessonId] = useState<number>();
  const navigate = useNavigate();
  const { data } = useQueryGame(
    selectedLessonId === 0 ? undefined : selectedLessonId,
    page
  );
  console.log(data);
  const games = data?.games || [];
  const { data: lessonData } = useQueryLesson();

  const [selectedGameType, setSelectedGameType] = useState<"MC" | "LS" | "AS">(
    "MC"
  );
  const { mutateAsync: mutateDeleteGame } = useDeleteGame();
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Game",
      text: "Are you sure you want to delete this game? This action cannot be undone.",
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
      await mutateDeleteGame(id);
    }
  };
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Lesson Games Management
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedGameType("MC");
                setShowModalExport(true);
              }}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Multiple Choice
            </button>

            <button
              onClick={() => {
                setSelectedGameType("LS");
                setShowModalExport(true);
              }}
              className="flex cursor-pointer  items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-green-600 hover:bg-green-700 text-white transition"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Listen & Choose
            </button>

            <button
              onClick={() => {
                setSelectedGameType("AS");
                setShowModalExport(true);
              }}
              className="flex cursor-pointer  items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Arrange Sentence
            </button>
          </div>
        </div>
      </div>
      <div className="flex mb-4 justify-end gap-3">
        {/* <input type="text" name="" id="" placeholder='Search by name lesson' className='px-4 py-2 border border-gray-200 rounded flex-1 w-full' /> */}
        <div className="relative">
          <select
            onChange={(e) => setSelectedLessonId(Number(e.target.value))}
            value={selectedLessonId || ""}
            className="focus:outline-none focus:ring-0 border cursor-pointer border-gray-200 rounded px-4 py-2 pr-8"
          >
            <option value="">All</option>
            {lessonData?.lesson.map((it) => (
              <option className="" key={it.id} value={it.id}>
                {it.title}
              </option>
            ))}
          </select>
        </div>

        {selectedLessonId && selectedLessonId !== 0 && (
          <button
            onClick={() => {
              setSelectedLessonId(undefined);
              setPage(0);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
            Clear All
          </button>
        )}
      </div>
      {/* Lesson Games Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Lesson
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Game Name
              </th>
              {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Game Type</th> */}

              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.map((it) => (
              <tr key={it.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{it.titleLesson}</td>
                <td className="px-4 py-3">{it.title}</td>
                <td className="px-4 py-3">
                  <section className="flex gap-2">
                    <button
                      onClick={() => {
                        if (it.type === "MC" || it.type === "LS") {
                          setIsModalOpen(true);
                          handleEdit(it.lessonId, it.gameTypeId).then((res) =>
                            setMcData(res)
                          );
                        } else {
                          setIsModaArrangeModalOpen(true);
                          handleEdit(it.lessonId, it.gameTypeId).then((res) =>
                            setArrangeData(res)
                          );
                        }
                      }}
                      className="p-2 cursor-pointer  text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150 "
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(it.id);
                      }}
                      className="p-2 cursor-pointer   text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </section>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {games.length > 0 && (
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
                Array.from({ length: data?.totalPage }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
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
      </div>

      {isModalOpen && (
        <AdminEditQuestion
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={mcData}
        />
      )}
      {isModaArrangelOpen && (
        <AdminArrangeQuestion
          isOpen={isModaArrangelOpen}
          onClose={() => setIsModaArrangeModalOpen(false)}
          data={arrangeData}
        />
      )}
      {showModalExport && (
        <AdminImportExcelModalQ
          isOpen={showModalExport}
          onClose={() => setShowModalExport(false)}
          mode={selectedGameType}
        />
      )}
    </div>
  );
}
