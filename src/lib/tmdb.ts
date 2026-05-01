const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('⚠️  TMDB API key not configured. Set NEXT_PUBLIC_TMDB_API_KEY in .env.local');
}
export const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopularMovies: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchNowPlayingMovies: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  fetchUpcomingMovies: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`,
  fetchRecentTopRated: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=200&primary_release_date.gte=2023-01-01`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchThrillerMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=53`,
  fetchSciFiMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchFamilyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10751`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
  genre_ids: number[];
}

export async function getMovies(url: string): Promise<Movie[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(trimmedQuery)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.results || []).filter((item: Movie) => item.media_type === 'movie' || item.media_type === 'tv');
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getMovieDetails(id: number, type: 'movie' | 'tv'): Promise<{ videos?: { results: Array<{ type: string; key: string }> } }> {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`);
    if (!response.ok) {
      throw new Error(`TMDB API error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching ${type} ${id}:`, error.message);
    } else {
      console.error(`Error fetching ${type} ${id}:`, String(error));
    }
    return {};
  }
}

export async function getGenres(): Promise<{ id: number; name: string }[]> {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}
