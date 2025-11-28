import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import PrivateRoute from './component/PrivateRoute';
import { ProtectedRoute } from './component/ProtectedRoute';
import Admin from './pages/admin/Admin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLesson from './pages/admin/AdminLesson';
import AdminQuestion from './pages/admin/AdminQuestion';
import AdminTopic from './pages/admin/AdminTopic';
import AdminUser from './pages/admin/AdminUser';
import AdminVocabulary from './pages/admin/AdminVocabulary';
import ArrangeSentence from './pages/ArrangeSentence';
import AvatarSetup from './pages/AvatarSetup';
import ChangePassword from './pages/ChangePassword';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import Game from './pages/Game';
import Home from './pages/Home';
import LessionDetails from './pages/LessonDetails';
import Lessons from './pages/Lessons';
import LessonVideo from './pages/LessonVideo';
import Login from './pages/Login';
import MultipleGame from './pages/MultipleGame';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ChangePassword />} />

        {/* Private routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <Lessons />
          </PrivateRoute>
        } />

        <Route path="" element={
          <Home />
        } />
        <Route path="/avatar-setup" element={
          <PrivateRoute>
            <AvatarSetup />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/game/:lessonId" element={
          <PrivateRoute>
            <Game />
          </PrivateRoute>
        } />
        <Route path="/lessons-video/:slug" element={
          <PrivateRoute>
            <LessonVideo />
          </PrivateRoute>
        } />
        <Route path="/quiz/game/:nameGame/as/:lessonId" element={
          <PrivateRoute>
            <ArrangeSentence />
          </PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />
     
        {/* <Route path="/quiz/game/:gameId/topic/:topicId" element={
          <PrivateRoute>
            <MultipleGame />
          </PrivateRoute>
        } /> */}
        <Route path="/quiz/game/:nameGame/mc/:lessonId" element={
          <PrivateRoute>
            <MultipleGame />
          </PrivateRoute>
        } />
        <Route path="/lessons/:title" element={
          <PrivateRoute>
            <LessionDetails />
          </PrivateRoute>
        } />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={["ADMIN", "TEACHER"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />           {/* /admin */}
          <Route path="dashboard" element={<AdminDashboard />} />  {/* /admin/lessons */}

          <Route path="lessons" element={<AdminLesson />} />  {/* /admin/lessons */}
          <Route path="users" element={<AdminUser />} />
          <Route path="vocabularies" element={<AdminVocabulary />} />
          <Route path="topics" element={<AdminTopic />} />
          <Route path="games" element={<AdminQuestion />} />
        </Route>



      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
