import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_URL } from "../utils/api";

export default function Sidebar({ username, email }) {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        try {
            await axiosInstance.get(`/user/logout`);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed");
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-[280px] bg-[#ff6b6b] text-white flex flex-col h-[calc(100vh-140px)] fixed left-0 top-[140px] z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">

            <div className="flex flex-col items-center pt-8 pb-6 mt-4 relative">
                <div className="absolute -top-[70px] w-[110px] h-[110px] rounded-full border-[6px] border-[#f5f7fb] overflow-hidden drop-shadow-xl z-50 bg-gray-900 flex items-center justify-center transform left-1/2 -translate-x-1/2">

                    <div className="text-4xl font-bold bg-gray-900 text-white w-full h-full flex items-center justify-center">
                        {username ? username.charAt(0).toUpperCase() : "U"}
                    </div>
                </div>
                <h3 className="mt-8 text-lg font-bold">{username || "User"}</h3>
            </div>


            <nav className="flex-1 px-6 space-y-2 mt-4">
                <button
                    onClick={() => navigate("/")}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-colors duration-200 font-semibold ${isActive("/") ? "bg-white text-[#ff6b6b] shadow-sm" : "text-white hover:bg-white/10"
                        }`}
                >
                    <Squares2X2Icon /> Dashboard
                </button>
                <button
                    onClick={() => navigate("/profile")}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-colors duration-200 font-semibold ${isActive("/profile") ? "bg-white text-[#ff6b6b] shadow-sm" : "text-white hover:bg-white/10"
                        }`}
                >
                    <UserIcon /> Profile
                </button>
                <button
                    onClick={() => navigate("/help")}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-colors duration-200 font-semibold ${isActive("/help") ? "bg-white text-[#ff6b6b] shadow-sm" : "text-white hover:bg-white/10"
                        }`}
                >
                    <QuestionMarkCircleIcon /> Help
                </button>
            </nav>


            <div className="px-6 mb-8">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl hover:bg-white/10 transition-colors duration-200 text-white font-semibold"
                >
                    <ArrowLeftOnRectangleIcon /> Logout
                </button>
            </div>
        </aside>
    );
}

// Icons
const Squares2X2Icon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2zM14 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2z" /></svg>
);
const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const QuestionMarkCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ArrowLeftOnRectangleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
