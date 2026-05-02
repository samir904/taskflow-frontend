import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./features/auth/authSlice";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

function App() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token]);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;