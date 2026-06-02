import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
    FiHome,
    FiFolder,
    FiCheckSquare,
    FiLogOut,
    FiUsers,
    FiMessageSquare
} from "react-icons/fi";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path;

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const role = localStorage.getItem("role");

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FiHome />,
        },

        ...(role !== "member"
            ? [
                {
                    name: "Projects",
                    path: "/projects",
                    icon: <FiFolder />,
                },
                {
                    name: "Members",
                    path: "/members",
                    icon: <FiUsers />,
                },
            ]
            : []),

        {
            name: "Tasks",
            path: "/tasks",
            icon: <FiCheckSquare />,
        },

        // 🔥 CHAT
        {
            name: "Chat",
            path: "/chat",
            icon: <FiMessageSquare />,
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white">

            {/* SIDEBAR */}
            <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-72 bg-[#111827] border-r border-gray-800 flex flex-col justify-between p-6"
            >
                <div>

                    {/* LOGO */}
                    <div
                        onClick={() => navigate("/dashboard")}
                        className="cursor-pointer mb-10"
                    >
                        <h1 className="text-3xl font-bold text-indigo-400">
                            DevFlow
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Team Management SaaS
                        </p>
                    </div>

                    {/* NAVIGATION */}
                    <div className="space-y-3">

                        {navItems.map((item) => (
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                  
                  ${isActive(item.path)
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "hover:bg-gray-800 text-gray-300"
                                    }
                `}
                            >
                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                <span className="font-medium">
                                    {item.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-gray-800 pt-5">

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </motion.div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <div className="h-20 border-b border-gray-800 bg-[#111827]/70 backdrop-blur-md px-8 flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-semibold">
                            Workspace Dashboard
                        </h2>

                        <p className="text-sm text-gray-400">
                            Manage projects, tasks and realtime collaboration
                        </p>
                    </div>

                    {/* USER */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                            A
                        </div>

                        <div>
                            <p className="font-medium">
                                Admin
                            </p>

                            <p className="text-xs text-gray-400">
                                Workspace Owner
                            </p>
                        </div>
                    </div>
                </div>

                {/* PAGE CONTENT */}
                <div className="flex-1 p-8 bg-[#0f172a] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;