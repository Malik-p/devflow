import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";

import API from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // 🔥 LOGIN
            const res = await API.post(
                "/auth/login",
                form
            );

            // 🔥 STORE AUTH DATA
            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            localStorage.setItem(
                "role",
                res.data.role
            );

            // 🔥 FETCH USER WORKSPACE
            try {

                const workspaceRes = await API.get(
                    "/workspace/my-workspace"
                );

                // 🔥 STORE WORKSPACE
                localStorage.setItem(
                    "workspaceId",
                    workspaceRes.data._id
                );

                navigate("/dashboard");

            } catch (err) {

                // 🔥 NO WORKSPACE YET
                console.log(err);
                navigate("/create-workspace");
            }

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">

            {/* BACKGROUND GLOW */}
            <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md"
            >
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl"
                >

                    {/* HEADER */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white">
                            DevFlow
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Welcome back to your workspace
                        </p>
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-400 block mb-2">
                            Email
                        </label>

                        <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-xl px-4">
                            <FiMail className="text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none p-3 text-white"
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 block mb-2">
                            Password
                        </label>

                        <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-xl px-4">
                            <FiLock className="text-gray-400" />

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none p-3 text-white"
                            />
                        </div>
                    </div>

                    {/* BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl p-3 font-semibold"
                    >
                        {loading ? "Signing In..." : "Login"}
                    </motion.button>

                    {/* FOOTER */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don&apos;t have an account?{" "}

                        <span
                            onClick={() => navigate("/register")}
                            className="text-indigo-400 cursor-pointer hover:text-indigo-300"
                        >
                            Register
                        </span>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;