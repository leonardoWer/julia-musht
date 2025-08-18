import "./HeroSection.css"

import {useEffect, useRef, useState} from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

const infoTextData = [
    "Lorem 10",
    "Lorem 11",
    "Lorem 12",
    "Lorem 13",
]

function HeroSection() {
    // Svg logics
    const [svgContent, setSvgContent] = useState('');
    const svgRef = useRef(null);

    const imgContainer = useRef(null);
    const imgWrapper = useRef(null);
    const titleImgRef = useRef(null);
    const aboutImgRef = useRef(null);

    const infoTexts = useRef([]);

    const aboutContainer = useRef(null);
    const aboutText = useRef(null);
    const aboutTextLabel = useRef(null);

    // (0) HeaderSvg Anim
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

        loadSVG();
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
            .fromTo(imgContainer.current, {
                yPercent: 100,
            }, {
                yPercent: 0,
                ease: "power2.out",
            })
    }

    // Another gsap animations

    // (1) Photo zoom
    useEffect(() => {
        const photoMoveTl = gsap.timeline({
            scrollTrigger: {
                trigger: imgWrapper.current,
                start: "center bottom",
                end: "bottom bottom",
                scrub: true,
            }
        })

        photoMoveTl.to(titleImgRef.current, {
            x: "-50%",
            translate: "0 0",
            width: "50%",
            ease: "sine",
            duration: 5,
        }, 0)
            .fromTo(aboutImgRef.current, {
                right: "-100%",
            }, {
                right: 0,
                ease: "power1.out",
                duration: 10,
            }, 0.2)
            .to(aboutImgRef.current, {
                opacity: 1,
                ease: "power2.inOut",
            }, 0.3)

        return () => {
            photoMoveTl.kill();
        }

    }, []);

    // (2) Scroll with text anim
    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: imgWrapper.current,
                start: "bottom bottom",
                end: "+=8000",
                pin: imgContainer.current,
                scrub: 2,
            }
        })

        infoTexts.current.forEach((infoText, index) => {
            const delay = index * 1.5;

            tl.fromTo(infoText, {
                yPercent: 100,
                opacity: 0
            }, {
                yPercent: 0,
                opacity: 1
            }, delay)
                .to(infoText, {
                    yPercent: -100,
                    opacity: 0
                })
        })


        const fadeOutTl = gsap.timeline({
            scrub: 5,
        });

        fadeOutTl.to(imgWrapper.current, {
            scale: 0.9,
            ease: "power2.in",
        })
            .to(titleImgRef.current, {
                yPercent: -50,
                left: 0,
                width: "0",
                ease: "power1.in",
        }, 1)
            .to(titleImgRef.current, {
                display: "none",
            }, ">")
            .to(aboutImgRef.current, {
                width: "40%",
                height: "80%",
                bottom: 0,
                ease: "power1.in",
            }, 1)
            .to(imgWrapper.current, {
                scale: 1,
            }, "<")
            .to(aboutContainer.current, {
                opacity: 1,
            }, 1.5)

        tl.add(fadeOutTl)

        return () => {
            tl.kill();
            fadeOutTl.kill();
        }
    }, [])


    return (
        <section id="heroSection">

            <div className="logo-container">
                <div dangerouslySetInnerHTML={{ __html: svgContent }} ref={svgRef} className="julia-musht"/>
            </div>

            <div className="img-container" ref={imgContainer}>
                <div ref={imgWrapper} className="img-container__wrapper">
                    <img ref={titleImgRef} className="title-img" src="img/hero-1.jpg" alt="title-photo" />
                    <img ref={aboutImgRef} className="about-img" src="img/town.jpg" alt="about-photo" />

                    {infoTextData.map((item, i) => (
                        <h4 ref={(el) => (infoTexts.current[i] = el)} className="info-text" key={i}>
                            {item}
                        </h4>
                    ))}

                    <div ref={aboutContainer} className="about-text-container">
                        <span ref={aboutTextLabel} className="about-text__label">
                            lorem ipsum
                        </span>
                        <p ref={aboutText} className="about-text">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid animi aspernatur deleniti dolorem ducimus earum expedita impedit
                        </p>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default HeroSection;