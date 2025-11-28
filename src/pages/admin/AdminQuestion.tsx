import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminImportExcelModalQ from '../../component/dashboard/AdminImportExcelModalQ';
import { useDeleteGame } from '../../hooks/useDeleteGame';
import { useQueryLesson } from '../../hooks/useLesson';
import { useQueryGame } from '../../hooks/useQueryGame';
import { useQueryGameDetail } from '../../hooks/useQueryGameDetails';
import { Question } from '../../types/Question';
import AdminArrangeQuestion from './AdminArraneQuestion';
import AdminEditQuestion from './AdminEditQuestion';

export default function AdminLessonGames() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModaArrangelOpen, setIsModaArrangeModalOpen] = useState(false);

    const [editLessonId, setEditLessonId] = useState();
    const { mutateAsync: mutateQuery } = useQueryGameDetail();
    const [mcData, setMcData] = useState<Question[]>([]);
    const [showModalExport, setShowModalExport] = useState(false);
    const [arrangeData, setArrangeData] = useState<Question[]>([]);
    const handleEdit = async (lessonId: number, gameId: number): Promise<Question[]> => {
        const res = await mutateQuery({ lessonId, gameId });
        return res.data;
    };
    const [selectedLessonId, setSelectedLessonId] = useState<number>();
    const navigate = useNavigate();
    console.log(selectedLessonId);
    const { data } = useQueryGame(selectedLessonId === 0 ? undefined : selectedLessonId);
    const games = data?.games || [];
    const { data: lessonData } = useQueryLesson();

    const [selectedGameType, setSelectedGameType] = useState<'MC' | 'LS' | 'AS'>('MC');
    const { mutateAsync: mutateDeleteGame } = useDeleteGame();
    const handleDelete = async (id: number) => {
        try {
            await mutateDeleteGame(id);
            toast.success("Delete game successfully");
        } catch (err: any) {
            toast.error("Error delete game");
            console.error(err.message);
        }
    }
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Lesson Games Management</h1>
                <div className="flex items-center gap-3">

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setSelectedGameType('MC');
                                setShowModalExport(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Multiple Choice
                        </button>

                        <button
                            onClick={() => {
                                setSelectedGameType('LS');
                                setShowModalExport(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-green-600 hover:bg-green-700 text-white transition"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Listen & Choose
                        </button>

                        <button
                            onClick={() => {
                                setSelectedGameType('AS');
                                setShowModalExport(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md 
               bg-purple-600 hover:bg-purple-700 text-white transition"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Arrange Sentence
                        </button>
                    </div>


                </div>


            </div>
            <div className='flex mb-4 justify-end'>
                {/* <input type="text" name="" id="" placeholder='Search by name lesson' className='px-4 py-2 border border-gray-200 rounded flex-1 w-full' /> */}
                <select onChange={(e) => setSelectedLessonId(Number(e.target.value))} name="" id="" className='focus:outline-none focus:ring-0 border border-gray-200 rounded ml-4 px-4 py-2'>
                    <option value="">All</option>
                    {lessonData?.lesson.map(it => <option key={it.id} value={it.id}>{it.title}</option>)}
                </select>
            </div>
            {/* Lesson Games Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Lesson</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Game Name</th>
                            {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Game Type</th> */}

                            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {games.map(it =>
                            <tr key={it.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{it.titleLesson}</td>
                                <td className="px-4 py-3">{it.title}</td>
                                <td className="px-4 py-3">
                                    <section className='flex gap-2'>
                                        <button
                                            onClick={() => {
                                                if (it.type === "MC" || it.type === "LS") {
                                                    setIsModalOpen(true);
                                                    handleEdit(it.lessonId, it.gameTypeId).then(res => setMcData(res));
                                                } else {
                                                    setIsModaArrangeModalOpen(true);
                                                    handleEdit(it.lessonId, it.gameTypeId).then(res => setArrangeData(res));
                                                }
                                            }}
                                            className="text-green-600"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(it.id)
                                            }}
                                            className="text-red-600"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </section>
                                </td>

                            </tr>

                        )}
                    </tbody>
                </table>
            </div>

            {
                isModalOpen && (
                    <AdminEditQuestion
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        data={mcData}
                    />
                )
            }
            {
                isModaArrangelOpen && (
                    <AdminArrangeQuestion isOpen={isModaArrangelOpen} onClose={() => setIsModaArrangeModalOpen(false)} data={arrangeData} />
                )
            }
            {showModalExport && (
                <AdminImportExcelModalQ
                    isOpen={showModalExport}
                    onClose={() => setShowModalExport(false)}
                    mode={selectedGameType}
                />
            )}
        </div >
    );
}
