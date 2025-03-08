"use client";
import React from "react";
import { useRouter } from "next/router";
import Layout from "./layout";
import { useAuth } from "@/context/AuthContext";
import HeroComponent from "@/components/HeroComponent";
import IntroComponent from "@/components/IntroComponent";

const MainPage = () => {
  const {loggedIn, setLoggedIn} = useAuth();
  return (
    <>
      {loggedIn ? <HeroComponent /> : <IntroComponent />}
    </>
  );
};

export default MainPage;