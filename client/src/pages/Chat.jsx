import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    motion,
} from "framer-motion";

import API from "../services/api";

import socket from "../socket";

const Chat = () => {

    const [messages, setMessages] =
        useState([]);

    const [text, setText] =
        useState("");

    // 🔥 ONLINE USERS
    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const messagesEndRef =
        useRef(null);

    const workspaceId =
        localStorage.getItem(
            "workspaceId"
        );

    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            )
        );

    // 🔥 FETCH OLD MESSAGES
    const fetchMessages =
        async () => {

            try {

                const res =
                    await API.get(
                        `/messages/${workspaceId}`
                    );

                setMessages(
                    res.data
                );

            } catch (err) {

                console.error(err);
            }
        };

    // 🔥 SOCKET CONNECTION
    useEffect(() => {

        if (!workspaceId) return;

        fetchMessages();

        // 🔥 JOIN WORKSPACE
        socket.emit(
            "joinWorkspace",
            {
                workspaceId,
                userId: user._id,
            }
        );

        // 🔥 ONLINE USERS
        socket.on(
            "onlineUsers",
            (users) => {

                setOnlineUsers(users);
            }
        );

        // 🔥 RECEIVE MESSAGE
        socket.on(
            "receiveMessage",
            (message) => {

                setMessages(
                    (prev) => [
                        ...prev,
                        message,
                    ]
                );
            }
        );

        return () => {

            socket.off(
                "receiveMessage"
            );

            socket.off(
                "onlineUsers"
            );
        };

    }, [workspaceId]);

    // 🔥 AUTO SCROLL
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    // 🔥 SEND MESSAGE
    const sendMessage =
        async () => {

            if (!text.trim()) return;

            try {

                // 🔥 SAVE MESSAGE
                const res =
                    await API.post(
                        `/messages/${workspaceId}`,
                        { text }
                    );

                // 🔥 REALTIME EMIT
                socket.emit(
                    "sendMessage",
                    {
                        workspaceId,
                        ...res.data,
                    }
                );

                setText("");

            } catch (err) {

                console.error(err);
            }
        };

    // 🔥 ENTER KEY SEND
    const handleKeyDown =
        (e) => {

            if (e.key === "Enter") {
                sendMessage();
            }
        };

    return (
        <div className="h-[85vh] flex flex-col">

            {/* HEADER */}
            <div className="mb-5">

                <h1 className="text-3xl font-bold text-white">
                    Workspace Chat
                </h1>

                {/* SUBHEADER */}
                <div className="flex items-center gap-3 mt-2">

                    <p className="text-gray-400">
                        Realtime team collaboration
                    </p>

                    {/* ONLINE USERS */}
                    <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-3 py-1 rounded-full">

                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>

                        <p className="text-xs text-green-400">
                            {onlineUsers.length} online
                        </p>
                    </div>
                </div>
            </div>

            {/* CHAT BOX */}
            <div className="flex-1 overflow-y-auto bg-[#111827] border border-gray-800 rounded-3xl p-5 space-y-5">

                {messages.map(
                    (msg, index) => {

                        const isMe =
                            msg.sender?._id ===
                            user?._id;

                        return (

                            <div
                                key={index}
                                className={`flex ${isMe
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}

                                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${isMe
                                        ? "bg-indigo-600 text-white"
                                        : "bg-[#1f2937] text-gray-200"
                                        }`}
                                >

                                    {/* SENDER */}
                                    {!isMe && (
                                        <p className="text-xs text-indigo-400 mb-1 font-medium">
                                            {
                                                msg.sender
                                                    ?.name
                                            }
                                        </p>
                                    )}

                                    {/* MESSAGE */}
                                    <p className="leading-relaxed">
                                        {msg.text}
                                    </p>

                                    {/* TIME */}
                                    <p className="text-[10px] text-gray-300 mt-2 text-right">
                                        {new Date(
                                            msg.createdAt
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </motion.div>
                            </div>
                        );
                    }
                )}

                {/* AUTO SCROLL */}
                <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="mt-5 flex gap-3">

                <input
                    type="text"
                    placeholder="Type message..."
                    value={text}
                    onChange={(e) =>
                        setText(
                            e.target.value
                        )
                    }

                    onKeyDown={
                        handleKeyDown
                    }

                    className="flex-1 bg-[#111827] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                />

                <motion.button
                    whileHover={{
                        scale: 1.03,
                    }}

                    whileTap={{
                        scale: 0.97,
                    }}

                    onClick={sendMessage}

                    className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-2xl font-semibold shadow-lg transition-all"
                >
                    Send
                </motion.button>
            </div>
        </div>
    );
};

export default Chat;