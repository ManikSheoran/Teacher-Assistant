"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/Header";

export default function StudentList() {
  const { uid } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
        {students.length > 0 ? (
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
