import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../component/common/Footer';
import Header from '../component/common/Header';
import api from '../service/axiosClient';
import { getLessonByTitle } from '../service/lessonService';
import { LessonDTO } from '../types/Lession';

export default function LessonDetails() {
  const [actions, setActions] = useState('Content');
  useEffect(() => {
    document.title = "Lesson Details"
  }, [])
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [lessonDetails, setLessonDetails] = useState<LessonDTO>();
  const { title } = useParams();
  useEffect(() => {
    if (!title) return;
    const fetchData = async () => {
      const res = await getLessonByTitle(title);
      setLessonDetails(res.data);
    };
    fetchData();
  }, [title, i18n.language]);
  const navigate = useNavigate();
  const speakText = async (text: string) => {
    try {
      const response = await api.get(`/tts?text=${encodeURIComponent(text)}`, {
        responseType: 'blob', // quan trọng
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();

      // Giải phóng URL khi không dùng nữa
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error(error);
    }
  };

  if (!title) return <div>Loading...</div>;
  return (
    <>
      <Header />
      <div className='bg-[#141f25] min-h-screen text-white'>
        {lessonDetails && (
          <div className='max-w-[1200px] mx-auto w-full  px-4 py-4'>
            <div className='flex gap-3 items-center'>
              <button onClick={() => navigate("/home")}><FontAwesomeIcon icon={faArrowLeft} /></button>
              <span>{t('Back to Lessons')}</span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-5 gap-8 '>
              <div className='sm:col-span-3 lg:col-span-3'>
                <h1 className='font-semibold text-2xl mt-4'>{lessonDetails.title}</h1>
                <p className=' text-gray-500 line-clamp-3 sm:line-clamp-none'>{lessonDetails.describe}</p>
                <p><FontAwesomeIcon icon={faClock} />15 {t('minutes')}</p>
                <div>
                  <div className='sm:col-span-3 lg:col-span-2'>
                    {/* Tabs */}
                    <div className='flex gap-4 border-b border-gray-600 py-4 mb-6'>
                      <button onClick={() => setActions("Content")} className={`pb-2 ${actions === "Content" ? "text-orange-400 transition-all border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}>{t('Content')}</button>
                      <button onClick={() => setActions("Vocabulary")} className={`pb-2 ${actions === "Vocabulary" ? "text-orange-400 transition-all border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}>{t('Vocabulary')}</button>
                    </div>

                    {/* Nội dung tabs */}
                    {actions === "Content" && (
                      <div className='space-y-6'>
                        <div>
                          <h2 className='text-xl font-bold mb-3'># {lessonDetails.title}</h2>

                          <div className='mb-6'>
                            <h3 className='text-lg font-semibold text-gray-300 mb-3'>## {t('Introduction')}</h3>
                            <p className='text-gray-300 leading-relaxed'>
                              {lessonDetails.content}
                            </p>
                          </div>

                          <div className='mb-6'>
                            <h3 className='text-lg font-semibold text-gray-300 mb-3'>## {t('Common Greetings')}</h3>
                            <div className='space-y-3 text-gray-300'>
                              {lessonDetails.vocabularies.map(item => (
                                <div className='bg-[#1b262c] p-4 rounded-lg'>
                                  <p>- <strong className='text-white'>"{item.word}"</strong> - {item.meaning}</p>
                                </div>
                              ))}

                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {actions === "Vocabulary" && (
                      <div className='space-y-4'>
                        <h2 className='text-xl font-bold mb-4'>Vocabulary List</h2>
                        <div className='grid gap-4'>
                          {lessonDetails.vocabularies.map((word, index) => (
                            <div key={index} className='bg-[#1b262c] p-2 rounded-lg border border-gray-600'>
                              <div className='flex justify-between items-start mb-2'>
                                <h4 className='text-lg font-semibold text-white'>{word.word}</h4>
                                <button onClick={() => speakText(word.word)} className='text-blue-400 hover:text-blue-300'>
                                  🔊
                                </button>
                              </div>
                              <p className='text-gray-300 mb-1'><strong>English:</strong> {word.meaning}</p>
                              <p className='text-gray-400 italic'><strong>Pronunciation:</strong> {word.pronunciation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='lg:col-span-2'>
                <div className='bg-[#1b262c] rounded-lg border border-gray-600 p-6 mb-6'>
                  <h3 className='text-lg font-semibold mb-4'>{t('Learning Options')}</h3>
                  <div className='space-y-3'>
                    <button onClick={() => navigate(`/lessons-video/${lessonDetails.title.toLowerCase().replace(/\s+/g, '-')}`)} className='w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center'>
                      <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' clipRule='evenodd' />
                      </svg>
                      {t('Watch Video Lesson')}
                    </button>
                    <button onClick={() => navigate(`/game/${lessonDetails.id}`)} className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center'>
                      <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z' clipRule='evenodd' />
                      </svg>
                      {t('Practice Games')}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className='bg-[#1b262c] rounded-lg border border-gray-600 p-6'>
                  <h3 className='text-lg font-semibold mb-4'>{t('Quick Stats')}</h3>
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-400'>{t('Vocabulary Words')}</span>
                      <span className='font-semibold text-white'>{lessonDetails.vocabularies.length}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-400'>{t('Estimated Time')}</span>
                      <span className='font-semibold text-white'>15 {t('minutes')}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-400'>{t('Difficulty')}</span>
                      <span className='font-semibold text-white'>{lessonDetails.level}</span>
                    </div>

                  </div>
                </div>


              </div>



            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
