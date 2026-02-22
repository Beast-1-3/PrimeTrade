// Client-side validation helpers — mirrors backend Zod rules

export function validateEmail(email) {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
}

export function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
}

export function validateUsername(username) {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    return "";
}
