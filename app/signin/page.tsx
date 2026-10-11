'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { getFirebaseAuth, getFirebaseAuthErrorMessage } from '@/lib/firebase';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      alert('সফলভাবে সাইন ইন করেছেন!');
      router.push('/');
    } catch (err: unknown) {
      console.error('Sign-in failed:', err);
      setError(getFirebaseAuthErrorMessage(err, 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, provider);
      alert('Google দিয়ে সফলভাবে সাইন ইন হয়েছে!');
      router.push('/');
    } catch (err: unknown) {
      console.error('Google sign-in failed:', err);
      setError(getFirebaseAuthErrorMessage(err, 'Google সাইন ইন করতে সমস্যা হয়েছে।'));
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    const provider = new GithubAuthProvider();
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, provider);
      alert('GitHub দিয়ে সফলভাবে সাইন ইন হয়েছে!');
      router.push('/');
    } catch (err: unknown) {
      console.error('GitHub sign-in failed:', err);
      setError(getFirebaseAuthErrorMessage(err, 'GitHub সাইন ইন করতে সমস্যা হয়েছে।'));
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f5f2] flex flex-col items-center justify-center py-12 px-4 font-sans text-gray-800">
      
      {/* Title outside the card */}
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          সাইন ইন
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Form Card */}
      <div className="max-w-[420px] w-full bg-[#fcfdfe] rounded-2xl p-7 shadow-sm border border-gray-200/60 space-y-5">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1.5">ইমেইল</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#008a45] transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1.5">পাসওয়ার্ড</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#008a45] transition-all shadow-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#008a45] hover:bg-[#00763a] text-white font-bold rounded-xl transition-all shadow text-xs mt-1 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'সাইন ইন'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-gray-400 text-[11px] font-medium">অথবা</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Side-by-Side Social Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-0.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="py-2.5 px-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl transition-all shadow-sm text-[11px] flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="truncate">Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            className="py-2.5 px-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl transition-all shadow-sm text-[11px] flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-gray-600 font-medium pt-1">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-[#008a45] font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>

      </div>

      {/* Back to Home Link */}
      <div className="mt-8">
        <Link href="/" className="text-xs text-gray-500 font-medium hover:text-gray-800 transition-colors">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>

    </main>
  );
}