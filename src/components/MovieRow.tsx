'use client';

import { useRef, useState } from 'react';
import { Movie } from '@/lib/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow = ({ title, movies, onMovieClick }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const getMovieTitle = (movie: Movie) => movie.title || movie.name || 'Untitled';

  const getMovieYear = (movie: Movie) => movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || '';

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-40 space-y-0.5 md:space-y-2 px-4 md:px-12">
      <h2 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        />

        <div
          ref={rowRef}
          className="flex items-center space-x-0.5 overflow-x-scroll no-scrollbar md:space-x-2.5 md:p-2"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="group relative flex min-w-45 cursor-pointer flex-col overflow-hidden rounded-md bg-[#181818] transition duration-200 ease-out md:min-w-65 md:hover:scale-105"
            >
              {(movie.backdrop_path || movie.poster_path) ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                  className="h-28 w-full object-cover md:h-36"
                  alt={getMovieTitle(movie)}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center bg-gray-700 md:h-36">
                  <span className="text-gray-400 text-xs text-center px-2">No image</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/80 to-transparent px-3 pb-2 pt-8">
                <p className="line-clamp-2 text-sm font-semibold leading-tight text-white drop-shadow-md">
                  {getMovieTitle(movie)}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-200">
                  <span>{getMovieYear(movie)}</span>
                  <span className="rounded-full bg-red-600/90 px-2 py-0.5 uppercase tracking-[0.18em] text-white">
                    {movie.media_type || 'movie'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
};

export default MovieRow;
