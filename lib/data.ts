import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface ProjectData {
    slug: string;
    title: string;
    description: string;
    images: { thumbnail: string; full: string }[];
    previewVideo?: string; // Path to preview.mp4 if exists
    previewImage?: { thumbnail: string; full: string }; // Custom override for cover image
    links?: { label: string; url: string }[];
}

export interface ExperienceData {
    slug: string;
    title: string;
    description: string;
    images: { thumbnail: string; full: string }[]; // List of all images for cycling
}

function getSafeFileContent(dirPath: string, fileName: string): string {
    const filePath = path.join(dirPath, fileName);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
    }
    return "";
}

export function getProjects(): ProjectData[] {
    const projectsDir = path.join(PUBLIC_DIR, "Projects");

    if (!fs.existsSync(projectsDir)) {
        return [];
    }

    const items = fs.readdirSync(projectsDir, { withFileTypes: true });

    return items
        .filter((item) => item.isDirectory())
        .map((dir) => {
            const dirPath = path.join(projectsDir, dir.name);
            const files = fs.readdirSync(dirPath);

            // Description & Links Parsing
            const descFile = files.find((f) => f.toLowerCase() === "description.md" || f.toLowerCase() === "description.txt");
            let rawDescription = descFile ? getSafeFileContent(dirPath, descFile) : "";
            const links: { label: string; url: string }[] = [];

            // Extract links (Format: "Label: https://url")
            const linkRegex = /^([a-zA-Z0-9 ]+):\s*(https?:\/\/[^\s]+)/gm;
            let match;
            while ((match = linkRegex.exec(rawDescription)) !== null) {
                links.push({ label: match[1].trim(), url: match[2].trim() });
            }

            // Remove link lines from description to avoid duplication in display
            const description = rawDescription.replace(linkRegex, "").trim();

            // Preview Video (look for preview.mp4/webm/mov)
            const previewVideoFile = files.find((f) => f.toLowerCase().startsWith("preview.") && /\.(mp4|webm|mov)$/i.test(f));
            const previewVideo = previewVideoFile ? `/Projects/${dir.name}/${previewVideoFile}` : undefined;

            // Preview Image (look for preview_pic.png/jpg/etc)
            const previewPicFile = files.find((f) => f.toLowerCase().startsWith("preview_pic.") && /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

            // Images
            // 1. Filter for image files
            const allImages = files.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

            // 2. Separate standard images from "full" versions (containing .full.)
            const standardImages = allImages.filter(f => !f.toLowerCase().includes('.full.'));

            const processedImages = standardImages.map(f => {
                const ext = path.extname(f);
                const base = path.basename(f, ext);
                const fullVersionName = `${base}.full${ext}`;
                const hasFullVersion = files.includes(fullVersionName);

                return {
                    thumbnail: `/Projects/${dir.name}/${f}`,
                    full: hasFullVersion ? `/Projects/${dir.name}/${fullVersionName}` : `/Projects/${dir.name}/${f}`
                };
            });

            // Construct previewImage object if file exists
            let previewImage: { thumbnail: string; full: string } | undefined;
            if (previewPicFile) {
                // Check if it's already in processedImages (it likely is, as it's a valid image)
                // If so, reuse that object to ensure consistent paths/logic
                const existing = processedImages.find(img => img.thumbnail.endsWith(previewPicFile));
                if (existing) {
                    previewImage = existing;
                } else {
                    // Fallback if not found (e.g. if we excluded it regarding logic above, though currently we don't)
                    const ext = path.extname(previewPicFile);
                    const base = path.basename(previewPicFile, ext);
                    const fullVersionName = `${base}.full${ext}`;
                    const hasFullVersion = files.includes(fullVersionName);
                    previewImage = {
                        thumbnail: `/Projects/${dir.name}/${previewPicFile}`,
                        full: hasFullVersion ? `/Projects/${dir.name}/${fullVersionName}` : `/Projects/${dir.name}/${previewPicFile}`
                    };
                }
            }

            // Extra videos (non-preview) and PDFs could be added to images list for modal viewing
            const extraMedia = files
                .filter((f) => /\.(mp4|webm|mov|pdf)$/i.test(f) && f !== previewVideoFile)
                .map((f) => ({
                    thumbnail: `/Projects/${dir.name}/${f}`,
                    full: `/Projects/${dir.name}/${f}`
                }));

            return {
                slug: dir.name,
                title: dir.name.replace(/-/g, " "),
                description,
                images: [...processedImages, ...extraMedia],
                previewVideo,
                previewImage,
                links,
            };
        });
}

export function getExperiences(): ExperienceData[] {
    const expDir = path.join(PUBLIC_DIR, "Experience");

    if (!fs.existsSync(expDir)) {
        return [];
    }

    const items = fs.readdirSync(expDir, { withFileTypes: true });

    return items
        .filter((item) => item.isDirectory())
        .map((dir) => {
            const dirPath = path.join(expDir, dir.name);
            const files = fs.readdirSync(dirPath);

            // Description
            const descFile = files.find((f) => f.toLowerCase() === "description.md" || f.toLowerCase() === "description.txt");
            const description = descFile ? getSafeFileContent(dirPath, descFile) : "";

            // All images for cycling
            const allImages = files.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

            // Separate standard images from "full" versions
            const standardImages = allImages.filter(f => !f.toLowerCase().includes('.full.'));

            const processedImages = standardImages.map(f => {
                const ext = path.extname(f);
                const base = path.basename(f, ext);
                const fullVersionName = `${base}.full${ext}`;
                const hasFullVersion = files.includes(fullVersionName);

                return {
                    thumbnail: `/Experience/${dir.name}/${f}`,
                    full: hasFullVersion ? `/Experience/${dir.name}/${fullVersionName}` : `/Experience/${dir.name}/${f}`
                };
            });

            return {
                slug: dir.name,
                title: dir.name.replace(/-/g, " "),
                description,
                images: processedImages,
            };
        });
}
