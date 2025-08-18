import "./AboutTile.css"

import React, {useCallback, useRef, useState} from 'react';

import gsap from "gsap";
import {useGSAP} from '@gsap/react';

function AboutTile({title, hoverImg, index}) {

    const aboutTileRef = useRef(null);
    const textContainerRef = useRef(null);
    const imgContainerRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);

    // Функция для расчета позиции с учетом центра изображения
    const getCursorPosition = useCallback((e) => {
        if (!aboutTileRef.current || !imgContainerRef.current) return { x: 0, y: 0 };

        const rect = aboutTileRef.current.getBoundingClientRect();
        const imgRect = imgContainerRef.current.getBoundingClientRect();

        // Рассчитываем позицию так, чтобы курсор был в центре изображения
        const x = e.clientX - rect.left - imgRect.width / 2;
        const y = e.clientY - rect.top - imgRect.height / 2;

        return { x, y };
    }, []);


    // Анимация картинки
    const showHoverImg = useCallback((x, y) => {
        gsap.set(imgContainerRef.current, {
            x: x,
            y: y,
        });
        gsap.to(imgContainerRef.current, {
            height: "150%",
            duration: 0.5,
            ease: 'power2.out'
        });
    }, []);

    const hideHoverImg = useCallback(() => {
        gsap.to(imgContainerRef.current, {
            height: 0,
            duration: 0.5,
            ease: 'power2.in',
        });
    }, []);


    // Анимация текст контейнера
    const animateTextContainerMouseHover = useCallback(() => {
        gsap.to(textContainerRef.current, {
            xPercent: -15,
            duration: 0.6,
            ease: "power2.inOut"
        })
    }, []);

    const animateTextContainerMouseLeave = useCallback(() => {
        gsap.to(textContainerRef.current, {
            xPercent: 0,
            duration: 0.6,
            ease: "power2.inOut"
        })
    }, [])


    const handleMouseMove = useCallback((e) => {
        if (!isHovered || !imgContainerRef.current || !aboutTileRef.current) return;

        const {x, y} = getCursorPosition(e);

        const parallaxX = (e.clientX / window.innerWidth) * 150;
        const parallaxY = (e.clientY / window.innerHeight) * 200;

        gsap.to(imgContainerRef.current, {
            x: x,
            y: y,
            duration: 1.2,
            ease: 'power2.out'
        });

        // Двигаем само изображение в противоположную сторону (параллакс)
        const img = imgContainerRef.current.querySelector('.about-tile__img');
        gsap.to(img, {
            x: -parallaxX * 0.8,
            y: -parallaxY * 0.8,
            duration: 0.5,
            ease: 'power2.out'
        });

    }, [isHovered, index]);

    const handleMouseEnter = useCallback((e) => {
        setIsHovered(true);

        const {x, y} = getCursorPosition(e);
        showHoverImg(x, y);

        animateTextContainerMouseHover();
    }, [showHoverImg]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        hideHoverImg();
        animateTextContainerMouseLeave();
    }, [hideHoverImg]);

    useGSAP(() => {
        const tile = aboutTileRef.current;
        if (!tile) return;

        tile.addEventListener('mousemove', handleMouseMove);
        tile.addEventListener('mouseenter', handleMouseEnter);
        tile.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            tile.removeEventListener('mousemove', handleMouseMove);
            tile.removeEventListener('mouseenter', handleMouseEnter);
            tile.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

    return (
        <div ref={aboutTileRef} className="about-tile">

            <div ref={textContainerRef} className="about-tile__text-container">
                <div className="about-tile__index">
                   (0{index + 1})
                </div>
                <div className="about-tile__title">
                    {title}
                </div>
            </div>


            <div ref={imgContainerRef} className="about-tile__img-container">
                <img
                    src={hoverImg}
                    className="about-tile__img"
                    alt={title}
                />
            </div>
        </div>
    );
}

export default AboutTile;