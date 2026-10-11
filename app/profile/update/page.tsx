'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UpdateProfilePage() {
  const auth = getFirebaseAuth();
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast.error('ইউজার পাওয়া যায়নি! আবার সাইন ইন করুন।');
      return;
    }

    setUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      
      
      toast.success('তথ্য সফলভাবে আপডেট হয়েছে!');
      
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch {

      toast.error('তথ্য আপডেট করতে ব্যর্থ হয়েছে!');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4 bg-[#f1f5f2]">
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm max-w-md w-full space-y-4">
        <h1 className="text-xl font-bold text-gray-900">তথ্য পরিবর্তন করুন</h1>
        
        <div>
          <label className="text-xs text-gray-500 font-bold block mb-1.5">আপনার নাম</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-xs outline-none focus:border-[#008a45] transition-all"
            placeholder="নতুন নাম লিখুন"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={updating}
          className="w-full py-3 bg-[#008a45] hover:bg-[#00763a] text-white font-bold rounded-xl transition-all shadow text-xs disabled:opacity-50 active:scale-[0.99]"
        >
          {updating ? 'আপডেট হচ্ছে...' : 'তথ্য আপডেট করুন'}
        </button>
      </form>
    </main>
  );
}