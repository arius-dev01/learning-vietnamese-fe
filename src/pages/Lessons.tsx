import { useEffect } from 'react'
import DailyCheckIn from '../component/DailyCheckIn'
import LessonCard from '../component/LessonCard'
import Header from '../component/common/Header'
import Footer from '../component/common/Footer'

export default function Lessons() {
  useEffect(() => {
    document.title = "Home"
  })
  return (
    <div className='bg-[#141f25]'>
      <Header />
      <DailyCheckIn/>
      <LessonCard />
      <Footer/>
    </div>
  )
}
