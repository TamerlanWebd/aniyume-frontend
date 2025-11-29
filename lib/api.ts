import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v2';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export interface Anime {
    id: number;
    anilist_id: number;
    title_romaji: string;
    title_english: string;
    title_native: string;
    description: string;
    cover_image_large: string;
    cover_image_medium: string;
    banner_image: string;
    format: string;
    status: string;
    episodes: number;
    duration: number;
    genres: string[];
    average_score: number;
    popularity: number;
    last_synced_at: string;
}

export const fetchAnime = async (id: string): Promise<Anime> => {
    const response = await api.get<{ data: Anime }>(`/anime/${id}`);
    return response.data.data;
};
