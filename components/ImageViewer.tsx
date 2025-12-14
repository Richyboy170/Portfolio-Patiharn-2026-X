"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageViewerProps {
    src: string | null;
    alt: string;
    onClose: () => void;
}

export function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
    const [isZoomed, setIsZoomed] = React.useState(false);

    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {src && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                    onClick={() => {
                        setIsZoomed(false);
                        onClose();
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(false);
                            onClose();
                        }}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 pointer-events-auto"
                    >
                        <X size={32} />
                    </button>

                    {/* Image */}
                    <motion.img
                        src={src}
                        alt={alt}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: isZoomed ? 2 : 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        drag={isZoomed}
                        dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
                        className={`max-w-[90vw] max-h-[85vh] object-contain pointer-events-auto shadow-2xl rounded-3xl transition-cursor ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
