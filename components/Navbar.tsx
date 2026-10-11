'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseAuthErrorMessage } from '@/lib/firebase';
import { Category, Product } from '@/types';
import PriceTicker from './PriceTicker';

interface NavbarProps {
  categories?: Category[];
  tickerProducts?: Product[];
}

function BanglaDateDisplay() {
  const todayBanglaDate = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <p className="text-xs text-gray-500 font-medium mt-1">
      {todayBanglaDate}
    </p>
  );
}

export default function Navbar({ categories = [], tickerProducts = [] }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    void Promise.resolve()
      .then(() => {
        if (cancelled) return;

        unsubscribe = onAuthStateChanged(getFirebaseAuth(), (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }, (error) => {
          console.error('Navbar auth state listener failed:', error);
          setLoading(false);
        });
      })
      .catch((error: unknown) => {
        console.error(
          'Navbar Firebase initialization failed:',
          getFirebaseAuthErrorMessage(error, 'Firebase চালু করা যায়নি।')
        );
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const defaultCategories = [
    { name: 'চাল', slug: 'chal', icon: '🍚' },
    { name: 'ডাল', slug: 'dal', icon: '🫘' },
    { name: 'তেল', slug: 'tel', icon: '🛢️' },
    { name: 'সবজি', slug: 'sobji', icon: '🥬' },
    { name: 'মাছ', slug: 'mach', icon: '🐟' },
    { name: 'মাংস', slug: 'mangsho', icon: '🍗' },
    { name: 'ডিম-দুধ', slug: 'dim-dui', icon: '🥛' },
    { name: 'মসলা', slug: 'mosla', icon: '🌶️' },
  ];

  const categoryList = categories.length > 0
    ? categories.map((category) => ({
        slug: category.slug,
        name: category.nameBn || category.name || category.slug,
        icon: category.icon || '🛍️',
      }))
    : defaultCategories;

  return (
    <header className="w-full bg-[#f8faf9] border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#008a45] rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
            <Image 
              src="/logo-icon.png" 
              alt="বাজার দর" 
              width={24} 
              height={24} 
              className="brightness-0 invert object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">
              বাজার দর
            </h1>
            <Suspense fallback={<p className="text-xs text-gray-400 mt-1">...</p>}>
              <BanglaDateDisplay />
            </Suspense>
          </div>
        </Link>

        {/* Dynamic Auth Section */}
        <div className="flex items-center gap-[6px]">
          {loading ? (
            <div className="w-24 h-[40px] bg-gray-200/60 animate-pulse rounded-[8px]"></div>
          ) : user ? (
            /* Logged in state */
            <Link
              href="/profile"
              className="h-[40px] px-3 bg-white border border-gray-200/80 rounded-[8px] flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-md bg-[#008a45] text-white flex items-center justify-center font-bold text-xs overflow-hidden relative shrink-0">
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">
                {user.displayName || 'প্রোফাইল'}
              </span>
            </Link>
          ) : (
            /* Logged out state */
            <>
              <Link 
                href="/signin" 
                className="h-[40px] px-[17px] py-[1px] flex items-center justify-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                সাইন ইন
              </Link>
              <Link 
                href="/signup" 
                className="bg-[#008a45] hover:bg-[#00763a] text-white text-sm font-semibold h-[40px] px-[17px] py-[1px] flex items-center justify-center rounded-[8px] shadow-sm transition-all"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-gray-200/60 py-2 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex items-center justify-start gap-6 overflow-x-auto text-sm no-scrollbar">
          {categoryList.map((cat) => {
            const href = `/category/${cat.slug}`;
            const isActive = pathname === href;

            return (
              <Link
                key={cat.slug}
                href={href}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-all font-bold whitespace-nowrap text-xs sm:text-sm ${
                  isActive ? 'text-[#008a45] bg-emerald-50' : 'text-gray-800 hover:text-[#008a45]'
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span className="text-gray-900 font-extrabold">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <PriceTicker products={tickerProducts} />
    </header>
  );
}