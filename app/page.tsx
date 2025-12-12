"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-blue-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Preparing for MahaRERA Certification Exam?
            </h1>

            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Get complete preparation with 400+ MCQs, chapter-wise revision
              notes, 5 mock tests and real exam–style interface —
              everything you need to pass confidently.
            </p>

            {/* OFFER BOX */}
            <div className="bg-white/20 border border-white/30 rounded-lg p-5 shadow-lg">
              <p className="text-lg font-semibold text-yellow-300">
                Premium Plan – ₹750
              </p>
              <p className="text-sm text-blue-100 mt-1">
                FREE 2 Months Access to EstateMakers.in (worth ₹2000)
              </p>
            </div>

            {/* CTA BUTTON */}
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-purple-500 hover:bg-purple-600 
                        text-white font-bold rounded-lg text-lg shadow-xl 
                        transition transform hover:scale-105"
            >
              Start Preparation – ₹750
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex justify-center md:justify-end">
            <img
              src="/hero-mocktest.png"
              alt="MahaRERA Mock Test"
              className="w-full max-w-md rounded-lg shadow-xl"
            />
          </div>

        </div>
      </section>

      {/* WHAT IS MahaRERA COC */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What is MahaRERA Certificate of Competency?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mandatory */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">
                ⚠️ Mandatory Requirement
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Required for MahaRERA Agent Registration</li>
                <li>✓ Without COC: Cannot legally work as an agent</li>
                <li>✓ Penalties apply for non-compliance</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                ✅ Certificate Benefits
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Valid for 5 years</li>
                <li>✓ Recognized across Maharashtra</li>
                <li>✓ Boosts credibility & trust</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXAM FORMAT */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold">50 MCQs</div>
            <p className="text-xs text-gray-600">Multiple Choice</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="font-bold">60 Minutes</div>
            <p className="text-xs text-gray-600">Total Duration</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">💯</div>
            <div className="font-bold">100 Marks</div>
            <p className="text-xs text-gray-600">2 Marks Each</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold">40% Pass</div>
            <p className="text-xs text-gray-600">No Negative Marking</p>
          </div>
        </div>
      </section>

      {/* PREMIUM PLAN */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-8">

            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              💎 FULL ACCESS
            </div>

            <h3 className="text-2xl font-bold mb-2">
              MahaRERA Exam Preparation – Premium Plan
            </h3>

            <p className="text-5xl font-extrabold text-purple-600 mb-4">
              ₹750
            </p>

            <ul className="space-y-2 text-gray-700 text-sm mb-6">
              <li>✓ All 11 chapters’ revision</li>
              <li>✓ All 5 mock tests unlocked</li>
              <li>✓ English + Marathi toggle</li>
              <li>✓ No referral / top-up needed</li>
              <li>✓ 100 days full validity</li>
            </ul>

            <Link
              href="/register"
              className="block text-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition"
            >
              Buy Premium – ₹750
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Designed by Certified MahaRERA Trainer | 5000+ Agents Trained</p>
          <p className="mt-1">© 2024 EstateMakers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
