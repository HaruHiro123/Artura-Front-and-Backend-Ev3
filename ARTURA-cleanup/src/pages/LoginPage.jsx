import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { getActiveLanguage } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const isId = getActiveLanguage() === "id";

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result && result.success === false) {
        setError(result.message);
      }
    } catch {
      setError(
        isId
          ? "Terjadi kesalahan saat masuk. Silakan coba lagi."
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-stone-200">
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-800">
            ARTURA SECURE ACCESS
          </p>
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            {isId ? "Masuk Akun" : "Welcome Back"}
          </h2>
          <p className="text-sm text-stone-500">
            {isId
              ? "Masuk menggunakan email admin@artura.com"
              : "Sign in with your email and password."}
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-center text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Email / Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                placeholder="admin@artura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-xs text-stone-500 hover:text-stone-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-full text-white font-medium bg-emerald-950 hover:bg-emerald-900 disabled:opacity-50 transition cursor-pointer"
          >
            {isSubmitting
              ? isId
                ? "Memproses..."
                : "Signing In..."
              : isId
              ? "Masuk ke Panel"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}