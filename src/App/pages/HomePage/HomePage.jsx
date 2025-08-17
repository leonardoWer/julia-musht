import "./HomePage.css";

import HeroSection from "s/App/pages/HomePage/sections/HeroSection/HeroSection.jsx";
import AboutSection from "s/App/pages/HomePage/sections/AboutSection/AboutSection.jsx";

function HomePage() {
    return (
        <div>
            <HeroSection/>
            <AboutSection/>
        </div>
    )
}

export default HomePage;