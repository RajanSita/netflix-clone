'use client';

import Image from 'next/image';
import { Movie } from '@/lib/tmdb';

interface BillboardProps {
  movie: Movie | null;
}

const Billboard = ({ movie }: BillboardProps) => {
  if (!movie) return <div className="h-[95vh] bg-black" />;

  return (
    <div className="relative h-[95vh] w-full">
      <div className="absolute top-0 left-0 h-[95vh] w-full">
        {movie.backdrop_path || movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title || movie.name || 'Featured movie'}
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-60"
          />
        ) : (
          <div className="h-full w-full bg-gray-900" />
        )}
      </div>

      <div className="absolute bottom-0 h-32 w-full bg-linear-to-t from-[#141414] to-transparent" />
    </div>
  );
};

export default Billboard;
