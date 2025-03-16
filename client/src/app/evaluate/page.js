"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../../components/elements/Header";
import { getCookie } from 'cookies-next';

export default function Home() {
  const router = useRouter();
  const [sid, setSid] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sid) {
      router.push(`/student/${sid}/evaluate`);
    } else {
      alert('Please enter a student ID');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const uid = getCookie('uid');
      if (!uid) {
        router.push('/login');
        alert('You need to login first');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${uid}/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });

        if (!response.ok) {
          router.push('/login');
          alert('You need to login first');
        }
      } catch (error) {
        console.error('Error validating uid:', error);
        router.push('/login');
        alert('You need to login first');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Header />
      <main className="pt-20 px-4 min-h-screen flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-transparent p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Enter Student ID</h1>
          <div className="mb-4">
            <label htmlFor="sid" className="block text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
            <input
              type="text"
              id="sid"
              className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary dark:bg-secondary text-white py-2 px-4 rounded hover:bg-secondary dark:hover:bg-primary transition duration-300">
            Continue
          </button>
        </form>
      </main>
    </>
  );
}





