import Hero from "./Components/Hero";
import Student from "./Components/Student";
import { Routes, Route } from "react-router-dom";
import Purchase from "./Components/Purchase";
import VpnRequest from "./Components/VpnRequest";
import WifiRequest from "./Components/WifiRequest";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import StudentCard from "./Components/StudentCard";
import ThesisView from "./Components/ThesisView";
import SignForm from "./Components/SignForm";
import Modal from "./Components/Modal";
import VpnForm from "./Components/VpnForm";
import Events from "./Components/Events";
import AddEvent from "./Components/AddEvent";
import ImageUpload from "./Components/ImageUpload";
import Messages from "./Components/Messages";
import SeeImages from "./Components/SeeImages";
import CompStd from "./Components/CompStd";
import ExpiredCard from "./Components/ExpiredCard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Hero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Student"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CompStd"
          element={
            <ProtectedRoute>
              <CompStd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ExpiredCard"
          element={
            <ProtectedRoute>
              <ExpiredCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thesis"
          element={
            <ProtectedRoute>
              <ThesisView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentCard/:cnic"
          element={
            <ProtectedRoute>
              <StudentCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SignForm/:cnic"
          element={
            <ProtectedRoute>
              <SignForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/VpnForm/:cnic"
          element={
            <ProtectedRoute>
              <VpnForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Update/:cnic"
          element={
            <ProtectedRoute>
              <Modal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Purchase"
          element={
            <ProtectedRoute>
              <Purchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/VpnRequest"
          element={
            <ProtectedRoute>
              <VpnRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/WifiRequest"
          element={
            <ProtectedRoute>
              <WifiRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Images"
          element={
            <ProtectedRoute>
              <SeeImages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddEvent"
          element={
            <ProtectedRoute>
              <AddEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Imageupload"
          element={
            <ProtectedRoute>
              <ImageUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Message"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="*"
          element={<h1>404! Page Not Found. Check Page Name.</h1>}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
