"use client";

import { signOut, useSession } from "next-auth/react";

export default function BuyerPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Buyer Page</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </header>
      <main className="flex-grow max-w-4xl mx-auto p-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {session?.user?.name}
          </h2>
          <div className="text-gray-700">
            <p>Search and select a Seller to book an appointment.</p>
            {/* TODO: Implement seller list and booking UI */}
          </div>
        </section>
      </main>
    </div>
  );
}
