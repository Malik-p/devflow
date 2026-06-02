import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
    FiBriefcase,
    FiArrowRight,
} from "react-icons/fi";

import API from "../services/api";

const CreateWorkspace = () => {
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [name, setName] = useState("");

    // 🔥 CREATE WORKSPACE
    const createWorkspace = async () => {
        try {
            if (!name) {
                return alert(
                    "Workspace name required"
                );
            }

            setLoading(true);

            const res = await API.post(
                "/workspace/create",
                { name }
            );

            // 🔥 SAVE WORKSPACE
            localStorage.setItem(
                "workspaceId",
                res.data.workspace._id
            );

            navigate("/dashboard");

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">

            {/* GLOW */}
            <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-xl"
            >

                <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 shadow-2xl">

                    {/* HEADER */}
                    <div className="text-center mb-10">

                        <div className="bg-indigo-600/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5">
                            <FiBriefcase className="text-indigo-400 text-4xl" />
                        </div>

                        <h1 className="text-4xl font-bold text-white">
                            Create Workspace
                        </h1>

                        <p className="text-gray-400 mt-3">
                            Set up your company workspace
                            and start managing projects
                        </p>
                    </div>

                    {/* INPUT */}
                    <div className="mb-6">

                        <label className="text-sm text-gray-400 block mb-2">
                            Workspace Name
                        </label>

                        <input
                            type="text"
                            placeholder="Example: DevFlow Inc."
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full bg-[#1f2937] border border-gray-700 rounded-2xl p-4 text-white outline-none"
                        />
                    </div>

                    {/* BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={createWorkspace}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all rounded-2xl p-4 font-semibold flex items-center justify-center gap-2"
                    >
                        {loading
                            ? "Creating Workspace..."
                            : "Continue"}

                        {!loading && <FiArrowRight />}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateWorkspace;