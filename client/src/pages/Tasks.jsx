import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    FiPlus,
    FiClipboard,
    FiCalendar,
} from "react-icons/fi";

import API from "../services/api";

const statusColors = {
    todo: "bg-gray-500/20 text-gray-300",
    "in-progress":
        "bg-yellow-500/20 text-yellow-300",
    done: "bg-green-500/20 text-green-300",
};

const priorityColors = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-red-400",
};

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "medium",
    });

    const workspaceId =
        localStorage.getItem("workspaceId");

    const role = localStorage.getItem("role");

    // 🔥 FETCH TASKS
    const fetchTasks = async () => {
        try {
            const res = await API.get(
                `/tasks/${workspaceId}`
            );

            setTasks(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 FETCH PROJECTS
    const fetchProjects = async () => {
        try {
            const res = await API.get(
                `/projects/${workspaceId}`
            );

            setProjects(res.data);

            if (res.data.length > 0) {
                setForm((prev) => ({
                    ...prev,
                    projectId: res.data[0]._id,
                }));
            }

        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 FETCH MEMBERS
    const fetchMembers = async () => {
        try {
            const res = await API.get(
                `/workspace/${workspaceId}`
            );

            setMembers(res.data.members);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (workspaceId) {

            fetchTasks();
            fetchProjects();
            fetchMembers();
        }
    }, [workspaceId]);

    // 🔥 HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 🔥 CREATE TASK
    const createTask = async () => {
        try {
            if (!form.title) {
                return alert("Title required");
            }

            if (!form.projectId) {
                return alert("Select project");
            }

            await API.post(
                `/tasks/${workspaceId}`,
                form
            );

            setForm({
                title: "",
                description: "",
                projectId: form.projectId,
                priority: "medium",
            });

            fetchTasks();

        } catch (err) {
            console.log(err.response?.data);
        }
    };

    // 🔥 UPDATE STATUS
    const updateStatus = async (
        taskId,
        status
    ) => {
        try {
            await API.put(
                `/tasks/${taskId}/status`,
                { status }
            );

            fetchTasks();

        } catch (err) {
            console.error(err);
        }
    };

    if (!workspaceId) {
        return (
            <p className="text-red-400">
                No workspace found
            </p>
        );
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Task Management
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Organize and track workspace tasks
                    </p>
                </div>
            </div>

            {/* CREATE TASK */}
            {role !== "member" && (
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
                >

                    <div className="flex items-center gap-3 mb-6">

                        <div className="bg-indigo-600 p-3 rounded-2xl">
                            <FiPlus />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Create New Task
                            </h2>

                            <p className="text-sm text-gray-400">
                                Assign and manage tasks
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* PROJECT */}
                        <select
                            name="projectId"
                            value={form.projectId}
                            onChange={handleChange}
                            className="bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        >
                            {projects.map((proj) => (
                                <option
                                    key={proj._id}
                                    value={proj._id}
                                >
                                    {proj.name}
                                </option>
                            ))}
                        </select>

                        {/* PRIORITY */}
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        >
                            <option value="low">
                                Low Priority
                            </option>

                            <option value="medium">
                                Medium Priority
                            </option>

                            <option value="high">
                                High Priority
                            </option>
                        </select>

                        {/* ASSIGN MEMBER */}
                        <select
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            className="bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        >
                            <option value="">
                                Assign Member
                            </option>

                            {members.map((member) => (
                                <option
                                    key={member.userId?._id}
                                    value={member.userId?._id}
                                >
                                    {member.userId?.name}
                                </option>
                            ))}
                        </select>

                        {/* TITLE */}
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Task title"
                            className="bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        />

                        {/* DESCRIPTION */}
                        <input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Task description"
                            className="bg-[#1f2937] border border-gray-700 rounded-xl p-3 text-white outline-none"
                        />
                    </div>

                    {/* BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={createTask}
                        className="mt-5 bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-3 rounded-xl font-semibold"
                    >
                        Create Task
                    </motion.button>
                </motion.div>
            )}

            {/* TASK LIST */}
            <div>

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-indigo-600 p-3 rounded-2xl">
                        <FiClipboard />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Workspace Tasks
                        </h2>

                        <p className="text-sm text-gray-400">
                            Current active tasks
                        </p>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center">
                        <p className="text-gray-400">
                            No tasks available
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                whileHover={{ y: -3 }}
                                className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
                            >

                                {/* TOP */}
                                <div className="flex items-start justify-between mb-5">

                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {task.title}
                                        </h3>

                                        <p className="text-gray-400 mt-2 text-sm">
                                            {task.description}
                                        </p>
                                    </div>

                                    {/* STATUS */}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${statusColors[task.status]}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                {/* PROJECT + PRIORITY */}
                                <div className="flex items-center justify-between mb-5">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Project
                                        </p>

                                        <p className="text-sm text-white font-medium">
                                            {task.projectId?.name ||
                                                "No Project"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Priority
                                        </p>

                                        <p
                                            className={`text-sm font-semibold capitalize
                      ${priorityColors[task.priority]}`}
                                        >
                                            {task.priority}
                                        </p>
                                    </div>
                                </div>

                                {/* ASSIGNED USER */}
                                <div className="mb-5">
                                    <p className="text-xs text-gray-500">
                                        Assigned To
                                    </p>

                                    <p className="text-sm text-indigo-400 font-medium">
                                        {task.assignedTo?.name ||
                                            "Unassigned"}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <FiCalendar />

                                        <span>
                                            {new Date(
                                                task.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* STATUS UPDATE */}
                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                task._id,
                                                e.target.value
                                            )
                                        }
                                        className="bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                                    >
                                        <option value="todo">
                                            Todo
                                        </option>

                                        <option value="in-progress">
                                            In Progress
                                        </option>

                                        <option value="done">
                                            Done
                                        </option>
                                    </select>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;