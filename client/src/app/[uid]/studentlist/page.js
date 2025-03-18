"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentBox from "../../../components/StudentBox";
import Header from "../../../components/elements/Header";

// Custom DynamicSquareCircleLoader Loader component
const DynamicSquareCircleLoader = () => {
  const [phase, setPhase] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  
  const brightColors = [
    '#FF1E56', // Bright Red
    '#FFAC41', // Bright Orange
    '#32E0C4', // Bright Teal
    '#4D5DFF'  // Bright Blue
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % 60); // 60 frames for the full animation cycle
      
      // Change color every 120 frames (when animation restarts)
      if (phase === 59) {
        setColorIndex(prev => (prev + 1) % brightColors.length);
      }
    }, 15);
    
    return () => clearInterval(interval);
  }, [phase]);
  
  // Animation calculations
  const getTransform = (baseAngle) => {
    let distance;
    let rotation = 0;
    let scale = 1;
    let borderRadius = "50%"; // Default to circle
    
    if (phase < 15) { 
      distance = (phase / 15) * 30;
      rotation = 0;
      scale = 1;
      borderRadius = "50%";
    } 
    else if (phase < 25) {
      distance = 40;
      rotation = 0;
      scale = 1;
      const circleToSquare = (phase - 15) / 10;
      borderRadius = `${50 - circleToSquare * 50}%`;
    } 
    else if (phase < 40) {
      const inwardProgress = (phase - 25) / 15;
      distance = 40 - (inwardProgress * 40);
      rotation = inwardProgress * 90;
      scale = 1;
      borderRadius = "0%";
    } 
    else if (phase < 50) {
      distance = 0;
      rotation = 90;
      scale = 1;
      const squareToCircle = (phase - 40) / 10;
      borderRadius = `${squareToCircle * 50}%`;
    } 
    else {
      distance = 0;
      rotation = 90;
      const pulseProgress = (phase - 50) / 10;
      scale = 1 + Math.sin(pulseProgress * Math.PI) * 0.2;
      borderRadius = "50%";
    }
    
    // Calculate position based on angle and distance
    const angle = baseAngle + (rotation * Math.PI / 180);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return {
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
      borderRadius,
      backgroundColor: brightColors[(colorIndex + Math.floor(baseAngle / (Math.PI/2))) % brightColors.length]
    };
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 transition-all duration-100 ease-linear"
            style={getTransform(i * Math.PI / 2)}
          />
        ))}
      </div>
      <p className="text-gray-400 mt-6">Loading students...</p>
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
          <DynamicSquareCircleLoader />
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