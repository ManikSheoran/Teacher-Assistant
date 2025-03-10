"use client";

import { useParams } from 'next/navigation';
import FormComponent from '../../../../components/FormComponent';
import Header from "../../../../components/elements/header";

export default function EvaluatePage() {
  const { sid } = useParams(); // Get the dynamic 'sid' from URL

  return (
    <>
      <Header />
      <main className="pt-20 px-4">
        <h1>Evaluating Student: {sid}</h1>
        <FormComponent sid={sid} />
      </main>
    </>
  );
}
