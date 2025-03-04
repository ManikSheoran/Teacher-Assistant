"use client";
import React, { useState } from "react";
import Header from "../../components/elements/header";
export default function Register() {
  const [role, setRole] = useState("Citizen");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });


  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      role === "Citizen"
        ? ""
        : "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`${role} registration successful`);
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <>
    <Header />
    <div className="flex items-center justify-center m-16">

      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#44546a] mb-6 text-center">
          Register
        </h1>

       

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#00ff06] rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 focus:ring-[#00cc47]"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#00ff06] rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 focus:ring-[#00cc47]"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#00ff06] rounded-lg placeholder-gray-500 text-[#44546a] focus:outline-none focus:ring-2 focus:ring-[#00cc47]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#71c479] text-white font-bold rounded-lg hover:bg-[#00cc47] transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-[#71c479] font-medium hover:text-[#00ff06] transition duration-300"
          >
            Existing User? Login
          </a>
        </div>
      </div>
    </div>
    </>
  );
}