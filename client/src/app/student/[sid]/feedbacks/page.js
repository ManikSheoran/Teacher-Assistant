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
      <main className="pt-20 px-4">
        <h1>Feedbacks for {sid}</h1>
        <div className="flex flex-wrap">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <Feedback feedback={feedback} />
              </div>
            ))
          ) : (
            <p>No feedbacks found.</p>
          )}
        </div>
      </main>
    </>
  );
}
