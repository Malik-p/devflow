import API from "./api";

export const getDashboardStats = async (workspaceId) => {
  const res = await API.get(`/tasks/${workspaceId}/stats`);
  return res.data;
};
