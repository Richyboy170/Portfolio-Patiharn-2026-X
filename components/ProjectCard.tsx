"use client";


import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ProjectData } from "@/lib/data";
import { X, Play } from "lucide-react";
import { ImageViewer } from "./ImageViewer";

interface ProjectCardProps {
    project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // One-click access - no hold timer needed
    const handleClick = () => {
        setIsExpanded(true);
    };

    useEffect(() => {
        if (isHovered && videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        } else if (!isHovered && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered]);



    // Shape variants for the clip-path
    // Default: Incline/Parallelogram
    // Hover: Rectangle
    const shapeVariants: Variants = {
        initial: {
            clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
            scale: 1,
            filter: "grayscale(0%)", // Make default state a bit duller to pop on hover
        },
        hover: {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Rectangle
            scale: 1.1, // Scale up
            filter: "grayscale(0%)",
            transition: { duration: 0.4, ease: "backOut" }
        }
    };

    return (
        <>
            <motion.div
                className="relative group cursor-pointer"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handleClick}
            >
                <motion.div
                    variants={shapeVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    className="w-full h-64 bg-white shadow-xl overflow-hidden relative border-4 border-transparent group-hover:border-[var(--color-primary)] transition-colors"
                >
                    {/* Media Display: Video Preview if specific hover, else Image */}
                    {project.previewVideo ? (
                        <video
                            ref={videoRef}
                            src={project.previewVideo}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            muted
                            loop
                            playsInline
                        />
                    ) : null}

                    {project.previewImage || project.images.length > 0 ? (
                        <img
                            src={project.previewImage ? project.previewImage.thumbnail : project.images[0].thumbnail}
                            alt={project.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered && project.previewVideo ? 'opacity-0' : 'opacity-100'}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
                            {/* Fallback if no image or video */}
                            <span className="text-sm">No Preview</span>
                        </div>
                    )}


                </motion.div>

                <div className="mt-6 text-center transform transition-transform group-hover:-translate-y-2">
                    <h3 className="text-3xl font-black font-sans tracking-tight text-black break-words leading-none">{project.title}</h3>
                    <p className="text-neutral-700 text-sm font-bold mt-2">{project.description ? project.description.substring(0, 50) + "..." : ""}</p>
                </div>
            </motion.div>

            {/* Expanded Modal View */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
                            onClick={() => setIsExpanded(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-card text-card-foreground w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors z-10"
                                >
                                    <X size={24} />
                                </button>

                                <h2 className="text-5xl font-black mb-4 tracking-tighter">{project.title}</h2>

                                {/* Project Links Section */}
                                {project.links && project.links.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {project.links.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-all text-sm uppercase tracking-wide border border-neutral-700 hover:border-neutral-500"
                                            >
                                                <span>{link.label}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <div className="prose dark:prose-invert max-w-none mb-8 text-lg text-gray-300">
                                    {project.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                                    {project.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative z-10 rounded-xl overflow-hidden shadow-md bg-neutral-900 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                                        >
                                            {img.thumbnail.endsWith('.mp4') || img.thumbnail.endsWith('.webm') ? (
                                                <video src={img.thumbnail} controls className="w-full h-full object-cover" />
                                            ) : img.thumbnail.endsWith('.pdf') ? (
                                                <div
                                                    className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer group/pdf p-4 text-center border border-zinc-700"
                                                    onClick={() => window.open(img.full, '_blank')}
                                                >
                                                    <div className="bg-red-500/10 p-4 rounded-full mb-3 group-hover/pdf:bg-red-500/20 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                            <path d="M9 15l3 3 3-3" />
                                                            <path d="M12 12v6" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-zinc-200 font-bold text-sm">View PDF Document</span>
                                                    <span className="text-zinc-500 text-xs mt-1 break-all px-2">{img.thumbnail.split('/').pop()}</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={img.thumbnail}
                                                    alt={`${project.title} ${idx + 1}`}
                                                    className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
                                                    onClick={() => setZoomedImage(img.full)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <ImageViewer
                src={zoomedImage}
                alt={project.title}
                onClose={() => setZoomedImage(null)}
            />
        </>
    );
}
