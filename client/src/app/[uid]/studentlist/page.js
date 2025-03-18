"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/Header";

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
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="pulse-container">
              <div className="pulse-ring"></div>
              <div className="pulse-circles">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="pulse-circle"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-24px)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <p className="text-gray-400 mt-8">Loading students...</p>
            
            <style jsx>{`
              .pulse-container {
                position: relative;
                width: 80px;
                height: 80px;
              }
              
              .pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                animation: pulse 1.5s ease-out infinite;
              }
              
              @keyframes pulse {
                0% {
                  transform: translate(-50%, -50%) scale(0.8);
                  opacity: 0.8;
                  box-shadow: 0 0 0 0 rgba(130, 87, 230, 0.7);
                }
                70% {
                  transform: translate(-50%, -50%) scale(1.2);
                  opacity: 0;
                  box-shadow: 0 0 0 25px rgba(130, 87, 230, 0);
                }
                100% {
                  transform: translate(-50%, -50%) scale(0.8);
                  opacity: 0;
                  box-shadow: 0 0 0 0 rgba(130, 87, 230, 0);
                }
              }
              
              .pulse-circles {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
              }
              
              .pulse-circle {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: colorShift 2s ease infinite;
              }
              
              @keyframes colorShift {
                0% { background: #ff5e5e; transform: rotate(0deg) translateY(-24px) scale(1); }
                20% { background: #ffbb2b; }
                40% { background: #5ce1e6; }
                60% { background: #8c52ff; transform: rotate(0deg) translateY(-24px) scale(1.3); }
                80% { background: #ff5e5e; }
                100% { background: #ff5e5e; transform: rotate(0deg) translateY(-24px) scale(1); }
              }
            `}</style>
          </div>
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