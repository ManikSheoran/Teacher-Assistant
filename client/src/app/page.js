"use client";
import React from "react";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import HeroComponent from "@/components/HeroComponent";
import IntroComponent from "@/components/IntroComponent";

const MainPage = () => {
  const { loggedIn, setLoggedIn } = useAuth();

  return (
    <>
      <Head>
        <title>{loggedIn ? "Dashboard - NeuroGrade" : "Welcome to NeuroGrade"}</title>
        <meta name="description" content={loggedIn ? "Access your AI-powered grading dashboard." : "NeuroGrade helps teachers automate grading and provide personalized feedback."} />
        <meta name="keywords" content="AI grading, automated feedback, teacher assistant, student evaluation" />
        <meta property="og:title" content={loggedIn ? "Dashboard - NeuroGrade" : "Welcome to NeuroGrade"} />
        <meta property="og:description" content={loggedIn ? "Access your AI-powered grading dashboard." : "NeuroGrade helps teachers automate grading and provide personalized feedback."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.neurograde.app/" />
        <meta property="og:image" content="https://www.neurograde.app/android-chrome-192x192.png" />
        <meta name="robots" content="index, follow" />
      </Head>

      {loggedIn ? <HeroComponent /> : <IntroComponent />}
    </>
  );
};

export default MainPage;
