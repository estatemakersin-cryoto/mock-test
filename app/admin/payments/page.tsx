"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // ADD THIS LINE

  useEffect(() => {
    loadPayments();
  }, []);

  
  const loadPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });

      if (!res.ok) return alert("Failed to load payments");

      const data = await res.json();
      setPayments(data.payments);
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
  };

  const handleAction = async (paymentId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to process");
        return;
      }

      await loadPayments(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Submissions</h1>

      <div className="space-y-4">
        {payments.length === 0 && (
          <div className="p-6 bg-gray-100 rounded">No payment submissions found.</div>
        )}

        {payments.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-white border rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{p.user.fullName}</p>
              <p className="text-sm text-gray-600">{p.user.email}</p>
              <p className="text-sm text-gray-600">{p.user.mobile}</p>
              <p className="mt-1">
                <strong>Transaction ID:</strong> {p.transactionId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    p.status === "PENDING"
                      ? "bg-yellow-500"
                      : p.status === "APPROVED"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {p.status}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            {p.status === "PENDING" && (
              <div className="space-x-2">
                <button
                  onClick={() => handleAction(p.id, "APPROVE")}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(p.id, "REJECT")}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
