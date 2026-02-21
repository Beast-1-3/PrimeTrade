import TodoModel from "../model/todo.model.js"

export const createTodo = async (req, res) => {
    const todo = new TodoModel({
        text: req.body.text,
        description: req.body.description || "",
        priority: req.body.priority || "Moderate",
        isComplete: false,
        user: req.user
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json({ message: "Todo created successfully", newTodo });
    } catch (error) {
        res.status(500).json({ message: "Error in todo creation" });
    }
};

export const getTodoList = async (req, res) => {
    try {
        const userId = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalTodos = await TodoModel.countDocuments({ user: userId });
        const todoList = await TodoModel.find({ user: userId })
            .sort({ createdAt: -1 }) // Sort newest first
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Todo list fetched successfully",
            todoList,
            currentPage: page,
            totalPages: Math.ceil(totalTodos / limit),
            totalTodos
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching todo list" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized to update this todo" });
        }

        todo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized to delete this todo" });
        }

        await TodoModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Todo deleted successfully", todo });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo" });
    }
};