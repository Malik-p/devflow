import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    FiFolderPlus,
    FiFolder,
} from "react-icons/fi";

import API from "../services/api";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");

    const workspaceId =
        localStorage.getItem("workspaceId");

    const role = localStorage.getItem("role");

    // 🔥 FETCH PROJECTS
    const fetchProjects = async () => {
        try {
            const res = await API.get(
                `/projects/${workspaceId}`
            );

            setProjects(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (workspaceId) {
            fetchProjects();
        }
    }, [workspaceId]);

    // 🔥 CREATE PROJECT
    const createProject = async () => {
        try {
            if (!name) {
                return alert("Project name required");
            }

            await API.post(
                `/projects/${workspaceId}`,
                { name }
            );

            setName("");

            fetchProjects();

        } catch (err) {
            alert(
                err.response?.data?.message
            );
        }
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Projects
                </h1>

                <p className="text-gray-400 mt-2">
                    Organize workspace projects efficiently
                </p>
            </div>

            {/* CREATE PROJECT */}
            {role !== "member" && (
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
                >

                    <div className="flex items-center gap-3 mb-6">

                        <div className="bg-indigo-600 p-3 rounded-2xl">
                            <FiFolderPlus />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Create Project
                            </h2>

                            <p className="text-sm text-gray-400">
                                Start managing a new project
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">

                        <input
                            type="text"
                            placeholder="Enter project name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="flex-1 bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={createProject}
                            className="bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-3 rounded-xl font-semibold"
                        >
                            Create
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* PROJECTS LIST */}
            <div>

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-indigo-600 p-3 rounded-2xl">
                        <FiFolder />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Workspace Projects
                        </h2>

                        <p className="text-sm text-gray-400">
                            Current active projects
                        </p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center">
                        <p className="text-gray-400">
                            No projects available
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {projects.map((project) => (
                            <motion.div
                                key={project._id}
                                whileHover={{ y: -3 }}
                                className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
                            >

                                <div className="flex items-center justify-between mb-5">

                                    <div className="bg-indigo-600/20 p-4 rounded-2xl">
                                        <FiFolder className="text-indigo-400 text-2xl" />
                                    </div>

                                    <span className="text-xs text-gray-500">
                                        {new Date(
                                            project.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-white">
                                    {project.name}
                                </h3>

                                <p className="text-gray-400 text-sm mt-2">
                                    Workspace project management
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;