"use client"
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  const {loggedIn, setLoggedIn} = useAuth()
  
  return <><div>{children}</div></>;
}