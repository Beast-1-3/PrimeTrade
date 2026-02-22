import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { validateEmail, validatePassword, validateUsername } from "../utils/validation";

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (field === "firstName" && !firstName) err = "First name is required";
    if (field === "lastName" && !lastName) err = "Last name is required";
    if (field === "username") err = validateUsername(username);
    if (field === "email") err = validateEmail(email);
    if (field === "password") err = validatePassword(password);
    if (field === "confirmPassword" && password !== confirmPassword) err = "Passwords do not match";

    setFieldErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const validateAll = () => {
    const fNameErr = !firstName ? "First name is required" : "";
    const lNameErr = !lastName ? "Last name is required" : "";
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = password !== confirmPassword ? "Passwords do not match" : "";

    setFieldErrors({
      firstName: fNameErr,
      lastName: lNameErr,
      username: usernameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
    });
    setTouched({ firstName: true, lastName: true, username: true, email: true, password: true, confirmPassword: true });

    return !(fNameErr || lNameErr || usernameErr || emailErr || passwordErr || confirmErr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/user/sign-up`, { firstName, lastName, username, email, password });
      if (response.status === 200 || response.status === 201) {
        // The token is now securely stored in an HttpOnly cookie
        navigate("/", { replace: true });
      } else {
        setError('Error creating user. Please try again.');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(", "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during sign-up. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-doodle-bg min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden animate-scale-in">

        {/* Left Side: Illustration */}
        <div className="w-full md:w-5/12 bg-white flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
          <img
            src="/signup_illustration.png"
            alt="Signup Illustration"
            className="w-full max-w-md object-contain mix-blend-multiply"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Sign Up</h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <UserIcon />
                    </div>
                    <input
                      type="text" value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (touched.firstName) validateField("firstName"); }}
                      onBlur={() => handleBlur("firstName")}
                      placeholder="Enter First Name"
                      className={`auth-input ${touched.firstName && fieldErrors.firstName ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                  </div>
                  {touched.firstName && fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <UserIcon />
                    </div>
                    <input
                      type="text" value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (touched.lastName) validateField("lastName"); }}
                      onBlur={() => handleBlur("lastName")}
                      placeholder="Enter Last Name"
                      className={`auth-input ${touched.lastName && fieldErrors.lastName ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                  </div>
                  {touched.lastName && fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                </div>
              </div>

              {/* Username */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <UserSolidIcon />
                  </div>
                  <input
                    type="text" value={username}
                    onChange={(e) => { setUsername(e.target.value); if (touched.username) validateField("username"); }}
                    onBlur={() => handleBlur("username")}
                    placeholder="Enter Username"
                    className={`auth-input ${touched.username && fieldErrors.username ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.username && fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <EnvelopeIcon />
                  </div>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (touched.email) validateField("email"); }}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter Email"
                    className={`auth-input ${touched.email && fieldErrors.email ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.email && fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <LockIcon />
                  </div>
                  <input
                    type="password" value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) validateField("password"); }}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter Password"
                    className={`auth-input ${touched.password && fieldErrors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.password && fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <LockOutlineIcon />
                  </div>
                  <input
                    type="password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (touched.confirmPassword) validateField("confirmPassword"); }}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Confirm Password"
                    className={`auth-input ${touched.confirmPassword && fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                </div>
                {touched.confirmPassword && fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-auth w-[140px] mt-2 mb-4"
              >
                {isSubmitting ? "Wait..." : "Register"}
              </button>

              {/* Link */}
              <p className="text-sm text-gray-600 mt-6 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
                  Sign In
                </Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const UserSolidIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);
const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
);
const LockOutlineIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
