"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/Header";

// Custom BookLoader Loader component
const BookLoader = () => {
  return (
    <div className="flex flex-col items-center">
      <style jsx>{`
        .book-loader {
          width: 64px;
          height: 80px;
          perspective: 800px;
          position: relative;
        }
        .page {
          position: absolute;
          width: 50%;
          height: 100%;
          background-color: #fac748; 
          backface-visibility: hidden;
          border-radius: 4px;
          transform-origin: left;
          animation: turnPage 2s infinite;
        }
        .page.right {
          left: 50%;
          transform-origin: right;
          animation-delay: 1s;
        }
        @keyframes turnPage {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-180deg);
          }
          /* Immediately reset after 50% for a continuous effect */
          50.01% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
      `}</style>
      <div className="book-loader">
        <div className="page left"></div>
        <div className="page right"></div>
      </div>
      <p className="text-gray-500 mt-4">Loading...</p>
    </div>
  );
};

export default function StudentList() {
  const { uid } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${uid}/studentlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Invalid data format:", data);
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching student list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  return (
    <>
      <Header />
      <main className="pt-20 px-4 min-h-screen bg-transparent flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary dark:text-secondary mb-6 text-center">
          Student List
        </h1>
        
        {loading ? (
          <BookLoader />
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full max-w-5xl">
            {students.map((student) => (
              <StudentBox key={student.id} studentId={student.id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg mt-10">
            No students found.
          </p>
        )}
      </main>
    </>
  );
}