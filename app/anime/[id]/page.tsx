'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FaPlay,
  FaBookmark,
  FaPlus,
  FaShareAlt,
  FaStar,
  FaUserCircle,
  FaPaperPlane,
  FaBold,
  FaItalic,
  FaUnderline,
  FaQuoteRight,
  FaListUl,
  FaSmile
} from 'react-icons/fa';
import SeriesDropdown from '@/components/SeriesDropdown';
import { fetchAnimeById } from '@/lib/api/animeApi';
import { Anime } from '@/lib/api/types';

interface Episode {
  num: number;
  title: string;
  videoUrl: string;
}

export default function AnimeViewPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [comments, setComments] = useState<Array<{ name: string, text: string }>>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');

  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const numericId = parseInt(id as string, 10);
        if (isNaN(numericId)) {
          setError('Invalid anime ID');
          setLoading(false);
          return;
        }
        console.log('🔄 Fetching anime by ID:', numericId);
        const response = await fetchAnimeById(numericId);
        console.log('📦 Anime detail response:', response);
        console.log('📊 Anime detail data:', response.data);

        const animeData = response.data.data || response.data;
        console.log('🎬 Anime object:', animeData);
        setAnime(animeData);
        // Mock episodes for now as they are not in DB yet
        setCurrentEpisode({ num: 1, title: 'Серия 1', videoUrl: 'https://www.youtube.com/embed/D9iTQRB4XRk?si=xyz' });
      } catch (err) {
        console.error('❌ Failed to load anime:', err);
        setError('Failed to load anime');
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
    generateCaptcha();
  }, [id]);

  const generateCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  const handleCommentSubmit = () => {
    if (!newCommentName.trim() || !newCommentText.trim() || newCommentText.trim().length < 10) {
      alert("Пожалуйста, введите ваше имя и комментарий (минимум 10 знаков).");
      return;
    }
    if (captchaInput !== captchaText) {
      alert("Неправильный код с картинки.");
      generateCaptcha();
      setCaptchaInput('');
      return;
    }
    setComments([...comments, { name: newCommentName, text: newCommentText }]);
    setNewCommentName('');
    setNewCommentText('');
    setCaptchaInput('');
    generateCaptcha();
  };

  if (!anime) {
    return <div className="min-h-screen bg-white text-black flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <div className="relative w-full min-h-[85vh] md:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={anime.cover_image || anime.banner_image || '/images/anime.jpg'}
            alt={anime.title_romaji}
            className="w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/60 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-[55%] h-full bg-teal-200/20 blur-[120px] opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-20 pt-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg tracking-wide">
              {anime.title_romaji}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-700 mb-6">
              <span className="bg-gray-200 text-black px-2 py-0.5 rounded border border-gray-900">
                16+
              </span>

              <ul className="flex items-center gap-2 list-none">
                {anime.genres?.map((genre: any, i: number) => (
                  <li key={i} className="flex items-center">
                    {i > 0 && <span className="mr-2 text-gray-900">•</span>}
                    <a href="#" className="hover:underline hover:text-black transition-colors">
                      {typeof genre === 'string' ? genre : genre.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-1 ml-2">
                {[...Array(4)].map((_, i) => <FaStar key={i} className="text-amber-400 text-sm hover:text-amber-600 transition-colors " />)}
                <FaStar className="text-gray-700 text-sm" />
                <span className="ml-1 text-gray-800 font-semibold">Средний рейтинг: {anime.average_score ? (anime.average_score / 10).toFixed(1) : 'N/A'} ({anime.popularity || 0})</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <button className="bg-teal-400 hover:bg-teal-400 text-black text-lg font-bold py-3 px-8 rounded flex items-center gap-3 transition transform hover:scale-105">
                <FaPlay className="text-sm" /> СМОТРЕТЬ
              </button>

              <div className="flex gap-3">
                <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-400 rounded text-gray-700 hover:border-black hover:text-black transition bg-white/30 backdrop-blur-sm">
                  <FaBookmark />
                </button>
                <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-400 rounded text-gray-700 hover:border-black hover:text-black transition bg-white/30 backdrop-blur-sm">
                  <FaPlus />
                </button>
                <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-400 rounded text-gray-700 hover:border-black hover:text-black transition bg-white/30 backdrop-blur-sm">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm md:text-[15px] leading-relaxed">
              <div>
                <p className="mb-4 text-black drop-shadow-md">
                  {anime.description?.replace(/<[^>]*>?/gm, '')}
                </p>
                <button className="text-teal-400 font-bold hover:underline">
                  РАЗВЕРНУТЬ
                </button>
              </div>

              <div className="text-gray-800 text-xs md:text-sm space-y-3 font-medium">
                <p>
                  <span className="text-gray-800 font-semibold">Аудио:</span> {anime.format}
                </p>
                <p>
                  <span className="text-gray-800 font-semibold">Субтитры:</span> {anime.status}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-10">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-black">Плеер</h2>
            <div className="w-64">
              <SeriesDropdown
                series={['Серия 1', 'Серия 2', 'Серия 3']}
                onSelect={(title: string) => {
                  console.log('Selected', title);
                }}
              />
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-300 bg-white">
            {currentEpisode && (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={currentEpisode.videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Серия ${currentEpisode.num}`}>
              </iframe>
            )}
          </div>
        </div>

        <hr className="border-gray-300 mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-black border-l-4 border-teal-400 pl-3">
              Оставить комментарий
            </h2>

            <div className="bg-gray-100 p-6 rounded-xl shadow-lg border border-gray-300">
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-3 rounded bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
                  placeholder="Ваше имя"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                />
              </div>

              <div className="border border-gray-400 rounded overflow-hidden mb-4">
                <div className="flex bg-white p-2 border-b border-gray-400 gap-1">
                  {[FaBold, FaItalic, FaUnderline, FaSmile, FaQuoteRight, FaListUl].map((Icon, idx) => (
                    <button key={idx} className="p-2 hover:bg-gray-200 rounded text-gray-700 transition">
                      <Icon />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 h-32 resize-y bg-white text-black placeholder-gray-500 focus:outline-none"
                  placeholder="Написать комментарий..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <input
                  type="text"
                  className="grow w-full p-3 rounded bg-white border border-gray-400 text-black focus:outline-none focus:border-teal-400"
                  placeholder="Код с картинки"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />
                <div
                  className="bg-gray-300 rounded flex items-center justify-center select-none shrink-0"
                  style={{
                    width: '120px',
                    height: '50px',
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='50'><rect width='100%' height='100%' fill='%23e0e0e0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='cursive' font-size='28px' fill='%234a4a4a' transform='rotate(${Math.random() * 10 - 5}, 60, 25)'>${captchaText}</text></svg>")`,
                  }}
                >
                </div>
              </div>

              <button
                className="w-full bg-teal-400 hover:bg-teal-400 text-white font-bold py-3 rounded transition shadow-lg hover:shadow-orange-500/20"
                onClick={handleCommentSubmit}>
                Отправить
              </button>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4 text-gray-700">
                Комментарии ({comments.length})
              </h3>
              <div className="space-y-4">
                {comments.length === 0 && (
                  <p className="text-gray-500 italic">Пока нет комментариев.</p>
                )}
                {comments.map((c, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-100 rounded-xl border border-gray-300">
                    <FaUserCircle className="text-teal-400 w-10 h-10 shrink-0" />
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="font-bold text-black">{c.name}</p>
                        <span className="text-xs text-gray-500">Только что</span>
                      </div>
                      <p className="text-gray-700">{c.text}</p>
                      <button className="mt-2 flex items-center gap-1 text-teal-400 text-xs hover:underline">
                        <FaPaperPlane /> Ответить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-gray-100 p-5 rounded-xl border border-gray-300 sticky top-4">
              <h3 className="text-lg font-bold text-black mb-4">Похожие</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 hover:bg-gray-200 p-2 rounded transition cursor-pointer group">
                    <div className="w-16 h-24 bg-gray-300 rounded overflow-hidden">
                      <img src={`https://via.placeholder.com/100x150?text=Anime+${item}`} alt="Poster" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-800 group-hover:text-teal-400 transition">Случайное аниме {item}</h4>
                      <p className="text-xs text-gray-500 mt-1">2024 • Экшен</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
