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
    if (!getCookie('uid')) {
      router.push('/login');
      alert('You need to login first');
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="pt-20 px-4 bg-transparent min-h-screen flex flex-col items-center">
        {/* Title - Centered */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
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
