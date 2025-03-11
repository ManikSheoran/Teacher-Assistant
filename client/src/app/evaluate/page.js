"use client"; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormComponent from '../../components/FormComponent';
import Header from "../../components/elements/header";
import { getCookie } from 'cookies-next';

export default function Home() {
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
        <FormComponent />
      </main>
    </>
  );
}





