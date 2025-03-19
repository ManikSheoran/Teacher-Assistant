import React from "react";
import Image from "next/image";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import arunavaImg from "../TeamImages/Arunava.jpg";
import manikImg from "../TeamImages/Manik.jpg";
import harshImg from "../TeamImages/Harsh.jpg";
import amriteshImg from "../TeamImages/Amritesh.jpg";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Arunava Chakrabarty",
      role: "Team Lead | Backend & UI Specialist",
      bio: "The captain of our team, Arunava ensures everything runs smoothly—whether it’s writing solid backend logic or polishing the frontend. If there’s a problem, he’s already solving it.",
      image: arunavaImg,
      instagram: "https://www.instagram.com/cap_aru/",
      linkedin: "https://www.linkedin.com/in/chakrabartyarunava19/",
    },
    {
      name: "Manik Sheoran",
      role: "Backend Developer & Integration Specialist",
      bio: "Manik is the silent force making sure everything just works. He builds the backend with precision and ensures the frontend and backend communicate like best friends.",
      image: manikImg,
      instagram: "https://www.instagram.com/thatsmanik/",
      linkedin: "https://www.linkedin.com/in/maniksheoran/",
    },
    {
      name: "Harsh Prasad",
      role: "Frontend Developer & UI Specialist",
      bio: "Harsh is a design architect, transforming concepts into intuitive designs. With a passion for perfection and an eye for detail, if it looks amazing, Harsh probably built it.",
      image: harshImg,
      instagram: "https://www.instagram.com/iam_harsh45/",
      linkedin: "https://www.linkedin.com/in/harsh-prasad09/",
    },
    {
      name: "Amritesh Kumar",
      role: "Frontend Developer & UX Specialist",
      bio: "Amritesh crafts seamless user experiences that feel great from the first click. He ensures smooth interactions—if using our product feels effortless, thank Amritesh.",
      image: amriteshImg,
      instagram: "https://www.instagram.com/amritesh_kr24/",
      linkedin: "https://www.linkedin.com/in/amritesh-kumar-773b9929a/",
    },
  ];

  return (
    <section id="team" className="bg-transparent py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D2F6F] dark:text-[#8390FA] mb-4">
            Meet Our Team
          </h2>
          <div className="h-1 w-20 dark:bg-[#F88DAD] bg-[#8390FA] mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 dark:text-[#BEE0EF] max-w-2xl mx-auto">
            The passionate professionals behind our initiative.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-[#F9E9EC] dark:bg-[#1D2F6F] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={member.image.src}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full flex justify-end space-x-2">
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 transition-colors duration-300"
                    >
                      <FaInstagram size={20} className="text-white" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-blue-500 transition-colors duration-300"
                    >
                      <FaLinkedin size={20} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#84d1fe]">
                  {member.name}
                </h3>
                <p className="text-indigo-600 dark:text-[#ffefef] font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-[#B4BBC5] font-medium">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
