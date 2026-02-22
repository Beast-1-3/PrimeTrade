import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: user } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await axiosInstance.get(`/user/profile`);
            return res.data.user;
        }
    });

    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex pt-[80px]">
                <Sidebar username={user?.username} email={user?.email} />
                <main className="flex-1 ml-[280px] p-8 min-h-[calc(100vh-80px)] animate-fade-in relative z-10">
                    <Outlet context={{ username: user?.username, searchQuery, setSearchQuery }} />
                </main>
            </div>
        </div>
    );
}
