"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/Header";

// Custom RingLoader Loader component
const RingLoader = () => {
  return (
    <div className="flex flex-col items-center">
      <style jsx>{`
        .loader-container {
          position: relative;
          width: 64px;
          height: 64px;
        }
        .ring {
          width: 64px;
          height: 64px;
          border: 4px solid #d4af37; /* Golden color */
          /* Make one segment transparent to simulate a broken ring */
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }
        .tail {
          position: absolute;
          /* A small rectangle representing the broken tail */
          width: 10px;
          height: 4px;
          background-color: #d4af37;
          top: 50%;
          left: 100%;
          transform: translate(-50%, -50%);
          animation: breakTail 2s infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes breakTail {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) rotate(30deg);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }
      `}</style>
      <div className="loader-container">
        <div className="ring"></div>
        <div className="tail"></div>
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
          <RingLoader />
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