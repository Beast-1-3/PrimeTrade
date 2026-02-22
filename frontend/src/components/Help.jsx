import React from "react";

const Help = () => {
    return (
        <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-100px)] lg:min-h-0 animate-fade-in mt-2">

            <div className="bg-white border-[1.5px] border-[#eff0f3] rounded-[24px] p-6 lg:p-10 shadow-sm relative overflow-hidden">

                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#ff6b6b]/5 to-[#ff8e8e]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>


                <div className="flex justify-between items-center mb-10 border-b-[1.5px] border-[#eff0f3] pb-6 relative z-10 text-[#ff6b6b]">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-[22px] font-bold text-gray-800 tracking-tight">Help & Support</h2>
                    </div>
                </div>


                <div className="w-full relative z-10 space-y-6">

                    <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-sm">
                        <h3 className="text-[17px] font-bold text-gray-800 mb-2">How do I create a new task?</h3>
                        <p className="text-gray-500 font-medium text-[15px] leading-[1.6]">
                            Click the <span className="text-[#ff6b6b] font-bold">+ Add task</span> button on the Home dashboard to open the creation form. You can specify a title, description, and status priority level.
                        </p>
                    </div>


                    <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-sm">
                        <h3 className="text-[17px] font-bold text-gray-800 mb-2">How do I mark a task as completed?</h3>
                        <p className="text-gray-500 font-medium text-[15px] leading-[1.6]">
                            Click the empty toggle circle on the left side of any active task to mark it as completed. The task will move into the Completed Task section automatically, and your dashboard progress rings will dynamically update.
                        </p>
                    </div>


                    <div className="bg-[#f8f9fa] border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-sm">
                        <h3 className="text-[17px] font-bold text-gray-800 mb-2">Can I restore a completed task?</h3>
                        <p className="text-gray-500 font-medium text-[15px] leading-[1.6]">
                            Yes! Find the task under the "Completed Task" section and click the green checkmark to toggle its status back to "In Progress". It will immediately be restored into your main active to-do list.
                        </p>
                    </div>


                    <div className="bg-white border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-sm mt-10">
                        <h3 className="text-[18px] font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Still need help?
                        </h3>
                        <p className="text-gray-500 font-medium text-[15px] mb-4">
                            If you encountered an unexpected error or need additional assistance with your account, please reach out to our support team directly.
                        </p>
                        <button className="bg-[#ff6b6b] text-white px-6 py-3 rounded-xl font-bold text-[14px] hover:bg-[#ff5252] transition-colors shadow-sm">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
