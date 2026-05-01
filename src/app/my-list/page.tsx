'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Movie } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase';
import InfoModal from '@/components/InfoModal';
import { useAuth } from '@/hooks/useAuth';

export default function MyListPage() {
  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const fetchList = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_movies')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching list:", error);
        return;
      }

      if (data) {
        setList(data.map((item: { movie_data: Movie }) => item.movie_data));
      }
    };

    fetchList();
  }, [user, supabase]);

  if (authLoading || !user) return <div className="h-screen bg-black flex items-center justify-center">Loading...</div>;

  return (
    <div className="relative h-screen bg-[#141414]">
      <Navbar />
      <main className="px-4 pt-24 lg:px-12">
        <h1 className="text-2xl font-semibold text-white md:text-4xl">My List</h1>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {list.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="relative h-28 cursor-pointer transition duration-200 ease-out md:h-36 md:hover:scale-105 group"
            >
              {(movie.backdrop_path || movie.poster_path) ? (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                    className="rounded-sm object-cover md:rounded h-full w-full"
                    alt={movie.title || movie.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-sm md:rounded transition-all" />
                  <div className="absolute inset-0 flex items-end justify-start p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm md:rounded">
                    <p className="text-xs text-white font-semibold truncate">{movie.title || movie.name}</p>
                  </div>
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-700 rounded-sm md:rounded">
                  <span className="text-gray-400 text-xs text-center px-2 line-clamp-3">{movie.title || movie.name || 'No image'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-10 text-gray-500">You haven&apos;t added any movies to your list yet.</p>
        )}
      </main>
      <InfoModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
