import Link from "next/link";
import { ArrowRightIcon } from '@heroicons/react/24/outline'; // Run: npm install @heroicons/react

// --- SVG Icons for Roles ---
const SellerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const BuyerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 text-center transform transition-all duration-500 hover:scale-105">
        
        {/* App Title and Subtitle */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">
          Scheduler Pro
        </h1>
        <p className="text-gray-500 mb-10">
          Seamless appointments with Google Calendar integration.
        </p>

        {/* Role Selection Links */}
        <div className="space-y-6">
          <Link
            href="/seller"
            className="group flex items-center p-6 border-2 border-transparent rounded-xl bg-blue-50 hover:border-blue-500 hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="mr-5">
              <SellerIcon />
            </div>
            <div className="text-left">
            I&apos;m a Seller
              <p className="text-gray-600">Connect your calendar and share your availability.</p>
            </div>
            <ArrowRightIcon className="ml-auto h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            href="/buyer"
            className="group flex items-center p-6 border-2 border-transparent rounded-xl bg-green-50 hover:border-green-500 hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="mr-5">
              <BuyerIcon />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">I&apos;m a Buyer</h3>
              <p className="text-gray-600">Find a seller and book an appointment instantly.</p>
            </div>
            <ArrowRightIcon className="ml-auto h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Scheduler Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}