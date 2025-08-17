import "./HomePage.css";

import HeroSection from "s/App/pages/HomePage/sections/HeroSection/HeroSection.jsx";
import AboutSection from "s/App/pages/HomePage/sections/AboutSection/AboutSection.jsx";
import SliderSection from "s/App/pages/HomePage/sections/SliderSection/SliderSection.jsx";

function HomePage() {
    return (
        <div>
            <HeroSection/>
            <AboutSection/>
            <SliderSection/>
        </div>
    )
}

export default HomePage;