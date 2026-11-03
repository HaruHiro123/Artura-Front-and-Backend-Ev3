import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { getActiveLanguage } from "../services/api";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isId = getActiveLanguage() === "id";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-stone-200 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          {isId ? "Keluar Akun" : "Sign Out"}
        </h2>
        <p className="text-sm text-stone-600">
          {isId
            ? "Apakah Anda yakin ingin keluar dari sesi admin?"
            : "Are you sure you want to sign out of your account?"}
        </p>
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-2.5 px-4 rounded-full text-white font-medium bg-red-600 hover:bg-red-700 transition cursor-pointer"
          >
            {isLoggingOut
              ? isId
                ? "Keluar..."
                : "Signing out..."
              : isId
              ? "Ya, Keluar"
              : "Sign Out"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isLoggingOut}
            className="w-full py-2.5 px-4 rounded-full border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition cursor-pointer"
          >
            {isId ? "Batal" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}