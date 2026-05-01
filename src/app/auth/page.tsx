'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.28),_transparent_35%),linear-gradient(180deg,_#000_0%,_#111_45%,_#000_100%)]" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#e50914]/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>
      <Link href="/" className="absolute left-4 top-4 md:left-10 md:top-6">
        <span className="text-3xl font-black tracking-[0.25em] text-[#e50914] md:text-5xl md:tracking-[0.35em]">
          NETFLIX
        </span>
      </Link>

      <form
        onSubmit={handleAuth}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold text-white">{isLogin ? 'Sign In' : 'Sign Up'}</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded bg-[#333] px-5 py-3.5 outline-none focus:bg-[#454545]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded bg-[#333] px-5 py-3.5 outline-none focus:bg-[#454545]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p className="text-sm text-orange-500">{error}</p>}

        <button
          className="w-full rounded bg-[#e50914] py-3.5 font-semibold text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>

        <div className="text-[gray]">
          {isLogin ? "New to Netflix? " : "Already have an account? "}
          <button
            type="button"
            className="cursor-pointer text-white hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up now' : 'Sign in now'}
          </button>
        </div>
      </form>
    </div>
  );
}
