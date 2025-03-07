"use client";
import React from "react";
import { useRouter } from "next/router";
import Layout from "./layout";
import { useAuth } from "@/context/AuthContext";
import HeroComponent from "@/components/HeroComponent";
const MainPage = () => {
  const {loggedIn, setLoggedIn} = useAuth();
  return (
    <>
      {loggedIn ? <HeroComponent /> : <h1 className="mt-10">Not logged in</h1>}
    </>
  );
};

export default MainPage;