export default function SearchFilter({ searchQuery, setSearchQuery, filter, setFilter }) {
    const filters = [
        { label: "All", value: "all", icon: "📋" },
        { label: "Active", value: "active", icon: "🔄" },
        { label: "Completed", value: "completed", icon: "✅" },
    ];

    return (
        <div className="mb-5 space-y-3">
            {/* Search bar */}
            <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">🔍</span>
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-premium pl-10 pr-10"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 bg-gray-50 rounded-lg p-1">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${filter === f.value
                                ? "bg-white text-brand-700 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <span className="mr-1">{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
