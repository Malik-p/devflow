import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    FiUsers,
    FiUserPlus,
} from "react-icons/fi";

import API from "../services/api";

const Members = () => {
    const [members, setMembers] = useState([]);

    const [form, setForm] = useState({
        email: "",
        role: "member",
    });

    const workspaceId =
        localStorage.getItem("workspaceId");

    // 🔥 FETCH MEMBERS
    const fetchMembers = async () => {
        try {

            const res = await API.get(
                `/workspace/${workspaceId}`
            );

            // ✅ CORRECT RESPONSE
            setMembers(
                res.data.members || []
            );

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (workspaceId) {
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

    // 🔥 ADD MEMBER
    const addMember = async () => {
        try {

            if (!form.email) {
                return alert("Email required");
            }

            const res = await API.post(
                `/workspace/${workspaceId}/add-member`,
                form
            );

            // ✅ INSTANT UI UPDATE
            setMembers(
                res.data.workspace.members
            );

            // ✅ RESET FORM
            setForm({
                email: "",
                role: "member",
            });

            alert("Member added successfully");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to add member"
            );
        }
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Workspace Members
                </h1>

                <p className="text-gray-400 mt-2">
                    Manage team members and roles
                </p>
            </div>

            {/* ADD MEMBER */}
            <motion.div
                whileHover={{ y: -2 }}
                className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
            >

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-indigo-600 p-3 rounded-2xl">
                        <FiUserPlus />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Add Member
                        </h2>

                        <p className="text-sm text-gray-400">
                            Invite members to workspace
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* EMAIL */}
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter member email"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-[#1f2937] border border-gray-700 rounded-2xl p-4 text-white outline-none"
                    />

                    {/* ROLE */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="bg-[#1f2937] border border-gray-700 rounded-2xl p-4 text-white outline-none"
                    >
                        <option value="member">
                            Member
                        </option>

                        <option value="admin">
                            Admin
                        </option>
                    </select>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addMember}
                    className="mt-5 bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-3 rounded-2xl font-semibold"
                >
                    Add Member
                </motion.button>
            </motion.div>

            {/* MEMBERS LIST */}
            <div>

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-indigo-600 p-3 rounded-2xl">
                        <FiUsers />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Team Members
                        </h2>

                        <p className="text-sm text-gray-400">
                            Current workspace users
                        </p>
                    </div>
                </div>

                {members.length === 0 ? (
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-10 text-center">
                        <p className="text-gray-400">
                            No members found
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {members.map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -3 }}
                                className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
                            >

                                {/* AVATAR */}
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold mb-5">
                                    {member.userId?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                </div>

                                {/* NAME */}
                                <h3 className="text-xl font-semibold text-white">
                                    {member.userId?.name ||
                                        "Unknown User"}
                                </h3>

                                {/* EMAIL */}
                                <p className="text-gray-400 text-sm mt-2">
                                    {member.userId?.email}
                                </p>

                                {/* ROLE */}
                                <div className="mt-5 inline-block bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm capitalize">
                                    {member.role}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Members;