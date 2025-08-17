import "./HomePage.css";

import juliaMusht from '/svg/julia-musht-photos.svg'

import {useEffect, useRef, useState} from "react";

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

    function animateSvg() {}

    return (
        <div>
            <div className="logo-container">
                {/*<img src={juliaMusht} alt="Julia Musht" className="julia-musht"/>*/}
                <div dangerouslySetInnerHTML={{ __html: svgContent }} ref={svgRef} className="julia-musht"/>
            </div>

            <div className="img-container">

            </div>

        </div>
    )
}

export default HomePage;