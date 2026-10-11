'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseAuthErrorMessage } from '@/lib/firebase';
import { Category, Product } from '@/types';
import toast from 'react-hot-toast';
import PriceTicker from './PriceTicker';

interface NavbarProps {
  categories?: Category[];
  tickerProducts?: Product[];
}

const categoryIcons: Record<string, string> = {
  chal: '🍚',
  চাল: '🍚',
  dal: '🫘',
  ডাল: '🫘',
  tel: '🛢️',
  তেল: '🛢️',
  sobji: '🥬',
  সবজি: '🥬',
  mach: '🐟',
  মাছ: '🐟',
  mangsho: '🍗',
  mangso: '🍗',
  মাংস: '🍗',
  'dim-dui': '🥛',
  'dim-dudh': '🥛',
  'ডিম-দুধ': '🥛',
  mosla: '🌶️',
  মসলা: '🌶️',
};

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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    void Promise.resolve()
      .then(() => {
        if (cancelled) return;

        unsubscribe = onAuthStateChanged(
          getFirebaseAuth(),
          (currentUser) => {
            setUser(currentUser);
            setLoading(false);
          },
          (error) => {
            console.error('Navbar auth state listener failed:', error);
            setLoading(false);
          }
        );
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(getFirebaseAuth());
      setDropdownOpen(false);
      toast.success('সাইন আউট সফল হয়েছে!');
      router.push('/signin');
    } catch {
      toast.error('সাইন আউট করতে সমস্যা হয়েছে!');
    }
  };

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
        icon:
          categoryIcons[category.slug.trim().toLowerCase()] ||
          categoryIcons[(category.nameBn || category.name || '').trim()] ||
          category.icon ||
          '🛍️',
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
        <div className="flex items-center gap-[6px] relative" ref={dropdownRef}>
          {loading ? (
            <div className="w-24 h-[40px] bg-gray-200/60 animate-pulse rounded-[8px]"></div>
          ) : user ? (
            /* Logged in state with Dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative shrink-0 border border-gray-200">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#008a45] text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'ইউজার'}
                </span>
                <span className="text-[10px] text-gray-500">▾</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50 space-y-3 font-sans">
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.displayName || 'ব্যবহারকারী'}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span>👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <span>↩</span>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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