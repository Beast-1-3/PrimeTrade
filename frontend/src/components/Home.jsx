import { useState, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useOutletContext } from "react-router-dom";
import { API_URL } from "../utils/api";

function Home() {
  const { username, searchQuery } = useOutletContext();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Moderate");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loading,
    isError: fetchError
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/todo?page=${pageParam}&limit=10`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1
  });

  const todos = useMemo(() => {
    return data ? data.pages.flatMap(page => page.todoList) : [];
  }, [data]);

  const createTodoMutation = useMutation({
    mutationFn: async (newTodoPayload) => {
      const response = await axiosInstance.post(`/todo`, newTodoPayload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodo("");
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("Moderate");
      setShowAddModal(false);
    },
    onError: () => setError("Failed to create Todo check console")
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, updatedFields }) => {
      const response = await axiosInstance.put(`/todo/${id}`, updatedFields);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    onError: () => setError("Failed to update todo status")
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => await axiosInstance.delete(`/todo/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setSelectedTodo(null);
    },
    onError: () => setError("Failed to delete Todo")
  });

  const createTodo = (titleToUse) => {
    const textToSave = titleToUse || newTodo;
    if (!textToSave.trim()) return;
    createTodoMutation.mutate({
      text: textToSave,
      description: newTaskDesc,
      priority: newTaskPriority
    });
  };

  const updateTodoStatus = (id, currentStatus) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) updateTodoMutation.mutate({ id, updatedFields: { ...todo, isComplete: !currentStatus } });
  };

  const deleteTodo = (id) => deleteTodoMutation.mutate(id);

  const { activeTodos, completedTodos, totalTodos } = useMemo(() => {
    const filtered = todos.filter(t => t?.text?.toLowerCase().includes((searchQuery || "").toLowerCase()));
    const active = filtered.filter(t => !t.isComplete);
    const completed = filtered.filter(t => t.isComplete);
    return { activeTodos: active, completedTodos: completed, totalTodos: filtered.length };
  }, [todos, searchQuery]);

  const completedPct = totalTodos ? Math.round((completedTodos.length / totalTodos) * 100) : 0;
  const activePct = totalTodos ? Math.round((activeTodos.length / totalTodos) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-10 h-10 border-4 border-[#ff6b6b]/20 border-t-[#ff6b6b] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome back, {username} <span className="inline-block  ml-2">👋</span>
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-[#ff6b6b] text-[#ff6b6b] font-semibold rounded-full hover:bg-[#ff6b6b] hover:text-white transition-colors duration-200"
        >
          <PlusIcon /> Add task
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl w-[90%] max-w-2xl relative z-10 shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Add New Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Go Back
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 overflow-y-auto">
              {/* Title Input */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
                />
              </div>


              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b] bg-white text-gray-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Priority Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Priority</label>
                <div className="flex items-center gap-6">
                  {/* Extreme */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Extreme</span>
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 border-gray-300 rounded-sm text-brand-500 focus:ring-0 ml-1 cursor-pointer"
                      checked={newTaskPriority === "Extreme"}
                      onChange={() => setNewTaskPriority("Extreme")}
                    />
                  </label>

                  {/* Moderate */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Moderate</span>
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 border-gray-300 rounded-sm text-brand-500 focus:ring-0 ml-1 cursor-pointer"
                      checked={newTaskPriority === "Moderate"}
                      onChange={() => setNewTaskPriority("Moderate")}
                    />
                  </label>

                  {/* Low */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Low</span>
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 border-gray-300 rounded-sm text-brand-500 focus:ring-0 ml-1 cursor-pointer"
                      checked={newTaskPriority === "Low"}
                      onChange={() => setNewTaskPriority("Low")}
                    />
                  </label>
                </div>
              </div>

              {/* Task Description */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Task Description</label>
                <textarea
                  rows="4"
                  placeholder="Start writing here...."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 resize-none font-medium placeholder:text-gray-300 placeholder:font-normal"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8 pt-2">
              <button
                onClick={() => createTodo(newTaskTitle)}
                className="bg-[#ff6b6b] text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#ff5252] transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Box */}
      {selectedTodo ? (
        <div className="bg-white border-[1.5px] border-[#eff0f3] rounded-[24px] p-8 mt-2 shadow-sm animate-fade-in relative flex flex-col min-h-[500px]">
          <button
            onClick={() => setSelectedTodo(null)}
            className="absolute top-8 right-10 text-[14px] font-bold text-gray-800 hover:text-[#ff6b6b] transition-colors"
            style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Go Back
          </button>

          <div className="flex flex-col gap-5 mb-8 mt-2">
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight pr-24">{selectedTodo.text}</h2>

            <div className="flex flex-col gap-3 text-[15px] font-semibold">
              <div>
                <span className="text-gray-500 font-medium mr-1">Priority: </span>
                <span className={
                  selectedTodo.priority === 'Extreme' ? 'text-[#ef4444]' :
                    selectedTodo.priority === 'Low' ? 'text-[#10b981]' :
                      'text-[#60a5fa]'
                }>{selectedTodo.priority || "Moderate"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-1">Status: </span>
                <span className={selectedTodo.isComplete ? "text-[#10b981]" : "text-[#ff6b6b]"}>
                  {selectedTodo.isComplete ? "Completed" : "Not Started"}
                </span>
              </div>
              <div className="text-[#c0c5ce] font-medium text-[13px] mt-2">
                Created on: {new Date(selectedTodo.createdAt || Date.now()).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>

          <div className="flex-1 border-t border-gray-100/80 pt-8 mt-2">
            <div className="text-[16px] text-[#6b7280] leading-[1.8] font-medium whitespace-pre-wrap max-w-4xl">
              {selectedTodo.description || <span className="italic text-gray-400">No description provided for this task.</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-[1.5px] border-[#eff0f3] rounded-[24px] p-6 lg:p-8 mt-2 shadow-sm">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">

            {/* Left Column: To-Do */}
            <div className="bg-transparent relative overflow-hidden xl:border-r-[1.5px] xl:border-[#eff0f3] xl:pr-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#ff6b6b]">
                  <ClipboardIcon />
                  <h3 className="text-[17px] font-bold">To-Do</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-[15px] font-semibold text-[#ff6b6b] hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  + Add task
                </button>
              </div>

              <div className="text-[13px] font-bold text-gray-800 mb-5 ml-1 flex gap-2">
                20 June <span className="text-gray-400 font-medium">• Today</span>
              </div>

              <div className="space-y-[28px] max-h-[600px] overflow-y-auto pr-2 scrollbar-none pb-10">
                {activeTodos.length === 0 ? (
                  <div className="text-center py-12 bg-[#f8f9fc] rounded-[20px] border border-dashed border-gray-200 mb-4 flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <ClipboardIcon className="text-gray-300 w-8 h-8" />
                    </div>
                    <p className="text-gray-500 font-medium text-[15px]">No active tasks right now.</p>
                    <p className="text-gray-400 text-sm mt-1">Enjoy your free time or add a new task!</p>
                  </div>
                ) : (
                  activeTodos.map(todo => {
                    const isExtreme = todo.priority === 'Extreme';
                    const isLow = todo.priority === 'Low';
                    const borderColor = isExtreme ? 'border-[#ef4444]' : (isLow ? 'border-[#10b981]' : 'border-[#3b82f6]');
                    const statusColor = 'text-[#ef4444]'; // Always red for In Progress matching screenshot
                    const statusText = 'In Progress';

                    return (
                      <div
                        key={todo._id}
                        className="bg-white border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-none flex flex-col gap-[14px] relative group cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all"
                        onClick={(e) => {
                          if (e.target.closest('button')) return;
                          setSelectedTodo(todo);
                        }}
                      >
                        <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete Task">
                          <TrashIcon />
                        </button>
                        <div className="flex gap-4">
                          {/* Circle Complete Toggle (Hollow) */}
                          <button onClick={() => updateTodoStatus(todo._id, todo.isComplete)} className={`mt-[2px] w-[20px] h-[20px] rounded-full border-[2.5px] ${borderColor} shrink-0 transition-colors flex items-center justify-center`}>
                          </button>


                          <div className="flex-1 flex justify-between gap-6 pr-2">
                            <div className="flex flex-col">
                              <h4 className="text-[20px] font-bold text-[#1f2937] leading-[1.3] mb-[12px]">{todo.text}</h4>
                              <p className="text-[#6b7280] text-[16px] leading-[1.5] font-medium pr-8">
                                {todo.description || "No description provided."}
                              </p>
                            </div>
                          </div>
                        </div>


                        <div className="flex justify-between items-center mt-[10px] pl-[36px] pr-2">
                          <div className="flex gap-4 text-[12px] font-semibold flex-wrap">
                            <div>
                              <span className="text-[#374151]">Priority: </span>
                              <span className="text-[#60a5fa]">{todo.priority || "Moderate"}</span>
                            </div>
                            <div>
                              <span className="text-[#374151]">Status: </span>
                              <span className={statusColor}>{statusText}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-[12px] font-medium text-[#c0c5ce]">
                              Created on: {new Date(todo.createdAt || Date.now()).toLocaleDateString("en-GB")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {hasNextPage && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="bg-white border-[1.5px] border-[#eff0f3] text-gray-600 px-6 py-2 rounded-full font-bold text-[14px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isFetchingNextPage ? "Loading more..." : "Load More Tasks"}
                    </button>
                  </div>
                )}
              </div>
            </div>


            <div className="space-y-6">


              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col h-full animate-fade-in [animation-delay:100ms]">
                <h3 className="text-xl font-bold text-[#ff6b6b] mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Task Status
                </h3>

                <div className="flex-1 flex items-center justify-around px-2">
                  {/* Completed Circle */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#f3f4f6" strokeWidth="4" />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${completedPct}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-800">{completedPct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                      <span className="text-sm font-bold text-gray-600">Completed</span>
                    </div>
                  </div>

                  {/* In Progress Circle */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#f3f4f6" strokeWidth="4" />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${activePct}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-800">{activePct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-sm font-bold text-gray-600">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-transparent mt-[60px]">
                <div className="flex items-center gap-2 text-[#10b981] mb-4">
                  <CheckBadgeIcon />
                  <h3 className="text-[17px] font-bold text-[#10b981]">Completed Task</h3>
                </div>

                <div className="space-y-[28px] max-h-[350px] overflow-y-auto pr-2 scrollbar-none">
                  {completedTodos.length === 0 ? (
                    <div className="text-center py-8 bg-[#f8f9fc] rounded-[20px] border border-dashed border-gray-200 flex flex-col items-center justify-center">
                      <p className="text-gray-400 font-medium text-[14px]">No completed tasks yet.</p>
                    </div>
                  ) : (
                    completedTodos.map(todo => (
                      <div
                        key={todo._id}
                        className="bg-white border-[1.5px] border-[#eff0f3] rounded-[16px] p-6 shadow-none flex flex-col gap-[14px] relative group cursor-pointer hover:border-[#10b981]/30 hover:shadow-sm transition-all"
                        onClick={(e) => {
                          if (e.target.closest('button')) return;
                          setSelectedTodo(todo);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            {/* Circle Complete Toggle (Solid Green with Check) */}
                            <button onClick={() => updateTodoStatus(todo._id, todo.isComplete)} className="mt-[2px] w-[20px] h-[20px] rounded-full bg-[#10b981] shrink-0 transition-colors flex items-center justify-center text-white shadow-sm">
                              <svg className="w-[12px] h-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>

                            <div className="flex flex-col mt-[1px]">
                              <h4 className="text-[20px] font-bold text-[#1f2937] leading-[1.1] mb-[16px]">{todo.text}</h4>

                              <div className="flex flex-col gap-[8px] text-[13px] font-semibold">
                                <div>
                                  <span className="text-[#374151]">Priority: </span>
                                  <span className={
                                    todo.priority === 'Extreme' ? 'text-[#ef4444]' :
                                      todo.priority === 'Low' ? 'text-[#10b981]' :
                                        'text-[#60a5fa]'
                                  }>{todo.priority || "Moderate"}</span>
                                </div>
                                <div>
                                  <span className="text-[#374151]">Status: </span>
                                  <span className="text-[#10b981]">Completed</span>
                                </div>
                                <div className="text-[12px] font-medium text-[#c0c5ce] mt-1">
                                  Completed on: {new Date(todo.updatedAt || Date.now()).toLocaleDateString("en-GB")}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete Task">
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* End Right Column */}
            </div>
            {/* End Grid Layout */}
          </div>
          {/* End Main Content Box */}
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <span>⚠️</span>
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}
    </div>
  );
}

// Helpers
const CircularProgress = ({ percentage, color }) => {
  const radius = 30;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg height="100%" width="100%" viewBox="0 0 100 100" className="rotate-[-90deg]">
        <circle
          stroke="#f3f4f6" fill="transparent" strokeWidth={strokeWidth} r={normalizedRadius} cx="50" cy="50"
        />
        <circle
          stroke={color} fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease-in-out" }} strokeLinecap="round"
          r={normalizedRadius} cx="50" cy="50"
        />
      </svg>
      <span className="absolute text-sm font-black text-gray-700">{percentage}%</span>
    </div>
  );
};

// Icons
const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
);
const ClipboardIcon = ({ className = "w-6 h-6 text-gray-400" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
);
const ChartPieIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
);
const CheckBadgeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

export default Home;
