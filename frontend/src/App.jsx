import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Help from "./components/Help.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Dashboard layout with nested protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
