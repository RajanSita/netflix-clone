'use client';

import { Movie } from '@/lib/tmdb';
import { Info, Play } from 'lucide-react';

interface BillboardProps {
  movie: Movie | null;
}

const Billboard = ({ movie }: BillboardProps) => {
  if (!movie) return <div className="h-[95vh] bg-black" />;

  return (
    <div className="relative h-[95vh] w-full">
      <div className="absolute top-0 left-0 h-[95vh] w-full">
        {movie.backdrop_path || movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title || movie.name}
            className="h-full w-full object-cover brightness-[60%]"
            onError={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-900" />
        )}
      </div>

      <div className="absolute top-[30%] ml-4 md:ml-12 z-10">
        <h1 className="text-2xl font-bold md:text-5xl lg:text-7xl text-white">
          {movie.title || movie.name || 'Untitled'}
        </h1>
        <p className="mt-4 max-w-xs text-xs text-gray-200 md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl leading-relaxed">
          {movie.overview}
        </p>

        <div className="mt-6 flex items-center space-x-3">
          <button className="flex items-center rounded bg-white px-5 py-2 text-black transition hover:bg-[#e6e6e6] md:px-8 md:py-2.5 md:text-xl">
            <Play className="mr-2 h-4 w-4 fill-black md:h-7 md:w-7" />
            Play
          </button>
          <button className="flex items-center rounded bg-[gray]/70 px-5 py-2 text-white transition hover:bg-[gray]/40 md:px-8 md:py-2.5 md:text-xl">
            <Info className="mr-2 h-5 w-5 md:h-8 md:w-8" />
            More Info
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-[#141414] to-transparent" />
    </div>
  );
};

export default Billboard;
