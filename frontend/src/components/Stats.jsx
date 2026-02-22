export default function Stats({ todos }) {
    const total = todos.length;
    const completed = todos.filter((t) => t.isComplete).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats = [
        {
            label: "Total Tasks",
            value: total,
            icon: "📝",
            gradient: "from-blue-500 to-blue-600",
            bgLight: "bg-blue-50",
            textColor: "text-blue-700",
        },
        {
            label: "In Progress",
            value: active,
            icon: "🔄",
            gradient: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50",
            textColor: "text-amber-700",
        },
        {
            label: "Completed",
            value: completed,
            icon: "✅",
            gradient: "from-emerald-500 to-green-600",
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-700",
        },
        {
            label: "Progress",
            value: `${percentage}%`,
            icon: "📊",
            gradient: "from-purple-500 to-violet-600",
            bgLight: "bg-purple-50",
            textColor: "text-purple-700",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in">
            {stats.map((stat, index) => (
                <div
                    key={stat.label}
                    className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />

                    <div className="flex flex-col items-center text-center">
                        <span className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                        <span className={`text-3xl font-extrabold ${stat.textColor}`}>{stat.value}</span>
                        <span className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</span>
                    </div>

                    {/* Progress bar for the Progress card */}
                    {stat.label === "Progress" && (
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-700 ease-out`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
