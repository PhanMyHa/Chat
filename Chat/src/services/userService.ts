import axios from "../lib/axios";

export const userService = {
  getAllUsers: async (filters?: any) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get(`/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await axios.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },
};
