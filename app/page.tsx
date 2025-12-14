import React from "react";
import { LetterCollision } from "@/components/LetterCollision";
import { Background3D } from "@/components/Background3D";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { getProjects, getExperiences } from "@/lib/data";

export default function Home() {
  const projects = getProjects();
  const experiences = getExperiences();

  return (
    <div className="overflow-x-hidden min-h-screen bg-background text-foreground scroll-smooth">
      {/* <Background3D /> */}

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-start px-2">
        <LetterCollision />
        <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce pointer-events-none">
          <span className="text-sm uppercase tracking-[0.2em] text-black font-bold">Scroll to Explore</span>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="relative z-10 min-h-screen py-24 px-6 md:px-12 lg:px-24 flex flex-col justify-center">
        <h2 className="text-6xl md:text-8xl font-black mb-20 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
          SELECTED<br />WORKS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl mx-auto">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="relative z-10 min-h-screen py-24 px-6 md:px-12 lg:px-24 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight text-white">
          EXPERIENCE
        </h2>
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.slug} experience={exp} />
          ))}
          {experiences.length === 0 && (
            <div className="text-neutral-500 text-xl">
              No experience entries found. Add folders to <code>public/Experience</code>.
            </div>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 min-h-[50vh] py-24 px-6 md:px-12 lg:px-24 flex flex-col justify-center items-center text-center">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-6 text-white">ABOUT ME</h2>
          <p className="text-xl md:text-2xl leading-relaxed text-white font-medium">
            I am a creative developer passionate about building immersive digital experiences.
            By checking the <code>public/CV Final Original.pdf</code>, you can see my full background.
            This portfolio is a showcase of my journey in merging design, technology, and interaction.
          </p>
          <div className="mt-12">
            <a
              href="/CV Final Original.pdf"
              target="_blank"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-colors text-lg font-bold tracking-widest uppercase"
            >
              View Full Resume
            </a>
          </div>
        </div>

        <footer className="mt-24 text-white text-sm font-semibold">
          © 2026 Portfolio. Built with Next.js, Three.js & Tailwind.
        </footer>
      </section>
    </div>
  );
}
