'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseAuthErrorMessage } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.displayName || '');
        } else {
          router.push('/signin');
        }
        setLoading(false);
      });
    }).catch((authError: unknown) => {
      if (!cancelled) {
        setError(getFirebaseAuthErrorMessage(authError, 'Firebase চালু করা যায়নি।'));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  // Name Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setUpdating(true);
    try {
      const currentUser = getFirebaseAuth().currentUser;
      if (!currentUser) return;
      await updateProfile(currentUser, { displayName: name });
      setUser({ ...currentUser });
      toast.success('নাম সফলভাবে আপডেট হয়েছে!');
    } catch {
      toast.error('নাম আপডেট করতে সমস্যা হয়েছে!');
    } finally {
      setUpdating(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await signOut(getFirebaseAuth());
      toast.success('সাইন আউট সফল হয়েছে!');
      router.push('/signin');
    } catch {
      toast.error('সাইন আউট করতে সমস্যা হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f2] flex items-center justify-center text-xs font-semibold text-gray-500">
        লোডিং হচ্ছে...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f5f2] py-10 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* User Card */}
        <div className="bg-[#fcfdfe] rounded-2xl p-6 shadow-sm border border-gray-200/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden relative border border-gray-100 shrink-0">
              {user?.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#008a45] text-white flex items-center justify-center font-bold text-xl">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-gray-900">
                {user?.displayName || 'ব্যবহারকারী'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            ← সাইন আউট
          </button>
        </div>

        {/* Update Form Card */}
        <div className="bg-[#fcfdfe] rounded-2xl p-6 shadow-sm border border-gray-200/60 space-y-4">
          <h3 className="text-sm font-bold text-gray-900">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5">নাম</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#008a45] transition-all shadow-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-[#008a45] hover:bg-[#00763a] text-white font-bold rounded-xl transition-all shadow text-xs disabled:opacity-50 active:scale-[0.99]"
            >
              {updating ? 'আপডেট হচ্ছে...' : 'আপডেট'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}