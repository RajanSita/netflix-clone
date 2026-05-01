'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieRow from '@/components/MovieRow';
import InfoModal from '@/components/InfoModal';
import { Movie, requests, getMovies, searchMovies } from '@/lib/tmdb';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [netflixOriginals, setNetflixOriginals] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [documentaries, setDocumentaries] = useState<Movie[]>([]);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [billboardMovie, setBillboardMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          netflixOriginalsData,
          topRatedData,
          actionMoviesData,
          comedyMoviesData,
          horrorMoviesData,
          romanceMoviesData,
          documentariesData,
        ] = await Promise.all([
          getMovies(requests.fetchTrending),
          getMovies(requests.fetchNetflixOriginals),
          getMovies(requests.fetchTopRated),
          getMovies(requests.fetchActionMovies),
          getMovies(requests.fetchComedyMovies),
          getMovies(requests.fetchHorrorMovies),
          getMovies(requests.fetchRomanceMovies),
          getMovies(requests.fetchDocumentaries),
        ]);

        setTrending(trendingData);
        setNetflixOriginals(netflixOriginalsData);
        setTopRated(topRatedData);
        setActionMovies(actionMoviesData);
        setComedyMovies(comedyMoviesData);
        setHorrorMovies(horrorMoviesData);
        setRomanceMovies(romanceMoviesData);
        setDocumentaries(documentariesData);

        // Safely pick random movie for billboard after data is fetched on client
        if (trendingData.length > 0) {
          setBillboardMovie(trendingData[Math.floor(Math.random() * trendingData.length)]);
        }
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
              <MovieRow title="Trending Now" movies={trending} onMovieClick={setSelectedMovie} />
              <MovieRow title="Netflix Originals" movies={netflixOriginals} onMovieClick={setSelectedMovie} />
              <MovieRow title="Top Rated" movies={topRated} onMovieClick={setSelectedMovie} />
              <MovieRow title="Action Thrillers" movies={actionMovies} onMovieClick={setSelectedMovie} />
              <MovieRow title="Comedies" movies={comedyMovies} onMovieClick={setSelectedMovie} />
              <MovieRow title="Scary Movies" movies={horrorMovies} onMovieClick={setSelectedMovie} />
              <MovieRow title="Romance Movies" movies={romanceMovies} onMovieClick={setSelectedMovie} />
              <MovieRow title="Documentaries" movies={documentaries} onMovieClick={setSelectedMovie} />
            </>
          )}
        </section>
      </main>

      <InfoModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
