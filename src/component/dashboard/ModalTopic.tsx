import { TopicDTO } from "../../types/Topic";

interface Props  {
    isOpen?: boolean;
    onClose: () => void;
    data?: TopicDTO;
};
export default function ModalTopic({ onClose, data }: Props) {
    const games = [
        { id: 1, name: 'Multiple Choice Question' },
        { id: 3, name: 'Listen & Choose' },
        { id: 4, name: 'Arrange Sentence' },
    ]
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                        <input
                            type="text"
                            value={data?.name || ''}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                            placeholder="Enter topic title..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>

                        <select value={data?.gameId || 1} name="" className='focus:ring-0 focus:outline-none border border-gray-200 rounded' id="">
                            {games.map(game => (
                                <option key={game.id} value={game.id}>{game.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg px-3 py-2"
                            rows={3}
                            value={data?.description || ''}
                            placeholder="Enter topic description..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        
                        className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0056CC]"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}
