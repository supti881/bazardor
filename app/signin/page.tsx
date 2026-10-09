'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in submitted:', formData);
  };

  return (
    <main className="min-h-screen bg-[#f1f5f3] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      
      {/* বাইরের টাইটেল ও সাবটাইটেল */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          সাইন ইন
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* সাইন ইন কার্ড */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008a45] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008a45] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#008a45] hover:bg-[#00763a] text-white font-bold text-sm rounded-xl shadow-sm transition-all mt-2"
          >
            সাইন ইন
          </button>
        </form>

        {/* সেপারেটর */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-gray-500 font-medium absolute">
            অথবা
          </span>
        </div>

        {/* সোশ্যাল সাইন ইন */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button 
            type="button" 
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all bg-white"
          >
            <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* সাইন আপ লিংক */}
        <p className="text-center text-xs text-gray-600 pt-1">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-[#008a45] font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>

      </div>

      {/* নিচের হোম বাটন */}
      <div className="mt-6">
        <Link 
          href="/" 
          className="text-xs font-bold text-gray-500 hover:text-[#008a45] transition-colors"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>

    </main>
  );
}