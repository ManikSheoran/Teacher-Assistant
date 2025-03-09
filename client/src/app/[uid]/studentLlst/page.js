"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/header";

export default function StudentList() {
  const { userid } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${userid}/studentlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
  }, [userid]);

  return (
    <>
      <Header />
      <main className="pt-20 px-4">
        <h1>Student List</h1>
        <div className="flex flex-wrap">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <StudentBox studentId={student.id} />
              </div>
            ))
          ) : (
            <p>No students found.</p>
          )}
        </div>
      </main>
    </>
  );
}
