import IntroComponent from "@/components/IntroComponent";
import { Analytics } from "@vercel/analytics/next"
const MainPage = () => {
    return (
        <>
        <Analytics />
            <IntroComponent />
        </>
    );
};

export default MainPage;
