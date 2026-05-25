"use client";

import React, { useEffect, useRef } from 'react';

interface GooeyMaskProps {
    imageUrl?: string;
}

export function GooeyMask({
    imageUrl = "https://images.unsplash.com/photo-1771784969160-8bad210e9f47?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}: GooeyMaskProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<SVGCircleElement>(null);
    const nodesRefs = useRef<(SVGCircleElement | null)[]>([]);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const MathPI2 = Math.PI * 2;
        const CURSOR_RADIUS = 90;
        const REPULSION_FORCE = 1.8;
        const REPULSION_RADIUS = 300;
        const SPRING_STRENGTH = 0.005;
        const FRICTION = 0.88;

        let width = container.clientWidth;
        let height = container.clientHeight;
        
        // Initial center
        let mouseX = width / 2;
        let mouseY = height / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        // Add a ResizeObserver to keep dimensions updated
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
        });
        resizeObserver.observe(container);

        const nodes = Array.from({ length: 8 }).map((_, i) => ({
            el: nodesRefs.current[i],
            x: width / 2 + (Math.random() - 0.5) * width * 1.5,
            y: height / 2 + (Math.random() - 0.5) * height * 1.5,
            vx: 0,
            vy: 0,
            baseRadius: i === 0 ? 240 : 100 + Math.random() * 120,
            angle: Math.random() * MathPI2,
            orbitSpeed: (Math.random() - 0.5) * 0.015,
            spreadDistance: i === 0 ? 0 : 120 + Math.random() * 200,
            pulseSpeed: 0.001 + Math.random() * 0.002,
        }));

        if (cursorRef.current) {
            cursorRef.current.setAttribute('r', String(CURSOR_RADIUS));
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.touches[0].clientX - rect.left;
            mouseY = e.touches[0].clientY - rect.top;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // If mouse leaves the container, smoothly return to center
        const handleMouseLeave = () => {
            mouseX = width / 2;
            mouseY = height / 2;
        };
        container.addEventListener('mouseleave', handleMouseLeave);

        const animate = (time: number) => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            if (cursorRef.current) {
                cursorRef.current.setAttribute('cx', String(cursorX));
                cursorRef.current.setAttribute('cy', String(cursorY));
            }

            const globalTargetX = width / 2 +
                Math.sin(time * 0.0003) * (width * 0.4) +
                Math.cos(time * 0.0005) * (width * 0.15);

            const globalTargetY = height / 2 +
                Math.cos(time * 0.0004) * (height * 0.4) +
                Math.sin(time * 0.0006) * (height * 0.15);

            const timeSec = time * 0.001;
            let spreadModifier = 1;

            if (timeSec < 3) {
                spreadModifier = 3.5 - timeSec * 0.9;
            } else {
                spreadModifier = 0.3 + (Math.sin((timeSec - 3) * 0.5) + 1) * 0.2;
            }

            nodes.forEach((node) => {
                if (!node.el) return;

                const currentRadius = node.baseRadius + Math.sin(time * node.pulseSpeed * 2) * 50;
                node.angle += node.orbitSpeed;
                const currentSpread = (node.spreadDistance + Math.sin(time * node.pulseSpeed) * 80) * spreadModifier;

                const targetX = globalTargetX + Math.cos(node.angle) * currentSpread;
                const targetY = globalTargetY + Math.sin(node.angle) * currentSpread;

                node.vx += (targetX - node.x) * SPRING_STRENGTH;
                node.vy += (targetY - node.y) * SPRING_STRENGTH;

                const dx = node.x - cursorX;
                const dy = node.y - cursorY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < currentRadius + REPULSION_RADIUS) {
                    const force = (currentRadius + REPULSION_RADIUS - dist) / (currentRadius + REPULSION_RADIUS);
                    node.vx += (dx / dist) * force * REPULSION_FORCE;
                    node.vy += (dy / dist) * force * REPULSION_FORCE;
                }

                node.vx *= FRICTION;
                node.vy *= FRICTION;
                node.x += node.vx;
                node.y += node.vy;

                node.el.setAttribute('cx', String(node.x));
                node.el.setAttribute('cy', String(node.y));
                node.el.setAttribute('r', String(currentRadius));
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            resizeObserver.disconnect();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#EAE5D9]">
            <svg
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="
                            1 0 0 0 0  
                            0 1 0 0 0  
                            0 0 1 0 0  
                            0 0 0 65 -30" result="goo"
                        />
                    </filter>

                    <mask id="blob-mask">
                        <g filter="url(#goo)">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <circle
                                    key={i}
                                    ref={(el) => { nodesRefs.current[i] = el; }}
                                    fill="white"
                                />
                            ))}
                            <circle ref={cursorRef} fill="white" />
                        </g>
                    </mask>
                </defs>

                <image
                    href={imageUrl}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                    mask="url(#blob-mask)"
                />
            </svg>
        </div>
    );
}