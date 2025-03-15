"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import FormComponent from '../../../../components/FormComponent';
import Header from "../../../../components/elements/header";
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
      <main className="pt-20 px-4">
        <h1>Evaluating Student: {sid}</h1>
        <FormComponent sid={sid} readOnly={true}/>
      </main>
    </>
  );
}
