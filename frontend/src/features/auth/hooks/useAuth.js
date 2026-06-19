import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe} from "../services/auth.api"


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading, isAuthenticated, setIsAuthenticated } = context;
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password}) => {
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetMe = async () => {
        setLoading(true);
        try {
            const data = await getMe();
            setUser(data);
            if (data) setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { user, setUser, loading, setLoading, isAuthenticated, setIsAuthenticated, handleLogin, handleRegister, handleLogout, handleGetMe };
};