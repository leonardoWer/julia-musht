import "./TopMenu.css"

import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import gsap from "gsap";

function TopMenu() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const menuOpenRef = useRef(null);
    const menuCloseRef = useRef(null);
    const menuContentContainerRef = useRef(null);

    const navigationData = useMemo(() => [
        {
            title: "Home",
            href: "heroSection",
        },
        {
            title: "About",
            href: "aboutSection",
        },
        {
            title: "Gallery",
            href: "sliderSection",
        },
    ], []);

    // TODO: write correct links
    const contactsData = useMemo(() => [
        {
            title: "vk",
            href: "https://vk.com/juliamusht",
        },
        {
            title: "vk group",
            href: "https://vk.com/juliamusht",
        },
        {
            title: "Telegram",
            href: "https://t.me/julia-musht",
        },
        {
            title: "Instagram",
            href: "https://vk.com/juliamusht",
        },

    ], [])

    const imgData = useMemo(() => [
        "img/menu/1.jpg",
        "img/menu/2.jpg",
        "img/menu/3.jpg",
        "img/menu/4.jpg",
        "img/menu/5.jpg",
    ], []);

    // Инициализация анимаций
    useEffect(() => {
        gsap.set(menuCloseRef.current, { yPercent: -100 });
    }, []);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const getCurrentImg = useCallback(() => {
        return imgData[currentPhotoIndex % imgData.length];
    }, [currentPhotoIndex, imgData]);

    const handlePhotoChange = useCallback(() => {
        setCurrentPhotoIndex(prev => (prev + 1) % imgData.length);
    }, [imgData.length]);

    // Управление анимациями при изменении isMenuOpen
    useEffect(() => {

        const showMenuTl = gsap.timeline({
            paused: true,
            defaults: { ease: "power2.out" },
        })
        showMenuTl.to(menuOpenRef.current, { yPercent: 100 })
            .set(menuContentContainerRef.current, {
                scale: 0.8,
                opacity: 1
            })
            .fromTo(menuContentContainerRef.current, {
                yPercent: 100,
            }, {
                yPercent: 0,
                duration: 0.6
            })
            .to(menuContentContainerRef.current, {
                scale: 1,
            })
            .to(menuCloseRef.current, { yPercent: 0 }, "-=0.2")
            .set(document.body, {overflow: "hidden"})


        const hideMenuTl = gsap.timeline({
            paused: true,
            defaults: { ease: "power2.in" },
            onComplete: () => {handlePhotoChange();}
        })
        hideMenuTl.to(menuCloseRef.current, { yPercent: 100 })
            .fromTo(menuContentContainerRef.current, {
                scale: 1,
            }, {
                scale: 0.8,
                duration: 0.6,
            })
            .fromTo(menuContentContainerRef.current, {
                yPercent: 0,
            }, {
                yPercent: 100,
            })
            .set(menuContentContainerRef.current, {opacity: 0})
            .to(menuOpenRef.current, { yPercent: 0 }, "-=0.2")
            .set(document.body, {overflow: "visible"})

        isMenuOpen ? showMenuTl.play() : hideMenuTl.play();

        return () => {
            showMenuTl.kill();
            hideMenuTl.kill();
        }
    }, [isMenuOpen, handlePhotoChange]);

    return (
        <>
            <nav className="top-menu">
                <div onClick={toggleMenu}
                     className="menu-toggle">
                    <div ref={menuOpenRef} className="menu-open">Menu</div>
                    <div ref={menuCloseRef} className="menu-close">Close</div>
                </div>
            </nav>

            <div className="menu-overlay">
                <div ref={menuContentContainerRef} className="menu__content-container">

                    <img src={(getCurrentImg())}
                         alt="menu-bg"
                         className="menu__bg-img"/>
                    <div className="menu__bg-img_blur"></div>

                    <img src={(getCurrentImg())}
                         alt="menu-title-photo"
                         className="menu__title-img"/>

                    <div className="menu__links-container">

                        <ul className="menu-content__navigation-list">
                            {navigationData.map((item, index) => (
                                <li className="navigation-item"
                                    key={index}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>

                        <ul className="menu-content__contacts-list">
                            {contactsData.map((item, index) => (
                                <li className="contact-item"
                                    key={index}>
                                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>

                    </div>

                </div>
            </div>
        </>
    )
}

export default TopMenu;