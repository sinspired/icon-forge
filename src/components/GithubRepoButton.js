"use client";
import { Github } from "lucide-react";

export default function GithubRepoButton({ repoUrl }) {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center -mr-2 px-1.5 py-1.5 rounded-full
                 bg-zinc-100 dark:bg-zinc-800
                 border border-zinc-200 dark:border-zinc-700
                 hover:bg-zinc-200 dark:hover:bg-zinc-700
                 transition-all"
    >
      <Github className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />

      {/* Tooltip */}
      {/* <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 opacity-0
                       group-hover:opacity-100 pointer-events-none
                       whitespace-nowrap px-2 py-1 text-[10px] rounded
                       bg-zinc-800 text-white dark:bg-zinc-700
                       transition-opacity z-50">
        View on GitHub
      </span> */}
    </a>
  );
}