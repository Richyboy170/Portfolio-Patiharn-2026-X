'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LetterDisplay } from './LetterDisplay';

// 1️⃣ Hook ScrollTrigger into GSAP's core
gsap.registerPlugin(ScrollTrigger);

const lines = [
    'FAITH ',
    'is ',
    'WISDOM ',
];

function getRandomRotation() {
    // ±30°
    return Math.random() * 60 - 30;
}

function animateLettersOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
    const nodes = ref.current?.querySelectorAll<HTMLElement>('.letter') || [];
    console.log(`[LetterCollision] Found ${nodes.length} letters to animate.`);

    if (nodes.length === 0) return;

    nodes.forEach(letter => {
        const speed = parseFloat(letter.dataset.speed || '1');
        gsap.to(letter, {
            // y-offset = fraction of total scroll
            y: (1 - speed) * ScrollTrigger.maxScroll(window),
            rotation: getRandomRotation(),
            ease: 'power2.out',
            duration: 0.8,  // base duration (scrub will sync timing)
            scrollTrigger: {
                trigger: ref.current, // Changed from document.documentElement to scope to component
                start: "top top",     // Start when component hits top
                end: "bottom top",    // End when component leaves top (or adjust as needed)
                scrub: 0.5,           // "momentum" feel
                invalidateOnRefresh: true,
                // markers: true      // Uncomment to debug scroll positions
            }
        });
    });
}

export function LetterCollision() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        animateLettersOnScroll(ref);

    }, []);

    return (
        <div ref={ref} className="ml-8 scroll-smooth">
            {/* layout for two lines + sub-sentence */}
            <div className="-mt-28 mb-36 flex h-screen flex-col justify-end lg:mb-24">
                <div className="flex flex-wrap">
                    <LetterDisplay word={lines[0]} />
                    <div className="w-4 sm:w-10" />
                    <LetterDisplay word={lines[1]} />
                </div>
                <div className="flex flex-wrap">
                    <LetterDisplay word={lines[2]} />
                </div>
            </div>
            {/* Removed lines[4] rendering to fix runtime error */}
        </div>
    );
}
