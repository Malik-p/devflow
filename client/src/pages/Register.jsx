import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
    FiUser,
    FiMail,
    FiLock,
} from "react-icons/fi";

import API from "../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
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

            await API.post(
                "/auth/register",
                form
            );

            alert("Registered successfully");

            navigate("/");

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Registration failed"
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
                            Create Account
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Start managing your workspace
                        </p>
                    </div>

                    {/* NAME */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-400 block mb-2">
                            Full Name
                        </label>

                        <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-xl px-4">
                            <FiUser className="text-gray-400" />

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none p-3 text-white"
                            />
                        </div>
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
                                placeholder="Create password"
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl p-3 font-semibold text-white"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </motion.button>

                    {/* FOOTER */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{" "}

                        <span
                            onClick={() => navigate("/")}
                            className="text-indigo-400 cursor-pointer hover:text-indigo-300"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;