"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 md:py-16 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">

          {/* Top Badge */}
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            🚨 Mandatory Certification for All Real Estate Agents
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            MahaRERA Certificate of Competency (COC)
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl font-bold mb-3 text-yellow-300">
            Exam Preparation by <span className="underline">EstateMakers</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Maharashtra&apos;s Leading Preparation Platform for Agents & Developers  
            <br />
            <span className="font-semibold">
              Includes Full Syllabus • Revision • Mock Tests • English + Marathi
            </span>
          </p>

          {/* OFFER BOX */}
          <div className="bg-white/20 border border-white/30 rounded-lg p-4 md:p-5 mt-6 max-w-md mx-auto shadow-lg">
            <p className="text-lg font-semibold text-yellow-300">
              Premium Plan – ₹750
            </p>
            <p className="text-sm md:text-base text-blue-100 mt-1">
              FREE 2 Months Access to EstateMakers.in (worth ₹1000)
            </p>
          </div>

          {/* CTA BUTTON */}
          <div className="flex justify-center items-center mt-8">
            <Link
              href="/register"
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg text-lg shadow-xl transition transform hover:scale-105"
            >
              Start Preparation – ₹750
            </Link>
          </div>

        </div>
      </section>

      {/* WHAT IS MahaRERA COC */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What is MahaRERA Certificate of Competency?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Mandatory Section */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">
                ⚠️ Mandatory Requirement
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li>✓ Required for MahaRERA agent registration</li>
                <li>✓ Without COC: Cannot legally practice as an agent</li>
                <li>✓ Penalties apply for non-compliance</li>
              </ul>
            </div>

            {/* Benefits Section */}
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-900 mb-3">
                ✅ Certificate Benefits
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li>✓ Valid for 5 years (renewable)</li>
                <li>✓ Recognized across Maharashtra</li>
                <li>✓ Improves credibility with clients & developers</li>
              </ul>
            </div>
          </div>

          {/* Exam Format */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-1">📝</div>
              <div className="font-bold">50 MCQs</div>
              <div className="text-xs text-gray-600">Multiple Choice</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-1">⏱️</div>
              <div className="font-bold">60 Minutes</div>
              <div className="text-xs text-gray-600">Total Duration</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-1">💯</div>
              <div className="font-bold">100 Marks</div>
              <div className="text-xs text-gray-600">2 marks each</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-1">✅</div>
              <div className="font-bold">40% Pass</div>
              <div className="text-xs text-gray-600">No Negative Marking</div>
            </div>
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

      {/* ESTATEMAKERS COMING SOON BANNER (RESTORED!) */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-wide">
            🚀 EstateMakers Platform Launching Soon
          </h3>
          <p className="text-base md:text-lg text-purple-100 mb-2">
            Networking • Proposals • Redevelopment • Builder Connect • B2C Lead Flow
          </p>
          <p className="text-sm text-purple-200">
            The Complete Real Estate Business Platform for Maharashtra Agents
          </p>
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
