// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { clientAuthApi } from "../services/clientAuthApi";

function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if client is already logged in and handle success messages
  useEffect(() => {
    if (clientAuthApi.isAuthenticated()) {
      navigate("/client/dashboard");
    }

    // Check for success message from password reset
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const result = await clientAuthApi.login(email, password);
      console.log("Client login successful:", result);
      navigate("/client/dashboard");
    } catch (error) {
      console.error("Client login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/client/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#292A2B]">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src="/login-logo.png"
            alt="Equipment Rental Logo"
            className="mx-auto mb-4"
            style={{ width: "200px", height: "auto" }}
          />
        </div>

        {/* Login Form Container */}
        <div className="bg-[#1F1F20] border border-[#333333] rounded-lg p-8">
          {/* Title */}
          <h2 className="text-[#E5E5E5] font-[Inter] text-center text-2xl font-medium mb-8">
            Login
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-[#E5E5E5] font-[Inter] text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] placeholder-[#9CA3AF] font-[Inter] px-4 focus:outline-none focus:border-[#FDCE06] transition-colors"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-[#E5E5E5] font-[Inter] text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#292A2B] border border-[#333333] rounded-md text-[#E5E5E5] placeholder-[#9CA3AF] font-[Inter] px-4 focus:outline-none focus:border-[#FDCE06] transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-[#292A2B] border border-[#333333] rounded focus:ring-0 focus:ring-offset-0"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-[#E5E5E5] font-[Inter] text-sm"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#FDCE06] font-[Inter] text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="text-green-400 text-sm font-[Inter] text-center">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm font-[Inter] text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-md font-[Inter] font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#9CA3AF] text-[#666] cursor-not-allowed"
                  : "bg-[#FDCE06] text-[#1F1F20] hover:bg-[#E5B800]"
              }`}
            >
              {loading ? (
                <>
                  <ClipLoader color="#666" size={16} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}

export default ClientLogin;
