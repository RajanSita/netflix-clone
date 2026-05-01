'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const Navbar = ({ searchQuery = '', onSearchQueryChange = () => {} }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12 lg:py-6 ${isScrolled ? 'bg-[#141414]' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/">
          <span className="text-2xl font-black tracking-[0.25em] text-[#e50914] md:text-4xl md:tracking-[0.35em]">
            NETFLIX
          </span>
        </Link>

        <ul className="hidden space-x-4 md:flex">
          <li className="navLink cursor-default font-semibold text-white hover:text-white">
            <Link href="/">Home</Link>
          </li>
          <li className="navLink text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">
            <Link href="/my-list">My List</Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <div className="relative flex items-center">
          {isSearchOpen && (
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search movies or shows"
              className="mr-3 w-44 rounded border border-white/20 bg-black/80 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:border-[#e50914] sm:w-56"
            />
          )}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setIsSearchOpen((current) => !current)}
            className="flex items-center justify-center"
          >
            <Search className="h-6 w-6 cursor-pointer transition hover:text-[#e50914]" />
          </button>
        </div>
        <p className="hidden lg:inline">Kids</p>
        <Bell className="h-6 w-6" />
        <button onClick={handleLogout} className="flex items-center space-x-2">
          <LogOut className="h-6 w-6 cursor-pointer" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
