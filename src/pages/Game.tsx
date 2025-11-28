import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../component/common/Header'
import { findGameByLessonId } from '../service/gameService'
import { GameDTO } from '../types/Game'

export default function Game() {
    const { lessonId } = useParams()
    const navigate = useNavigate();
    const [games, setGames] = useState<GameDTO[]>([]);
    useEffect(() => {
        document.title = "Game"
    })
    const { t } = useTranslation();
    const idlesson = Number(lessonId);
    useEffect(() => {
        const fetchData = async () => {
            if (!lessonId) {
                navigate("/");
            }
            const res = await findGameByLessonId(idlesson);
            setGames(res.data.games);

        };
        fetchData();
    }, [lessonId]);
    return (
        <div className="bg-[#141f25] min-h-screen text-white">
            <Header />
            <div className="max-w-[1200px] mx-auto w-full mt-6 px-4">
                <div className="flex items-center space-x-3 mb-6">
                    <button className="text-gray-300 hover:text-white transition">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate(-1)} size="lg" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">{t('Practice Games')}</h2>
                        <p className="text-sm text-gray-400">
                            {t('Choose a game type to start practicing')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {
                        games ? games.map((game) => (
                            <div
                                className="flex flex-col items-center bg-[#1b262c] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform "
                            >
                                <h2 className="font-semibold text-lg mb-2">{t(game.title)}</h2>
                                <p className="text-sm text-gray-400 text-center flex-1">
                                    {t(game.description)}
                                </p>

                                <button
                                    onClick={() => {
                                        const slug = game.title.replace(/\s+/g, "-");
                                        (game.type === 'MC' || game.type === 'LS') ? navigate(`/quiz/game/${slug.toLowerCase()}/mc/${lessonId}`) : navigate(`/quiz/game/${slug.toLowerCase()}/as/${lessonId}`)
                                    }}
                                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition"
                                >
                                    {t('Start Game')}
                                </button>
                            </div>
                        )) : <div>No games available</div>
                    }

                    {/* <div
                        className="flex flex-col items-center bg-[#1b262c] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform "
                    >
                        <h2 className="font-semibold text-lg mb-2">Listen & Choose</h2>
                        <p className="text-sm text-gray-400 text-center flex-1">
                            Listen to audio and select the correct answer.
                        </p>
                        <button
                            onClick={() => navigate(`/quiz/game/3/mutiple/${lessonId}`)}
                            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition"
                        >
                            Start Game
                        </button>
                    </div>

                    <div
                        className="flex flex-col items-center bg-[#1b262c] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform "
                    >
                        <h2 className="font-semibold text-lg mb-2">Arrange Sentence</h2>
                        <p className="text-sm text-gray-400 text-center flex-1">
                            Put words in the correct order.
                        </p>
                        <button onClick={() => navigate(`/quiz/game/4/arrange-sentence/${lessonId}`)}
                            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition"
                        >
                            Start Game
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
