import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

// Auth APIs

export const register = async ({ email, password, username }) => {
    try {
        const { data } = await api.post("/auth/register", {
            email,
            password,
            username,
        });
        return data;
    } catch (error) {
        console.error("Register Error:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};

export const login = async ({ email, password }) => {
    try {
        const { data } = await api.post("/auth/login", {
            email,
            password,
        });
        return data;
    } catch (error) {
        console.error("Login Error:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};

export const logout = async () => {
    try {
        const { data } = await api.post("/auth/logout");
        return data;
    } catch (error) {
        console.error("Logout Error:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};

export const getMe = async () => {
    try {
        const { data } = await api.get("/auth/get-me");
        return data;
    } catch (error) {
        console.error("GetMe Error:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};