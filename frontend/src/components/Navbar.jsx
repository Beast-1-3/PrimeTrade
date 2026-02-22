import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Navbar({ searchQuery, setSearchQuery, todos = [], user }) {
    const navigate = useNavigate();

    // Get current date string
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[today.getDay()];
    const currentDate = today.toLocaleDateString('en-GB'); // DD/MM/YYYY

    const location = useLocation();
    const isProfile = location.pathname === "/profile";

    const [showSuggestions, setShowSuggestions] = useState(false);
    const safeTodos = todos || [];
    const suggestions = searchQuery
        ? safeTodos.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    const handleSearchChange = (e) => {
        setSearchQuery && setSearchQuery(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (text) => {
        setSearchQuery && setSearchQuery(text);
        setShowSuggestions(false);
        if (location.pathname !== "/") {
            navigate("/");
        }
    };

    const getPageTitle = () => {
        if (location.pathname === '/profile') return { pink: 'Pro', black: 'file' };
        return { pink: 'Dash', black: 'board' };
    };

    const { pink, black } = getPageTitle();

    const getInitials = () => {
        if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
        if (user?.username) return user.username.charAt(0).toUpperCase();
        return "U";
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.get('/user/logout');
            navigate("/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-100 flex items-center px-6 fixed top-0 w-full z-[60]">

            <div
                className="flex items-center gap-2.5 cursor-pointer w-[280px] pl-4 shrink-0 transition-transform active:scale-95"
                onClick={() => navigate("/")}
            >

                <h1 className="text-[24px] font-extrabold tracking-tight">
                    <span className="text-[#ff6b6b]">{pink}</span><span className="text-gray-900">{black}</span>
                </h1>
            </div>


            <div className="flex-1 flex justify-center lg:justify-start lg:pl-10 relative">
                <div className="relative w-full max-w-2xl group">
                    <input
                        type="text"
                        placeholder="Search your task here..."
                        value={searchQuery || ""}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full pl-6 pr-20 py-2.5 bg-[#f8f9fc] border border-gray-100/80 rounded-full text-[15px] focus:bg-white focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all text-gray-700 font-medium placeholder:text-gray-400"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchQuery("");
                                setShowSuggestions(false);
                            }}
                            className="absolute right-12 top-1 bottom-1 aspect-square flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <button className="absolute right-1 top-1 bottom-1 aspect-square flex items-center justify-center bg-[#ff6b6b] text-white rounded-full hover:bg-[#fa5a5a] shadow-sm transition-colors">
                        <MagnifyingGlassIcon />
                    </button>


                    {showSuggestions && searchQuery && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
                            {suggestions.map((todo) => (
                                <div
                                    key={todo._id}
                                    onClick={() => handleSuggestionClick(todo.text)}
                                    className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#ff6b6b] transition-colors truncate pr-4">{todo.text}</span>
                                    {todo.isComplete ? (
                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded shrink-0">Done</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded shrink-0">Active</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {showSuggestions && searchQuery && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-5 z-50 text-center">
                            <span className="text-sm font-medium text-gray-500">No matching tasks found</span>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex items-center justify-end pl-4 shrink-0 gap-6">
                <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#111827] text-white font-bold text-lg hover:ring-2 hover:ring-offset-2 hover:ring-[#ff6b6b] transition-all shadow-sm">
                    {getInitials()}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 transition-colors group">
                    Logout
                    <LogoutIcon className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
                </button>
                <div className="hidden md:flex flex-col items-end border-l border-gray-200 pl-4">
                    <span className="text-sm font-bold text-gray-800">{currentDay}</span>
                    <span className="text-xs font-semibold text-blue-400">{currentDate}</span>
                </div>
            </div>
        </nav>
    );
}

const MagnifyingGlassIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
