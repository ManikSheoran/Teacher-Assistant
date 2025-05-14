"use client";
import React from "react";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import HeroComponent from "@/components/HeroComponent";
import IntroComponent from "@/components/IntroComponent";

const MainPage = () => {
    return (
        <>
            <IntroComponent />
        </>
    );
};

export default MainPage;
