"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    life: number;
    color: string;
}

export function CursorSparkles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        // Track mouse
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            // Add particles on move
            const speed = Math.hypot(e.movementX, e.movementY);
            const count = Math.min(5, Math.ceil(speed / 2));

            for (let i = 0; i < count; i++) {
                particles.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 4 + 1,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    color: `hsl(${45 + Math.random() * 15}, 100%, ${50 + Math.random() * 30}%)` // Gold/Yellow range
                });
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Animation Loop
        const animate = () => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i];

                // Update
                p.x += p.speedX;
                p.y += p.speedY;
                p.life -= 0.02; // Fade out speed
                p.size *= 0.95; // Shrink

                // Draw
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Remove dead particles
                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    i--;
                }
            }
            ctx.globalAlpha = 1;

            requestAnimationFrame(animate);
        };
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
