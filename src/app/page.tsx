'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieRow from '@/components/MovieRow';
import InfoModal from '@/components/InfoModal';
import { Movie, requests, getMovies, searchMovies } from '@/lib/tmdb';
import { useAuth } from '@/hooks/useAuth';

type RowConfig = {
  title: string;
  movies: Movie[];
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [displayRows, setDisplayRows] = useState<RowConfig[]>([]);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [billboardMovie, setBillboardMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          netflixOriginalsData,
          popularMoviesData,
          nowPlayingMoviesData,
          upcomingMoviesData,
          recentTopRatedMoviesData,
          topRatedData,
          actionMoviesData,
          comedyMoviesData,
          horrorMoviesData,
          thrillerMoviesData,
          scifiMoviesData,
          romanceMoviesData,
          familyMoviesData,
          documentariesData,
        ] = await Promise.all([
          getMovies(requests.fetchTrending),
          getMovies(requests.fetchNetflixOriginals),
          getMovies(requests.fetchPopularMovies),
          getMovies(requests.fetchNowPlayingMovies),
          getMovies(requests.fetchUpcomingMovies),
          getMovies(requests.fetchRecentTopRated),
          getMovies(requests.fetchTopRated),
          getMovies(requests.fetchActionMovies),
          getMovies(requests.fetchComedyMovies),
          getMovies(requests.fetchHorrorMovies),
          getMovies(requests.fetchThrillerMovies),
          getMovies(requests.fetchSciFiMovies),
          getMovies(requests.fetchRomanceMovies),
          getMovies(requests.fetchFamilyMovies),
          getMovies(requests.fetchDocumentaries),
        ]);

        const shuffledTrending = shuffle(trendingData);
        const shuffledNetflixOriginals = shuffle(netflixOriginalsData);
        const shuffledPopularMovies = shuffle(popularMoviesData);
        const shuffledNowPlayingMovies = shuffle(nowPlayingMoviesData);
        const shuffledUpcomingMovies = shuffle(upcomingMoviesData);
        const shuffledRecentTopRatedMovies = shuffle(recentTopRatedMoviesData);
        const shuffledTopRated = shuffle(topRatedData);
        const shuffledActionMovies = shuffle(actionMoviesData);
        const shuffledComedyMovies = shuffle(comedyMoviesData);
        const shuffledHorrorMovies = shuffle(horrorMoviesData);
        const shuffledThrillerMovies = shuffle(thrillerMoviesData);
        const shuffledScifiMovies = shuffle(scifiMoviesData);
        const shuffledRomanceMovies = shuffle(romanceMoviesData);
        const shuffledFamilyMovies = shuffle(familyMoviesData);
        const shuffledDocumentaries = shuffle(documentariesData);

        const allMovies = shuffle([
          ...shuffledTrending,
          ...shuffledNetflixOriginals,
          ...shuffledPopularMovies,
          ...shuffledNowPlayingMovies,
          ...shuffledUpcomingMovies,
          ...shuffledRecentTopRatedMovies,
          ...shuffledTopRated,
          ...shuffledActionMovies,
          ...shuffledComedyMovies,
          ...shuffledHorrorMovies,
          ...shuffledThrillerMovies,
          ...shuffledScifiMovies,
          ...shuffledRomanceMovies,
          ...shuffledFamilyMovies,
          ...shuffledDocumentaries,
        ]);

        if (allMovies.length > 0) {
          setBillboardMovie(allMovies[0]);
        }

        setDisplayRows(
          shuffle([
            { title: 'Trending Now', movies: shuffledTrending },
            { title: 'Netflix Originals', movies: shuffledNetflixOriginals },
            { title: 'Popular Movies', movies: shuffledPopularMovies },
            { title: 'Now Playing', movies: shuffledNowPlayingMovies },
            { title: 'Upcoming Releases', movies: shuffledUpcomingMovies },
            { title: 'Recent Top Rated', movies: shuffledRecentTopRatedMovies },
            { title: 'Top Rated', movies: shuffledTopRated },
            { title: 'Action Thrillers', movies: shuffledActionMovies },
            { title: 'Comedies', movies: shuffledComedyMovies },
            { title: 'Scary Movies', movies: shuffledHorrorMovies },
            { title: 'Thrillers', movies: shuffledThrillerMovies },
            { title: 'Sci-Fi Adventures', movies: shuffledScifiMovies },
            { title: 'Romance Movies', movies: shuffledRomanceMovies },
            { title: 'Family Picks', movies: shuffledFamilyMovies },
            { title: 'Documentaries', movies: shuffledDocumentaries },
          ])
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const runSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    };

    const timeout = window.setTimeout(() => {
      runSearch();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  if (authLoading || !user) return <div className="h-screen bg-black flex items-center justify-center">Loading...</div>;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="relative h-screen bg-linear-to-b from-gray-900/10 to-[#141414] lg:h-[140vh]">
      <Navbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
      <main className="relative pb-24 lg:space-y-24">
        {!isSearching && <Billboard movie={billboardMovie} />}
        
        <section className={`${isSearching ? 'pt-24 md:pt-28' : ''} md:space-y-24`}>
          {isSearching ? (
            <MovieRow title={`Search Results for "${searchQuery}"`} movies={searchResults} onMovieClick={setSelectedMovie} />
          ) : (
            <>
              {displayRows.map((row) => (
                <MovieRow key={row.title} title={row.title} movies={row.movies} onMovieClick={setSelectedMovie} />
              ))}
            </>
          )}
        </section>
      </main>

      <InfoModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
