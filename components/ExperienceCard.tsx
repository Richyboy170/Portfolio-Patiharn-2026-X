"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExperienceData } from "@/lib/data";
import { X } from "lucide-react";
import { ImageViewer } from "./ImageViewer";

interface ExperienceCardProps {
    experience: ExperienceData;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Image cycling logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered && experience.images.length > 1) {
            interval = setInterval(() => {
                setActiveImageIndex((prev) => (prev + 1) % experience.images.length);
            }, 600); // Change image every 600ms
        } else {
            setActiveImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, experience.images.length]);

    // Scroll lock effect


    return (
        <>
            <motion.div
                className="relative group cursor-pointer border border-neutral-800 bg-neutral-900/50 rounded-xl overflow-hidden hover:border-neutral-600 transition-colors"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsExpanded(true)}
                whileHover={{ y: -5 }}
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Image Preview Area */}
                    <div className="w-full md:w-1/3 h-48 md:h-auto bg-black relative overflow-hidden">
                        {experience.images.length > 0 ? (
                            <img
                                src={experience.images[activeImageIndex].thumbnail}
                                alt={`${experience.title} preview`}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs uppercase tracking-widest">
                                No Preview
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-1 flex flex-col justify-center bg-white/80">
                        <h3 className="text-2xl font-bold font-sans text-black mb-2">{experience.title}</h3>
                        <p className="text-neutral-800 text-sm font-medium line-clamp-3">
                            {experience.description || "Click to see details."}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Expanded Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                            onClick={() => setIsExpanded(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-neutral-900 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 border border-neutral-800 shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-800 transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <h2 className="text-4xl font-bold mb-6">{experience.title}</h2>
                                <div className="prose prose-invert max-w-none mb-8 text-neutral-300">
                                    {experience.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>

                                {/* Gallery Grid */}
                                {experience.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px]">
                                        {experience.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative z-10 rounded-lg overflow-hidden bg-neutral-800 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'}`}
                                            >
                                                <img
                                                    src={img.thumbnail}
                                                    alt={`${experience.title} ${idx}`}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                                                    onClick={() => setZoomedImage(img.full)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <ImageViewer
                src={zoomedImage}
                alt={experience.title}
                onClose={() => setZoomedImage(null)}
            />
        </>
    );
}
