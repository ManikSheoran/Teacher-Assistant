"use client";

import { useParams } from 'next/navigation';
import Feedback from '../../../../components/Feedback';
import Header from "../../../../components/elements/header";
import { useEffect, useState } from 'react';

export default function FeedbackPage() {
  const { sid } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${sid}/feedbacks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          console.error("Invalid data format:", data);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedback list:", error);
      }
    };

    fetchData();
  }, [sid]);

  return (
    <>
      <Header />
      <main className="pt-20 px-4 min-h-screen flex flex-col items-center">
        {/* Title - Responsive Centered */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
          Feedbacks for {sid}
        </h1>

        {/* Feedback List - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="p-2">
                <Feedback feedback={feedback} />
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg col-span-full text-center">
              No feedbacks found.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
