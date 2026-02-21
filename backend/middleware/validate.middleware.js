import { z } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        const errorMessage = err.errors.map((e) => e.message);
        return res.status(400).json({
            message: "Invalid input",
            errors: errorMessage,
        });
    }
};

export const userValidation = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    username: z.string().min(3, { message: 'Username must have at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email', required: true }),
    password: z.string().min(8, { message: 'Password must have at least 8 characters', required: true }),
});

export const updateProfileValidation = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().min(3, { message: 'Username must have at least 3 characters' }).optional(),
    email: z.string().email({ message: 'Invalid email' }).optional(),
});
