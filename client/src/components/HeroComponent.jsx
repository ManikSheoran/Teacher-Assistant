import { useUser } from "@/context/UserContext";
import { getCookie } from "cookies-next";
import { FaUserGraduate, FaListUl, FaClipboardCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import fetchUser from "@/lib/fetchUser";

export default function HeroComponent() {
    const { user, setUser } = useUser();

    // Dynamic Greeting Based on Time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Dynamic Educational Quotes
    const quotes = [
        "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
        "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
        "Tell me and I forget. Teach me and I remember. Involve me and I learn. – Benjamin Franklin",
        "The mind is not a vessel to be filled but a fire to be kindled. – Plutarch",
        "Learning never exhausts the mind. – Leonardo da Vinci",
        "An investment in knowledge pays the best interest. – Benjamin Franklin",
    ];

    const [quote, setQuote] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

  return (
    <div className="relative flex flex-col items-center p-4 sm:p-6 bg-transparent text-black dark:text-white min-h-screen w-full overflow-hidden">
      {/* Greeting */}
      <h1 className="select-none text-3xl sm:text-4xl text-primary dark:text-secondary font-semibold text-center mb-6 mt-20 sm:mt-20">
        {`${getGreeting()}, ${user.name ? user.name : "Teacher"}!`}
      </h1>

            {/* Buttons Section */}

            <div className="flex flex-col items-center space-y-4 w-full max-w-xs sm:max-w-sm mt-4">
                <StyledButton href="/add-student">
                    <FaUserGraduate /> Add Student
                </StyledButton>
                <StyledButton href={`/studentlist`}>
                    <FaListUl /> View Students List
                </StyledButton>
                <StyledButton href="/evaluate">
                    <FaClipboardCheck /> Evaluate
                </StyledButton>
            </div>

            {/* Quote Section */}
            <div className="absolute bottom-10 w-full px-4 max-w-lg text-center">
                <p className="text-lg text-black dark:text-white italic drop-shadow-md">
                    “{quote}”
                </p>
            </div>
        </div>
    );
}
// Reusable Button with Hover Glow

function StyledButton({ href, children }) {
  return (
    <a
      href={href}
      className="relative w-full text-center flex items-center justify-center gap-2 bg-[#1d2f6f] dark:bg-secondary text-white py-2 px-4 rounded-lg shadow-lg hover:hover:bg-[#8390FA] dark:hover:bg-primary transition duration-300"
    >
      {children}
    </a>
  );
}