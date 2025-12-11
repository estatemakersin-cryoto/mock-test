"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mobile.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on response
      window.location.href = data.redirect;

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* MOBILE NUMBER */}
          <div>
            <label className="block mb-1 font-medium">Mobile Number</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <span className="text-gray-500 mr-2">+91</span>
              <input
                type="number"
                className="w-full outline-none"
                placeholder="Enter 10-digit mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.slice(0, 10))}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 relative">
              <input
                type={showPw ? "text" : "password"}
                className="w-full outline-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-blue-600"
              >
                {showPw ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          {/* REGISTER LINK */}
          <p className="text-center text-sm mt-3">
            Not registered?{" "}
            <span
              className="text-blue-700 font-semibold cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
