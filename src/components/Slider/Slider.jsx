import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Slider.css";

const slidesData = [
    { img: "img/slider/1.jpg", title: "Slider 1" },
    { img: "img/slider/2.jpg", title: "Slider 2" },
    { img: "img/slider/3.jpg", title: "Slider 3" },
    { img: "img/slider/4.jpg", title: "Slider 4" },
    { img: "img/slider/5.jpg", title: "Slider 5" },
    { img: "img/slider/6.jpg", title: "Slider 6" },
    { img: "img/slider/7.jpg", title: "Slider 7" },
    { img: "img/slider/8.jpg", title: "Slider 8" },
    { img: "img/slider/9.jpg", title: "Slider 9" },
    { img: "img/slider/10.jpg", title: "Slider 10" },
    { img: "img/slider/11.jpg", title: "Slider 11" },
    { img: "img/slider/12.jpg", title: "Slider 12" },
];

const sliderConfig = {
    SCROLL_SPEED: 1.75,
    LERP_FACTOR: 0.05,
    MAX_VELOCITY: 150,
};

const Slider = () => {
    const totalSlidesCount = slidesData.length;
    const trackRef = useRef(null);
    const sliderRef = useRef(null);
    const slideImgsRef = useRef([]);
    const animationRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [slideWidth, setSlideWidth] = useState(390);

    // Состояние слайдера
    const sliderState = useRef({
        currentX: 0,
        targetX: 0,
        isDragging: false,
        startX: 0,
        lastX: 0,
        lastMouseX: 0,
        lastScrollTime: Date.now(),
        isMoving: false,
        velocity: 0,
        lastCurrentX: 0,
        dragDistance: 0,
        hasActuallyDragged: false,
    });

    // Проверка мобильного устройства
    const checkMobile = useCallback(() => {
        const mobile = window.innerWidth < 1000;
        setIsMobile(mobile);
        setSlideWidth(mobile ? 215 : 390);
    }, []);

    // Создание слайда (React компонент)
    const Slide = React.memo(({ index }) => {
        const { title, img } = slidesData[index % totalSlidesCount];

        return (
            <div className={isMobile ? "slide slide-mobile" : "slide"}>
                <div className="slide-image">
                    <img
                        ref={el => (el ? slideImgsRef.current[index] = el : null)}
                        src={img}
                        alt={title}
                        data-index={index % totalSlidesCount}
                    />
                </div>
                <div className="slide-overlay">
                    <h4 className="slide-title">{title}</h4>
                    <i className="fa fa-arrow-right slide-arrow"></i>
                </div>
            </div>
        );
    });

    // Инициализация слайдов
    const initializeSlides = useCallback(() => {
        const startOffset = -totalSlidesCount * slideWidth * 2;

        sliderState.current = {
            ...sliderState.current,
            currentX: startOffset,
            targetX: startOffset,
        };

        if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${startOffset}px, 0, 0)`;
        }
    }, [totalSlidesCount, slideWidth]);

    // Обновление позиций слайдов
    const updateSlidePositions = useCallback(() => {
        const { currentX } = sliderState.current;
        const sequenceWidth = slideWidth * totalSlidesCount;

        if (currentX > sequenceWidth * -1) {
            sliderState.current.currentX -= sequenceWidth;
            sliderState.current.targetX -= sequenceWidth;
        } else if (currentX < sequenceWidth * -4) {
            sliderState.current.currentX += sequenceWidth;
            sliderState.current.targetX += sequenceWidth;
        }

        if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${sliderState.current.currentX}px, 0, 0)`;
        }
    }, [slideWidth, totalSlidesCount]);

    // Параллакс эффект
    const updateParallax = useCallback(() => {
        const viewportCenter = window.innerWidth / 2;

        slideImgsRef.current.forEach((img, index) => {
            if (!img) return;

            const slide = img.closest('.slide');
            if (!slide) return;

            const slideRect = slide.getBoundingClientRect();

            if (slideRect.right < -500 || slideRect.left > window.innerWidth + 500) {
                return;
            }

            const slideCenter = slideRect.left + slideRect.width / 2;
            const distanceFromCenter = slideCenter - viewportCenter;
            const parallaxOffset = distanceFromCenter * -0.25;

            img.style.transform = `translateX(${parallaxOffset}px) scale(2.25)`;
        });
    }, []);

    // Обновление состояния движения
    const updateMovingState = useCallback(() => {
        const { currentX, lastCurrentX, hasActuallyDragged } = sliderState.current;
        const velocity = Math.abs(currentX - lastCurrentX);
        const isSlowEnough = velocity < 0.1;
        const hasBeenStillLongEnough = (Date.now() - sliderState.current.lastScrollTime) > 200;

        sliderState.current = {
            ...sliderState.current,
            velocity,
            lastCurrentX: currentX,
            isMoving: hasActuallyDragged || !isSlowEnough || !hasBeenStillLongEnough,
        };

        document.documentElement.style.setProperty(
            "--slider-moving",
            sliderState.current.isMoving ? "1" : "0"
        );
    }, []);

    // Основная анимация
    const animate = useCallback(() => {
        const { currentX, targetX } = sliderState.current;

        sliderState.current.currentX += (targetX - currentX) * sliderConfig.LERP_FACTOR;

        updateMovingState();
        updateSlidePositions();
        updateParallax();

        animationRef.current = requestAnimationFrame(animate);
    }, [updateMovingState, updateSlidePositions, updateParallax]);

    // Обработчики событий мыши
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        sliderState.current = {
            ...sliderState.current,
            isDragging: true,
            startX: e.clientX,
            lastMouseX: e.clientX,
            lastX: sliderState.current.targetX,
            dragDistance: 0,
            hasActuallyDragged: false,
            lastScrollTime: Date.now(),
        };
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!sliderState.current.isDragging) return;
        e.preventDefault();

        const deltaX = (e.clientX - sliderState.current.lastMouseX) * 2;
        sliderState.current.targetX += deltaX;
        sliderState.current.lastMouseX = e.clientX;
        sliderState.current.dragDistance += Math.abs(deltaX);

        if (sliderState.current.dragDistance > 5) {
            sliderState.current.hasActuallyDragged = true;
        }

        sliderState.current.lastScrollTime = Date.now();
    }, []);

    const handleMouseUp = useCallback(() => {
        sliderState.current.isDragging = false;
        setTimeout(() => {
            sliderState.current.hasActuallyDragged = false;
        }, 100);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (sliderState.current.isDragging) {
            handleMouseUp();
        }
    }, [handleMouseUp]);

    // Обработчик колеса мыши
    const handleWheel = useCallback((e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();

        sliderState.current.lastScrollTime = Date.now();
        const scrollDelta = e.deltaY * sliderConfig.SCROLL_SPEED;

        sliderState.current.targetX -= Math.max(
            Math.min(scrollDelta, sliderConfig.MAX_VELOCITY),
            -sliderConfig.MAX_VELOCITY
        );
    }, []);

    // Инициализация и очистка
    useEffect(() => {
        checkMobile();
        initializeSlides();

        const slider = sliderRef.current;
        if (!slider) return;

        // Добавляем обработчики
        slider.addEventListener('wheel', handleWheel, { passive: false });
        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mousemove', handleMouseMove);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', checkMobile);

        // Запрещаем перетаскивание изображений
        const preventDrag = (e) => e.preventDefault();
        const images = slider.querySelectorAll('img');
        images.forEach(img => img.addEventListener('dragstart', preventDrag));

        // Запускаем анимацию
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            // Очистка
            slider.removeEventListener('wheel', handleWheel);
            slider.removeEventListener('mousedown', handleMouseDown);
            slider.removeEventListener('mousemove', handleMouseMove);
            slider.removeEventListener('mouseup', handleMouseUp);
            slider.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', checkMobile);

            images.forEach(img => img.removeEventListener('dragstart', preventDrag));
            cancelAnimationFrame(animationRef.current);
        };
    }, [
        checkMobile,
        initializeSlides,
        animate,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave
    ]);

    return (
        <div ref={sliderRef} className="slider">
            <div ref={trackRef} className="slide-track">
                {Array.from({ length: totalSlidesCount * 6 }).map((_, i) => (
                    <Slide key={`slide-${i}`} index={i} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Slider);