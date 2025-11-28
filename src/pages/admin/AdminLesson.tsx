import { faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ModalLesson from '../../component/dashboard/ModalLesson';
import { useDeleteLesson } from '../../hooks/useDeleteLesson';
import { useQueryLesson } from '../../hooks/useLesson';
import { LessonDTO } from '../../types/Lession';



export default function AdminLesson() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const { data } = useQueryLesson(page, searchTerm, selectedLevel);
    const { mutateAsync: mutateDeleteLesson } = useDeleteLesson();
    const lessons = data?.lesson || [];
    const getLevelBadge = (level: string) => {
        const badges = {
            beginner: 'bg-green-100 text-green-800 border-green-200',
            intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            advanced: 'bg-red-100 text-red-800 border-red-200'
        };
        return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-200';
    };
    const [selectLesson, setSelectLesson] = useState<LessonDTO>();
    const [showModalEdit, setShowModalEdit] = useState(false);
    const handleDelete = async (id: number) => {
        try {
            window.confirm("Are you sure to delete this lesson?") && await mutateDeleteLesson(id);
        } catch (err: any) {
            toast.error("Error delete lesson");
            console.error(err.message);
        }
    }
    
    return (
        <div className="p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Lessons Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and organize learning content</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    Add New Lesson
                </button>
            </div>

            <div className="bg-white rounded-xl mt-2  ">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search lessons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg  focus:ring-[#007AFF]  text-sm font-medium tracking-tight"
                        />
                    </div>

                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:ring-[#007AFF] text-sm font-medium tracking-tight min-w-[140px]"
                    >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>


                </div>
            </div>



            <div className="bg-white rounded-xl mt-2 border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Lesson</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Level</th>

                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Updated</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Created</th>
                                <th className="text-left py-4 px-8 font-semibold text-gray-900 text-sm tracking-tight">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {lessons.map((lesson) => (
                                <tr key={lesson.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="py-4 px-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm tracking-tight">{lesson.title}</h3>
                                            <p className="text-gray-500 line-clamp-2 text-xs mt-1 leading-relaxed">{lesson.describe}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelBadge(lesson.level.toLowerCase())}`}>
                                            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6">
                                        <span className="text-gray-500 text-sm">{new Date(lesson.updated).toLocaleDateString()}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-gray-500 text-sm">{new Date(lesson.created).toLocaleDateString()}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex   gap-2">
                                            {/* <button className="p-2  text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150">
                                                <FontAwesomeIcon icon={faEye} className="text-sm" />
                                            </button> */}
                                            <button onClick={() => {
                                                setSelectLesson(lesson);
                                                setShowModalEdit(true);
                                            }} className="p-2  text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150">
                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                            </button>
                                            <button onClick={() => handleDelete(lesson.id)} className="p-2  text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150">
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {lessons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No lessons found matching your criteria.</p>
                        <button onClick={() => { setSearchTerm(''); setSelectedLevel('') }} className="mt-4 text-[#007AFF] hover:text-[#0056CC] text-sm font-medium">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {lessons.length > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl">

                    <div className="flex items-center gap-2">
                        <button disabled={page <= 0} onClick={() => setPage(prev => prev - 1)} className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                            Previous
                        </button>
                        {data?.totalPage && Array.from({ length: data.totalPage }).map((_, index) => (
                            <button onClick={() => setPage(index)} className={`px-3 py-2 text-sm font-medium ${index === page ? 'bg-[#007AFF] text-white' : 'text-black'}   rounded-lg`}>
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={page >= (data?.totalPage ?? 1) - 1}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {showModal && (
                <ModalLesson isOpen={showModal} onClose={() => setShowModal(false)} />
            )}

            {showModalEdit && (
                <ModalLesson isOpen={showModalEdit} onClose={() => setShowModalEdit(false)} lesson={selectLesson} />
            )}
        </div>
    );
}