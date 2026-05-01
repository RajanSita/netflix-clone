'use client';

import { useEffect, useState } from 'react';
import { Movie, getMovieDetails, getGenres } from '@/lib/tmdb';
import { X, Plus, ThumbsUp, Check } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { createClient } from '@/lib/supabase';

interface InfoModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const InfoModal = ({ movie, onClose }: InfoModalProps) => {
  const [trailer, setTrailer] = useState('');
  const [addedToList, setAddedToList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [supabase] = useState(() => createClient());

  const getLikedStorageKey = (userId: string) => `liked_movies:${userId}`;

  const readLikedMovieIds = (userId: string) => {
    if (typeof window === 'undefined') return [] as number[];

    try {
      const rawValue = window.localStorage.getItem(getLikedStorageKey(userId));
      const parsedValue = rawValue ? JSON.parse(rawValue) : [];
      return Array.isArray(parsedValue) ? parsedValue.filter((value) => typeof value === 'number') : [];
    } catch {
      return [] as number[];
    }
  };

  const writeLikedMovieIds = (userId: string, ids: number[]) => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(getLikedStorageKey(userId), JSON.stringify(ids));
  };

  useEffect(() => {
    if (!movie) return;

    setAddedToList(false);
    setLiked(false);

    const fetchMovieData = async () => {
      try {
        const [details, genreList] = await Promise.all([
          getMovieDetails(movie.id, movie.media_type === 'tv' ? 'tv' : 'movie'),
          getGenres()
        ]);

        if (details?.videos?.results) {
          const index = details.videos.results.findIndex((element: { type: string }) => element.type === 'Trailer');
          setTrailer(details.videos.results[index]?.key || '');
        }
        
        setGenres(genreList);

        // Check if already in list
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const likedMovieIds = readLikedMovieIds(session.user.id);
          setLiked(likedMovieIds.includes(movie.id));

          const { data: saved } = await supabase
            .from('saved_movies')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('movie_id', movie.id)
            .maybeSingle();
          
          if (saved) setAddedToList(true);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [movie, supabase]);

  const handleList = async () => {
    if (!movie) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert('Please sign in to add to your list');

      if (addedToList) {
        const { error } = await supabase
          .from('saved_movies')
          .delete()
          .eq('user_id', session.user.id)
          .eq('movie_id', movie!.id);
        if (error) throw error;
        setAddedToList(false);
      } else {
        const { error } = await supabase.from('saved_movies').insert({
          user_id: session.user.id,
          movie_id: movie!.id,
          movie_data: movie,
        });
        if (error) throw error;
        setAddedToList(true);
      }
    } catch (error) {
      console.error('Error updating list:', error);
      alert('Failed to update your list. Please try again.');
    }
  };

  const handleLike = async () => {
    if (!movie) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert('Please sign in to like movies');

      const likedMovieIds = readLikedMovieIds(session.user.id);
      const isCurrentlyLiked = likedMovieIds.includes(movie.id);
      const nextLikedMovieIds = isCurrentlyLiked
        ? likedMovieIds.filter((id) => id !== movie.id)
        : [...likedMovieIds, movie.id];

      writeLikedMovieIds(session.user.id, nextLikedMovieIds);
      setLiked(!isCurrentlyLiked);
    } catch (error) {
      console.error('Error updating like state:', error);
      alert('Failed to update like state. Please try again.');
    }
  };

  if (!movie) return null;

  const movieGenres = genres
    .filter((genre) => movie.genre_ids.includes(genre.id))
    .map((genre) => genre.name);

  return (
    <Dialog.Root open={!!movie} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-md bg-[#181818] outline-none max-h-[90vh] overflow-y-auto"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">
            {movie.title || movie.name}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {movie.overview || 'Movie details dialog'}
          </Dialog.Description>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-40 flex h-9 w-9 items-center justify-center rounded-full border-none bg-[#181818] hover:bg-[#262626]"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative pt-[56.25%] bg-[#181818]">
            {trailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailer}`}
                className="absolute top-0 left-0 h-full w-full"
                title={`${movie.title || movie.name} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                className="absolute top-0 left-0 h-full w-full object-cover"
                alt={movie.title || movie.name}
                onError={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                }}
              />
            )}
            <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
              <div className="flex space-x-2">
                <button
                  type="button"
                  aria-label={addedToList ? 'Remove from wish list' : 'Add to wish list'}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-600 bg-[#2a2a2a]/60 transition hover:border-white hover:bg-white/10"
                  onClick={handleList}
                >
                  {addedToList ? <Check className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
                </button>
                <button
                  type="button"
                  aria-label={liked ? 'Unlike' : 'Like'}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${liked ? 'border-green-400 bg-green-500/20 text-green-300' : 'border-gray-600 bg-[#2a2a2a]/60 hover:border-white hover:bg-white/10'}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-b-md bg-[#181818] px-10 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {movie.title || movie.name}
            </h2>
            
            <div className="flex space-x-16">
              <div className="flex-1 space-y-6 text-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <p className="font-semibold text-green-400">
                    {(movie.vote_average * 10).toFixed(0)}% Match
                  </p>
                  <p className="font-light text-gray-300">
                    {movie.release_date || movie.first_air_date}
                  </p>
                  <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                    HD
                  </div>
                </div>

                <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                  <p className="text-gray-300 leading-relaxed">{movie.overview || 'No description available'}</p>
                  <div className="flex flex-col space-y-3 text-sm shrink-0">
                    <div>
                      <span className="text-gray-400">Genres:</span>
                      <p className="text-gray-300">{movieGenres.length > 0 ? movieGenres.join(', ') : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Media type:</span>
                      <p className="text-gray-300">{movie.media_type || 'Movie'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InfoModal;
