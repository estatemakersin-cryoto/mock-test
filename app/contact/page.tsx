"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-900 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold hover:opacity-90">
            EstateMakers – MahaRERA Prep
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto p-6 md:p-10 flex-1">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
          Contact Us
        </h1>

        {/* CONTACT CARD */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Get in Touch</h2>

          <div className="space-y-8">
            {/* Email */}
            <div className="flex items-start">
              <div className="text-blue-600 text-3xl mr-4">📧</div>
              <div>
                <h3 className="font-bold text-lg">Email Support</h3>
                <a
                  href="mailto:estateMakers.in@gmail.com"
                  className="text-blue-700 font-medium hover:underline"
                >
                  estateMakers.in@gmail.com
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  We respond within 24 hours on working days.
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start">
              <div className="text-blue-600 text-3xl mr-4">🕒</div>
              <div>
                <h3 className="font-bold text-lg">Business Hours</h3>
                <p className="text-gray-700">Mon – Fri: 9:00 AM – 6:00 PM IST</p>
                <p className="text-gray-700">Saturday: 9:00 AM – 1:00 PM IST</p>
                <p className="text-gray-700">Sunday: Closed</p>
              </div>
            </div>

            {/* Support Areas */}
            <div className="flex items-start">
              <div className="text-blue-600 text-3xl mr-4">💬</div>
              <div>
                <h3 className="font-bold text-lg">Support Topics</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Registration or login issues</li>
                  <li>Payment verification & approval</li>
                  <li>Access to mock tests & revision materials</li>
                  <li>Technical support</li>
                  <li>MahaRERA exam guidelines</li>
                  <li>Validity & usage queries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Frequently Asked Questions</h2>

          <div className="space-y-6 text-gray-800">
            <div>
              <h3 className="font-semibold text-lg mb-1">How do I access the Premium Plan?</h3>
              <p className="text-gray-700">
                Once your payment is approved, your dashboard unlocks full access to all
                11 chapter revisions and 5 mock tests instantly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">Do you offer tests in Marathi?</h3>
              <p className="text-gray-700">
                Yes! The entire syllabus, revision notes, and all MCQs are available in
                both English and Marathi. You can switch anytime.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">Is there any free test?</h3>
              <p className="text-gray-700">
                No free tests are provided. Only paid users can access full content
                to maintain quality and fairness for all learners.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">Can I retake mock tests?</h3>
              <p className="text-gray-700">
                Yes! Premium users get unlimited attempts during the 100-day validity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">How long does approval take?</h3>
              <p className="text-gray-700">
                Typically within 10–30 minutes during working hours. Once approved,
                your dashboard updates automatically.
              </p>
            </div>
          </div>
        </div>

        {/* EMAIL CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-3">Still need assistance?</p>
          <a
            href="mailto:estateMakers.in@gmail.com"
            className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 transition"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
