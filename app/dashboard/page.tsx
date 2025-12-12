"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Show "payment approved" popup once
  const [showApprovedMsg, setShowApprovedMsg] = useState(false);

  const TOTAL_TESTS = 5;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/verify", { cache: "no-store" });
      if (!res.ok) return router.push("/login");

      const data = await res.json();
      setUser(data.user);

      // Show popup on approval (ONLY ONCE)
      if (data.user.packagePurchased && data.user.hasSeenApprovalMessage === false) {
        setShowApprovedMsg(true);

        // mark message as seen
        await fetch("/api/user/mark-approval-seen", {
          method: "POST",
        });
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const hasPremium = user.packagePurchased === true;
  const testsCompleted = user.testsCompleted ?? 0;
  const testsRemaining = hasPremium ? TOTAL_TESTS - testsCompleted : 0;

  const referralMessage = encodeURIComponent(
    `Hi 😊  
I am preparing for the MahaRERA Exam with EstateMakers.  
Very useful platform with MCQs, Revision, Mock Tests & Study Material.  
Join using EstateMakers.in`
  );

  const referralLink = "https://estatemakers.in";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-blue-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">EstateMakers – Dashboard</h1>

          <div className="flex gap-3 items-center">
            <span className="hidden md:block">{user.fullName}</span>

            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">


        {/* ------------------ APPROVAL POPUP ------------------ */}
        {showApprovedMsg && (
          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded mb-6">
            <h2 className="text-lg font-bold text-green-800">🎉 Payment Approved!</h2>
            <p className="text-sm text-green-700 mt-1">
              Your premium access is now active.  
              You can now start unlimited revision + all 5 mock tests.  
              <strong> Best of luck! </strong>
            </p>

            <button
              onClick={() => setShowApprovedMsg(false)}
              className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              OK
            </button>
          </div>
        )}


        {/* ------------------ PREMIUM LOCKED ------------------ */}
        {!hasPremium && (
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded mb-6">
            <h2 className="text-lg font-bold text-yellow-800">Premium Locked</h2>
            <p className="text-sm text-yellow-700 mt-1">
              Unlock all chapters, revision notes and 5 mock tests.
            </p>

            <Link
              href="/payment"
              className="inline-block mt-3 px-5 py-2 bg-purple-600 text-white rounded font-semibold"
            >
              Buy Premium – ₹750
            </Link>
          </div>
        )}


        {/* ------------------ PREMIUM ACTIVE ------------------ */}
        {hasPremium && (
          <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
            <h2 className="text-xl font-bold text-green-700">
              Premium Access Active ✔
            </h2>
            <p className="text-gray-700 text-sm mt-1">
              Enjoy full syllabus access + mock tests.
            </p>
          </div>
        )}


        {/* ------------------ MAIN FEATURE CARDS ------------------ */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Revision */}
          <Link
            href="/revision"
            className="bg-blue-100 p-6 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg">📘 Revision Center</h3>
            <p className="text-sm text-gray-700 mt-2">
              Chapter-wise notes, FAQs & key points.
            </p>
          </Link>

          {/* Mock Tests */}
          <Link
            href={hasPremium ? "/tests" : "/payment"}
            className="bg-purple-100 p-6 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="font-bold text-lg">📝 Full Mock Tests</h3>
            <p className="text-sm text-gray-700 mt-2">
              Real exam-like mock tests.
            </p>
          </Link>

        </div>


        {/* ------------------ STUDY RESOURCES ------------------ */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mt-10 text-white">
          <h3 className="text-2xl font-bold mb-4">📚 Study Resources</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/20 p-5 rounded-lg text-center">
              <div className="text-4xl mb-2">📖</div>
              <div className="font-semibold text-lg">Revision Center</div>
              <p className="text-sm opacity-90">All chapters + FAQs</p>

              <Link
                href="/revision"
                className="text-yellow-300 font-semibold block mt-2"
              >
                Start Revision →
              </Link>
            </div>

            <div className="bg-white/20 p-5 rounded-lg text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="font-semibold text-lg">Mock Tests</div>

              <p className="text-sm opacity-90">
                {testsRemaining}/{TOTAL_TESTS} Available
              </p>

              <Link
                href={hasPremium ? "/tests" : "/payment"}
                className="text-yellow-300 font-semibold block mt-2"
              >
                Start Test →
              </Link>
            </div>
          </div>
        </div>


        {/* ------------------ REFERRAL ------------------ */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-10 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            🤝 Refer Your Friends
          </h3>
          <p className="text-gray-700 mb-3">Share this link:</p>

          <div className="flex items-center gap-3 mb-3">
            <input
              value={referralLink}
              disabled
              className="flex-1 border px-3 py-2 rounded bg-gray-100 text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Copy
            </button>
          </div>

          <a
            href={`https://wa.me/?text=${referralMessage}`}
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded inline-block"
          >
            📤 Share on WhatsApp
          </a>
        </div>


        {/* ------------------ COMING SOON ------------------ */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-lg p-6 mt-10 text-white">
          <h3 className="text-2xl font-bold mb-2">🚀 EstateMakers Agent Network</h3>
          <p className="opacity-90">
            Soon launching Real Estate Agent Network, CRM, Leads & Tools.
          </p>
        </div>


        {/* ------------------ USER INFO ------------------ */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
          <div className="grid md:grid-cols-4 gap-6">

            <div>
              <p className="text-sm text-gray-600">Registration No.</p>
              <p className="text-xl font-bold">{user.registrationNo}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Package Status</p>
              <p
                className={`text-lg font-bold ${
                  hasPremium ? "text-purple-600" : "text-red-600"
                }`}
              >
                {hasPremium ? "Premium Active" : "Not Purchased"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Mock Tests</p>
              <p className="text-3xl font-bold text-blue-600">
                {testsRemaining}/{TOTAL_TESTS}
              </p>
            </div>

            {!hasPremium && (
              <div className="flex items-center">
                <button
                  onClick={() => router.push("/payment")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold w-full"
                >
                  Buy Premium – ₹750
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
