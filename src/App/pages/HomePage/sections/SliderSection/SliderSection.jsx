import "./SliderSection.css"

import {useRef, useEffect} from "react";

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

import Slider from "s/components/Slider/Slider.jsx";

function SliderSection() {

    const parentContainer = useRef(null);
    const imgContainer = useRef(null);
    const imgRef = useRef(null);
    const sliderContainer = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: parentContainer.current,
                start: "bottom bottom",
                end: "+=2000px",
                pin: true,
                scrub: 1,
            }
        })

        tl.to(imgRef.current, {
            width: "50%",
            height: "50%",
        })
            .add("photoDecreased")
            .to(imgContainer.current, {
                xPercent: -100,
                ease: "power2.out"
            })
            .to(imgContainer.current, {
                display: "none",
            })
            .fromTo(sliderContainer.current, {
                opacity: 0,
                scale: 0.8,
                left: "-50%"
            }, {
                opacity: 1,
                scale: 1,
                left: 0,
            }, "photoDecreased")

        return () => {
            tl.kill()
        }
    }, [])

    return (
        <section id="sliderSection">
            <div ref={parentContainer} className="slider-section__content-container">

                <div ref={imgContainer} className="slider-section__img-container">
                    <img ref={imgRef} src="img/bg-horizontal.jpg" alt="bg" className="fs-img"/>
                </div>

                <div ref={sliderContainer} className="slider-container">
                    <Slider />
                </div>

            </div>
        </section>
    )
}

export default SliderSection;