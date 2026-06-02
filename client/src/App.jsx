import { Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateWorkspace from "./pages/CreateWorkspace";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Projects from "./pages/Projects";
import Members from "./pages/Members";

import Chat from "./pages/Chat";

const App = () => {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/create-workspace"
        element={<CreateWorkspace />}
      />

      {/* PROTECTED LAYOUT */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/tasks" element={<Tasks />} />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route path="/members" element={<Members />} />
      </Route>

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Chat />}
        />
      </Route>

    </Routes>
  );
};

export default App;