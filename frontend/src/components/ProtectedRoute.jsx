import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await axiosInstance.get("/user/profile");
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
                <div className="w-10 h-10 border-4 border-[#ff6b6b]/20 border-t-[#ff6b6b] rounded-full animate-spin" />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
