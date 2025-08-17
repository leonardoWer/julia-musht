import "./HomePage.css";

import {useEffect, useRef, useState} from "react";

import gsap from "gsap";

function HomePage() {

    const [svgContent, setSvgContent] = useState('');
    const svgRef = useRef(null);

    useEffect(() => {
        async function loadSVG() {
            try {
                const response = await fetch('svg/julia-musht-photos.svg');
                const svgText = await response.text();
                setSvgContent(svgText);
            } catch (error) {
                console.error('Ошибка при загрузке SVG:', error);
            }
        }

        loadSVG().then(r => animateSvg());
    }, []);

    useEffect(() => {
        if (svgContent) {
            animateSvg();
        }
    }, [svgContent]);

    function animateSvg() {
        const svg = svgRef.current;
        const fadeInTl = gsap.timeline()

        fadeInTl.set("#Julia", {opacity: 0})
                .set("#Musht", {opacity: 0})
            .fromTo("#photo-1", {
                yPercent: -100,
                duration: 2,
                ease: "power2.out",
            }, {yPercent: 0},0.2)
            .fromTo("#photo-2", {
                yPercent: -200,
                duration: 2,
                ease: "power2.out",
            }, {yPercent: 0}, "+=0.2")
            .to("#Julia", {opacity: 1})
            .to("#Musht", {opacity: 1})

    }

    return (
        <div>
            <div className="logo-container">
                <div dangerouslySetInnerHTML={{ __html: svgContent }} ref={svgRef} className="julia-musht"/>
            </div>

            <div className="img-container">
                <img className="title-img" src="img/hero-1.jpg" alt="title-photo" />
                <img className="about-img" src="img/town.jpg" alt="about-photo" />
            </div>

        </div>
    )
}

export default HomePage;