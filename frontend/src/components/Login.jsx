import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { validatePassword, validateUsername } from "../utils/validation";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    let err = "";
    if (field === "username") err = validateUsername(username);
    if (field === "password") err = validatePassword(password);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const validateAll = () => {
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);
    setFieldErrors({ username: usernameErr, password: passwordErr });
    setTouched({ username: true, password: true });
    return !usernameErr && !passwordErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/user/sign-in`, {
        identifier: username,
        password: password,
        rememberMe: rememberMe,
      });

      if (response.status === 200 || response.status === 201) {
        // The token is now securely stored in an HttpOnly cookie
        navigate("/", { state: { from: "login" }, replace: true });
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-doodle-bg min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row h-full overflow-hidden animate-scale-in">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-14 lg:p-16 flex items-center justify-center shrink-0">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Sign In</h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Username/Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <UserSolidIcon />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (touched.username) validateField("username"); }}
                    onBlur={() => handleBlur("username")}
                    placeholder="Enter Email"
                    className={`auth-input ${touched.username && fieldErrors.username ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.username && fieldErrors.username && (
                  <p className="text-red-500 text-xs mt-1 animate-slide-up">{fieldErrors.username}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) validateField("password"); }}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter Password"
                    className={`auth-input ${touched.password && fieldErrors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.password && fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1 animate-slide-up">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center pt-1 pb-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-400 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer">
                  Remember Me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-auth w-[140px] mt-2 mb-8"
              >
                {isSubmitting ? "Wait..." : "Login"}
              </button>

              {/* Register Link */}
              <p className="text-sm text-gray-600 mt-5">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
                  Create One
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 border-t md:border-t-0 md:border-l border-gray-100 hidden md:flex shrink-0">
          <img
            src="/login_illustration.png"
            alt="Login Illustration"
            className="w-full max-w-md object-contain mix-blend-multiply"
          />
        </div>

      </div>
    </div>
  );
}

// Icons
const UserSolidIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
);
