export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  duration: number; // in minutes
  watchUrl: string;
}

export interface Anime {
  id: number;
  title:string;
  synopsis: string;
  posterUrl: string;
  bannerUrl: string;
  episodes: Episode[];
  type: 'ONA' | 'TV' | 'Movie';
  totalEpisodes: number;
  currentEpisodes: number;
}