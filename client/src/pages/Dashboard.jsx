import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FiCheckCircle,
  FiClock,
  FiList,
} from "react-icons/fi";

import { getDashboardStats } from "../services/dashboard";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#22c55e",
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const workspaceId =
    localStorage.getItem("workspaceId");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data =
          await getDashboardStats(workspaceId);

        setStats(data);

      } catch (err) {
        console.error(err);
      }
    };

    if (workspaceId) {
      fetchStats();
    }
  }, [workspaceId]);

  if (!stats) {
    return (
      <div className="text-white">
        Loading dashboard...
      </div>
    );
  }

  // 🔥 HELPERS
  const getCount = (arr, key) => {
    const item = arr.find(
      (el) => el._id === key
    );

    return item ? item.count : 0;
  };

  const todo = getCount(
    stats.statusStats,
    "todo"
  );

  const inProgress = getCount(
    stats.statusStats,
    "in-progress"
  );

  const done = getCount(
    stats.statusStats,
    "done"
  );

  // 🔥 CHART DATA
  const chartData = [
    {
      name: "Todo",
      value: todo,
    },
    {
      name: "In Progress",
      value: inProgress,
    },
    {
      name: "Done",
      value: done,
    },
  ];

  // 🔥 CARD DATA
  const cards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: <FiList />,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: <FiClock />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Completed",
      value: done,
      icon: <FiCheckCircle />,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard Overview
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor workspace productivity and
          task progress
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className={`bg-gradient-to-br ${card.color}
              rounded-3xl p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-white/80">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3 text-white">
                  {card.value}
                </h2>
              </div>

              <div className="text-5xl text-white/30">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART + USERS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CHART */}
        <motion.div
          whileHover={{ y: -2 }}
          className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-semibold text-white">
                Task Analytics
              </h2>

              <p className="text-sm text-gray-400">
                Current task distribution
              </p>
            </div>
          </div>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={4}
                >
                  {chartData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* TEAM STATS */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#111827] border border-gray-800 rounded-3xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Team Performance
          </h2>

          <div className="space-y-4">

            {stats.userStats?.length > 0 ? (
              stats.userStats.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between bg-[#1f2937] rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-white">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-indigo-400 font-bold text-lg">
                    {user.count}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No task data available
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;