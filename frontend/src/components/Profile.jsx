import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { API_URL } from "../utils/api";
import { validateUsername } from "../utils/validation";

export default function Profile() {
    const queryClient = useQueryClient();

    const { data: userData, isLoading: loading, isError } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/user/profile`);
            return response.data.user;
        }
    });

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // Keep local visual state in sync when user data loads
    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || (userData.username ? userData.username.split(" ")[0] : ""));
            setLastName(userData.lastName || (userData.username && userData.username.split(" ").length > 1 ? userData.username.split(" ").slice(1).join(" ") : ""));
        }
    }, [userData]);

    const updateProfileMutation = useMutation({
        mutationFn: async (newProfile) => {
            const response = await axiosInstance.put(`/user/profile`, newProfile);
            return response.data.user;
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["profile"], updatedUser);
            setSuccess("Profile updated successfully!");
            setEditing(false);
        },
        onError: (err) => {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update profile");
            }
        }
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const fNameErr = !firstName.trim() ? "First name required" : "";
        if (fNameErr) {
            setFieldErrors({ firstName: fNameErr });
            return;
        }

        updateProfileMutation.mutate({ firstName, lastName });
    };

    const user = userData;
    const saving = updateProfileMutation.isPending;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-[#ff6b6b]/20 border-t-[#ff6b6b] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in mt-2 flex flex-col min-h-[calc(100vh-100px)] lg:min-h-0">

            <div className="bg-white border-[1.5px] border-[#eff0f3] rounded-[24px] p-6 lg:p-10 shadow-sm relative overflow-hidden">

                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#ff6b6b]/5 to-[#ff8e8e]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>


                <div className="flex justify-between items-center mb-10 border-b-[1.5px] border-[#eff0f3] pb-6 relative z-10 text-[#ff6b6b]">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-[22px] font-bold text-gray-800 tracking-tight">Account Information</h2>
                    </div>
                </div>


                <div className="flex items-center gap-6 mb-10 bg-[#f8f9fa] rounded-[20px] p-6 lg:p-8 border-[1.5px] border-[#eff0f3] relative z-10 w-full">
                    <div className="w-[100px] h-[100px] rounded-full border-[4px] border-white shadow-sm flex bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] justify-center items-center text-white text-[36px] font-bold relative overflow-hidden shrink-0">
                        {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-[28px] font-bold text-gray-800 mb-1 leading-tight">{user?.username}</h3>
                        <p className="text-[16px] text-gray-500 font-medium">{user?.email}</p>

                        {!editing && (
                            <div className="mt-4">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[13px] border border-emerald-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                                    Active Account
                                </span>
                            </div>
                        )}
                    </div>
                </div>


                <div className="w-full relative z-10">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 shadow-sm">
                            <span className="text-red-500">⚠️</span>
                            <p className="text-red-600 text-[15px] font-semibold">{error}</p>
                        </div>
                    )}
                    {isError && !error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 shadow-sm">
                            <span className="text-red-500">⚠️</span>
                            <p className="text-red-600 text-[15px] font-semibold">Failed to load profile details.</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 shadow-sm">
                            <span className="text-emerald-500">✓</span>
                            <p className="text-emerald-600 text-[15px] font-semibold">{success}</p>
                        </div>
                    )}

                    {editing ? (
                        <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[14px] font-bold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border-[1.5px] border-[#eff0f3] rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b] bg-white text-gray-800 font-semibold transition-all shadow-sm"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-bold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border-[1.5px] border-[#eff0f3] rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b] bg-white text-gray-800 font-semibold transition-all shadow-sm"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>

                            {fieldErrors.firstName && <p className="text-[#ef4444] text-[14px] font-semibold mt-[-8px]">{fieldErrors.firstName}</p>}

                            <div>
                                <label className="block text-[14px] font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full border-[1.5px] border-[#eff0f3] rounded-xl px-4 py-3.5 text-[15px] bg-[#f8f9fa] text-gray-400 font-semibold cursor-not-allowed"
                                />
                                <p className="text-[13px] text-gray-400 font-medium mt-2">Email address cannot be changed.</p>
                            </div>

                            <div className="pt-8 flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#ff6b6b] text-white px-8 py-3 rounded-xl font-bold text-[15px] hover:bg-[#ff5252] transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        if (user) {
                                            setFirstName(user.firstName || (user.username ? user.username.split(" ")[0] : ""));
                                            setLastName(user.lastName || (user.username && user.username.split(" ").length > 1 ? user.username.split(" ").slice(1).join(" ") : ""));
                                        }
                                        setFieldErrors({});
                                        setError("");
                                    }}
                                    className="bg-white border-[1.5px] border-[#eff0f3] text-gray-600 px-8 py-3 rounded-xl font-bold text-[15px] hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-5 flex flex-col justify-center shadow-sm">
                                    <label className="block text-[12px] font-bold text-[#ff6b6b] uppercase tracking-wider mb-1.5 opacity-80">First Name</label>
                                    <p className="text-gray-800 font-bold text-[17px]">{user?.firstName || (user?.username ? user.username.split(" ")[0] : "")}</p>
                                </div>
                                <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-5 flex flex-col justify-center shadow-sm">
                                    <label className="block text-[12px] font-bold text-[#ff6b6b] uppercase tracking-wider mb-1.5 opacity-80">Last Name</label>
                                    <p className="text-gray-800 font-bold text-[17px]">{user?.lastName || (user?.username && user.username.split(" ").length > 1 ? user.username.split(" ").slice(1).join(" ") : "")}</p>
                                </div>
                            </div>
                            <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-5 flex flex-col justify-center shadow-sm">
                                <label className="block text-[12px] font-bold text-[#ff6b6b] uppercase tracking-wider mb-1.5 opacity-80">Email Address</label>
                                <p className="text-gray-800 font-bold text-[17px]">{user?.email}</p>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-white border-[1.5px] border-[#eff0f3] text-gray-800 px-8 py-3 rounded-xl font-bold text-[15px] hover:border-[#ff6b6b] hover:text-[#ff6b6b] transition-colors shadow-sm"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
