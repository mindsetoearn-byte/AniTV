import type { Anime } from '../types';

const placeholderWatchUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export const mockFeaturedAnime: Anime = {
  id: 1,
  title: 'Arifureta: From Commonplace to World\'s Strongest Season 3',
  synopsis: 'Hajime Nagumo and his high school class are suddenly summoned to a fantastical land as heroes. But while most of his classmates have powerful stats and abilities, Hajime is a "Synergist," with only a single transmutation skill.',
  posterUrl: 'https://picsum.photos/seed/arifureta/500/750',
  bannerUrl: 'https://picsum.photos/seed/arifuretabanner/1280/720',
  episodes: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}: The Monster of the Abyss`,
    duration: 24,
    watchUrl: placeholderWatchUrl,
  })),
  type: 'TV',
  totalEpisodes: 12,
  currentEpisodes: 7
};

export const mockAnimeData: Anime[] = [
  {
    id: 2,
    title: 'The Laid Off Demon King',
    synopsis: 'After centuries of rule, the demon king is laid off due to budget cuts in the netherworld. He must now navigate the human world and find a new job, all while hiding his true identity.',
    posterUrl: 'https://picsum.photos/seed/demonking/500/750',
    bannerUrl: 'https://picsum.photos/seed/demonkingbanner/1280/720',
    episodes: Array.from({ length: 26 }, (_, i) => ({
      id: 100 + i,
      episodeNumber: i + 1,
      title: `New Life, New Problems - Part ${i + 1}`,
      duration: 20,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'ONA',
    totalEpisodes: 26,
    currentEpisodes: 10
  },
  {
    id: 3,
    title: 'Tales of Herding Gods',
    synopsis: 'A young boy, abandoned and raised by mythical beasts, embarks on a journey to discover his origins and his place in a world where gods and mortals collide.',
    posterUrl: 'https://picsum.photos/seed/herdingods/500/750',
    bannerUrl: 'https://picsum.photos/seed/herdingods_banner/1280/720',
    episodes: Array.from({ length: 26 }, (_, i) => ({
      id: 200 + i,
      episodeNumber: i + 1,
      title: `The Shepherd's Path - Chapter ${i + 1}`,
      duration: 15,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'ONA',
    totalEpisodes: 26,
    currentEpisodes: 24
  },
  {
    id: 4,
    title: 'My Stepsister is My Ex-Girlfriend',
    synopsis: 'A boy and a girl who dated in middle school and broke up on graduation now find themselves as stepsiblings. They must navigate their new family life while keeping their past relationship a secret.',
    posterUrl: 'https://picsum.photos/seed/stepsister/500/750',
    bannerUrl: 'https://picsum.photos/seed/stepsister_banner/1280/720',
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: 300 + i,
      episodeNumber: i + 1,
      title: `An Awkward Reunion: Episode ${i + 1}`,
      duration: 24,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'TV',
    totalEpisodes: 12,
    currentEpisodes: 12
  },
  {
    id: 5,
    title: 'Cyberpunk: Edgerunners',
    synopsis: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
    posterUrl: 'https://picsum.photos/seed/cyberpunk/500/750',
    bannerUrl: 'https://picsum.photos/seed/cyberpunk_banner/1280/720',
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: 400 + i,
      episodeNumber: i + 1,
      title: `Night City Blues - Gig ${i + 1}`,
      duration: 25,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'ONA',
    totalEpisodes: 10,
    currentEpisodes: 10
  },
  {
    id: 6,
    title: 'Solo Leveling',
    synopsis: 'In a world where hunters with magical abilities must battle deadly monsters to protect humanity, a notoriously weak hunter gains a unique power to level up, embarking on a journey to become the strongest.',
    posterUrl: 'https://picsum.photos/seed/sololeveling/500/750',
    bannerUrl: 'https://picsum.photos/seed/sololeveling_banner/1280/720',
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: 500 + i,
      episodeNumber: i + 1,
      title: `The Weakest Hunter - Rank Up ${i + 1}`,
      duration: 24,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'TV',
    totalEpisodes: 12,
    currentEpisodes: 12
  },
  {
    id: 7,
    title: 'Mushoku Tensei: Jobless Reincarnation',
    synopsis: 'A 34-year-old underachiever is reincarnated into a magical world as a newborn baby. Retaining his memories, he resolves to live his new life to the fullest, mastering magic and swordsmanship from a young age.',
    posterUrl: 'https://picsum.photos/seed/mushoku/500/750',
    bannerUrl: 'https://picsum.photos/seed/mushoku_banner/1280/720',
    episodes: Array.from({ length: 23 }, (_, i) => ({
      id: 600 + i,
      episodeNumber: i + 1,
      title: `A New Beginning: Chapter ${i + 1}`,
      duration: 23,
      watchUrl: placeholderWatchUrl,
    })),
    type: 'TV',
    totalEpisodes: 23,
    currentEpisodes: 23
  }
];