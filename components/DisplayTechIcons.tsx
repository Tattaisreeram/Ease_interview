"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { mappings } from "@/constants";

interface TechIconProps {
  techStack: string[];
  useInterviewTheme?: boolean;
}

const DisplayTechIcons = ({ techStack, useInterviewTheme = false }: TechIconProps) => {
  const techIconBaseURL =
    "https://raw.githubusercontent.com/devicons/devicon/master/icons";

  const normalizeTechName = (tech: string) => {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings] || "react";
  };

  const getTechIcons = (techArray: string[]) => {
    return techArray.map((tech) => {
      const normalized = normalizeTechName(tech);
      return {
        tech,
        url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
      };
    });
  };

  // Generic tech icon SVG for interview theme
  const TechIcon = ({ tech }: { tech: string }) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" fill="white" />
      <path
        d="M8 8L12 12L16 8M8 16L12 12L16 16"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1" fill="black" />
    </svg>
  );

  if (useInterviewTheme) {
    return (
      <div className="flex flex-row">
        {techStack.slice(0, 3).map((tech, index) => (
          <div
            key={tech}
            className={cn(
              "relative group bg-black rounded-full p-2 flex items-center justify-center border border-white",
              index >= 1 && "-ml-3"
            )}
          >
            <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-black border border-white rounded-md shadow-md">
              {tech}
            </span>
            <TechIcon tech={tech} />
          </div>
        ))}
      </div>
    );
  }

  const techIcons = getTechIcons(techStack);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-gray-900 rounded-full p-2 flex items-center justify-center border border-gray-700",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-md">
            {tech}
          </span>
          <Image
            src={url}
            alt={tech}
            width={24}
            height={24}
            className="size-5"
            onError={(e) => {
              // Fallback to default tech icon if the specific icon fails to load
              (e.target as HTMLImageElement).src = "/tech.svg";
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
