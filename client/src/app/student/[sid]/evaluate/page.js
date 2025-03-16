"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import FormComponent from '../../../../components/FormComponent';
import Header from "../../../../components/elements/Header";
import { getCookie } from 'cookies-next';

export default function EvaluatePage() {
  const { sid } = useParams();
  const router = useRouter();

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
      <main className="pt-20 px-4 bg-transparent min-h-screen flex flex-col items-center">
        {/* Title - Centered */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-6 text-center">
          Evaluating Student: {sid}
        </h1>

        {/* FormComponent - Responsive */}
        <div className="w-full max-w-3xl">
          <FormComponent sid={sid} readOnly={true} />
        </div>
      </main>
    </>
  );
}
