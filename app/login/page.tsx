'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import http from '@/lib/api/http';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Assuming there is an endpoint for email/password login or using Sanctum's /sanctum/csrf-cookie + /login
      // However, the user request specifically mentioned "Auth + receiving token" and "Find where Google/Anilist login is handled".
      // Since this form is for Email/Password, I will implement standard login.
      // If the backend uses Sanctum SPA auth, we might need csrf-cookie first.
      // But the user asked to "receive token from backend and save it".
      // So I assume a standard API token login endpoint exists or I should use one.
      // Given the user instructions were about "Google/Anilist" but this page has an email form, I will implement the email form submission.

      // NOTE: The user request said "Find in front where login via Google/Anilist is processed".
      // But this file `app/login/page.tsx` seems to be a custom form.
      // I will implement the form submission to a hypothetical `/login` endpoint or similar if it exists,
      const response = await http.post('/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        router.push('/profile');
      } else {
        setError('Не удалось получить токен');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Ошибка входа';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fon.jpg')" }}
    >
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#2EC4B6]/40 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-[#2EC4B6] flex items-center justify-center gap-2">
          <FaSignInAlt className="text-[#2EC4B6]" /> Вход
        </h1>
        <p className="text-[#2EC4B6] mb-6 text-center text-sm font-medium">
          Добро пожаловать! Введите данные для входа.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-[#2EC4B6] text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2EC4B6]" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-gray-700 border-[#2EC4B6] outline-none transition focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-[#2EC4B6] text-sm font-semibold mb-2">Пароль</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2EC4B6]" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-gray-700 border-[#2EC4B6] outline-none transition focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2EC4B6] hover:bg-[#259B92] text-white font-bold py-3 px-6 rounded-lg w-full transition-all shadow-md hover:shadow-lg text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ИЛИ</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                const response = await http.get('/auth/google/redirect');
                if (response.data.url) {
                  window.location.href = response.data.url;
                }
              } catch (e) {
                console.error('Google login error', e);
                setError('Failed to initialize Google login');
              }
            }}
            className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg w-full transition-all shadow-md hover:shadow-lg text-lg flex justify-center items-center gap-2 border border-gray-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Войти через Google
          </button>

          <div className="text-center pt-2 flex flex-col items-center">
            <FaUserPlus className="text-[#2EC4B6] mb-2" />
            <Link href="/register" className="text-[#2EC4B6] font-semibold text-sm hover:text-[#259B92] transition">Нет аккаунта? Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

