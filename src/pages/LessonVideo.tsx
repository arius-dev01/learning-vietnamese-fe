import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/common/Header';
import { getLessonByTitle } from '../service/lessonService';
import { LessonDTO } from '../types/Lession';
import Footer from '../component/common/Footer';

export default function LessonVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2);
  const [duration] = useState(900); // 15 minutes
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const [lessonDetails, setLessonDetails] = useState<LessonDTO>();
  const { slug } = useParams();
   useEffect(() => {
    document.title = "Lesson Video"
  })
  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      const res = await getLessonByTitle(slug);
      setLessonDetails(res.data);
      console.log(res.data);
    };
    fetchData();
  }, [slug]);
  const navigate = useNavigate();
  const progressPercent = (currentTime / duration) * 100;
  const youtubeUrl = `https://www.youtube.com/embed/y5Gk0MHMp0I?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0&origin=${window.location.origin}`;

  return (
    <>
      <Header />
      <div className='bg-[#141f25] min-h-screen text-white'>
        <div className='max-w-[1200px] mx-auto px-2 py-6'>
          {/* Header với nút Back */}
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-300 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Back to Lesson</span>
            </button>
          </div>

          <div className="flex flex-col">
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">{lessonDetails?.title}</h1>
                <p className="text-gray-300">{lessonDetails?.describe}</p>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${youtubeUrl}?autoplay=0&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                    title="Vietnamese Greetings Lesson"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>


              <div className="mt-6 bg-[#1b262c] p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">About This Video</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {lessonDetails?.content}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-2">15 minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Level:</span>
                    <span className="text-white ml-2">{lessonDetails?.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Vocabulary:</span>
                    <span className="text-white ml-2">{lessonDetails?.vocabularies.length} phrases</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Subtitles:</span>
                    <span className="text-white ml-2">Available</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
