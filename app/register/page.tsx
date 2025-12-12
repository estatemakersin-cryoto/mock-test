"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        alert("Registration successful!");
        router.push("/login");
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              className="w-full border rounded p-3"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              className="w-full border rounded p-3"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1 font-semibold">Mobile Number</label>

            <div className="flex">
              {/* Locked +91 Prefix */}
              <span className="px-4 py-3 bg-gray-200 border border-r-0 rounded-l text-gray-700 font-semibold">
                +91
              </span>

              <input
                type="tel"
                maxLength={10}
                className="w-full border rounded-r p-3"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => {
                  // Remove ALL spaces, dashes, brackets, symbols, +91 — only keep digits
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, mobile: cleaned });
                }}
                required
              />
            </div>
          </div>


          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded p-3"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>

            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                className="w-full border rounded p-3"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>

          {/* Referral */}
          <div>
            <label className="block mb-1 font-semibold">Referral Code</label>
            <input
              type="text"
              className="w-full border rounded p-3"
              value={formData.referralCode}
              onChange={(e) =>
                setFormData({ ...formData, referralCode: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
