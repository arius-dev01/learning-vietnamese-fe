import { faBook, faEdit, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ModalTopic from '../../component/dashboard/ModalTopic';
import { useTopicQuery } from '../../hooks/useTopic';
import { TopicDTO } from '../../types/Topic';



export default function AdminTopic() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<TopicDTO>();
    const [page, setPage] = useState(0);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Partial<TopicDTO>>();
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    const [showModalAddTopic, setShowModalAddTopic] = useState(false);
    const { data } = useTopicQuery(selectedGameId || undefined, page, searchTerm);
    const topics = data?.topics || [];

    const handleUpdateTopic = async () => {
        try {
            if (!editingId) {
                toast.error("No topic selected for update");
                return;
            }
            console.log("Updating topic with data:", editingData);
            // await mutateUpdateTopic(editingData as TopicDTO);
            setEditingId(null);
            toast.success("Topic updated successfully");
        } catch (error: any) {
            console.error("Error updating topic:", error?.data?.message || error);
            toast.error("Failed to update topic");
        }
    };

    const handleDeleteTopic = (id: number) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            console.log('Delete topic:', id);
            toast.success("Topic deleted successfully");
        }
    };
    const games = [
        { id: 1, name: 'Multiple Choice Question' },
        { id: 3, name: 'Listen & Choose' },
        { id: 4, name: 'Arrange Sentence' },
    ]
    return (
        <div className="p-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Topic Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Organize lessons by topics and manage learning categories</p>
                </div>
                <button
                    onClick={() => setShowModalAddTopic(true)}
                    className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 shadow-sm"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    Add New Topic
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by topic title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent text-sm font-medium tracking-tight"
                        />
                    </div>
                    <select onChange={(e) => setSelectedGameId(Number(e.target.value))} name="" className='focus:ring-0 focus:outline-none border border-gray-200 rounded' id="">
                        <option value="">All Games</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Topics Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Topic Title</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Description</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Created Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm tracking-tight">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topics.map((topic) => (
                                <tr key={topic.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-gray-500">#{topic.id}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div>

                                                <h3 className="font-semibold text-gray-900 text-lg">{topic.name}</h3>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">


                                        <span className="text-gray-700">{topic.description}</span>

                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-gray-500 text-sm">
                                            {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTopic(topic);
                                                    setShowModal(true);
                                                }}
                                                className="px-2 py-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                                                title="Edit topic"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                                            </button>


                                            <button
                                                onClick={() => handleDeleteTopic(topic.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                title="Delete topic"
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

                {/* Empty State */}
                {topics.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faBook} className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-500 text-sm mb-2">No topics found matching your search.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-[#007AFF] hover:text-[#0056CC] text-sm font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Placeholder */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedTopic ? 'Edit Topic' : 'Add New Topic'}
                        </h3>
                        <p className="text-gray-600 mb-4">Modal content will be implemented here.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedTopic(undefined);
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

            {topics.length > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl">

                    <div className="flex items-center gap-2">
                        <button disabled={page <= 0} onClick={() => setPage(prev => prev - 1)} className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                            Previous
                        </button>
                        {data?.topics && Array.from({ length: data.totalPages }).map((_, index) => (
                            <button onClick={() => setPage(index)} className={`px-3 py-2 text-sm font-medium ${index === page ? 'bg-[#007AFF] text-white' : 'text-black'}   rounded-lg`}>
                                {index + 1}
                            </button>
                        ))}

                        <button
                            disabled={page >= (data?.totalPages ?? 1) - 1}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {showModalAddTopic && (
                <ModalTopic isOpen={showModalAddTopic} onClose={() => setShowModalAddTopic(false)} />
            )}

            {showModal && (
                <ModalTopic isOpen={showModal} onClose={() => setShowModal(false)} data={selectedTopic} />
            )}
        </div>
    );
}