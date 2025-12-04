import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { ProtectedRoute } from "./component/ProtectedRoute";
import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLesson from "./pages/admin/AdminLesson";
import AdminQuestion from "./pages/admin/AdminQuestion";
import AdminTopic from "./pages/admin/AdminTopic";
import AdminUser from "./pages/admin/AdminUser";
import AdminVocabulary from "./pages/admin/AdminVocabulary";
import ArrangeSentence from "./pages/ArrangeSentence";
import AvatarSetup from "./pages/AvatarSetup";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Game from "./pages/Game";
import Home from "./pages/Home";
import LessionDetails from "./pages/LessonDetails";
import Lessons from "./pages/Lessons";
import LessonVideo from "./pages/LessonVideo";
import Login from "./pages/Login";
import MultipleGame from "./pages/MultipleGame";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

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
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <Lessons />
            </ProtectedRoute>
          }
        />

        <Route path="" element={<Home />} />
        <Route
          path="/avatar-setup"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <AvatarSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/:lessonId"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons-video/:slug"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <LessonVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/game/:nameGame/as/:lessonId"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <ArrangeSentence />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/quiz/game/:gameId/topic/:topicId" element={
          <ProtectedRoute requiredRole={["USER"]}>
            <MultipleGame />
          </ProtectedRoute requiredRole={["USER"]}>
        } /> */}
        <Route
          path="/quiz/game/:nameGame/mc/:lessonId"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <MultipleGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:title"
          element={
            <ProtectedRoute requiredRole={["USER"]}>
              <LessionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> {/* /admin */}
          <Route path="dashboard" element={<AdminDashboard />} />{" "}
          {/* /admin/lessons */}
          <Route path="lessons" element={<AdminLesson />} />{" "}
          {/* /admin/lessons */}
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
