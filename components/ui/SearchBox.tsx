"use client";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers";

interface SearchBoxProps {
  onSearch: (query: string, type: "all" | "title" | "content") => void;
  placeholder?: string;
  initialValue?: string;
  initialType?: "all" | "title" | "content";
  className?: string;
  large?: boolean;
}

export default function SearchBox({
  onSearch,
  placeholder = "Search test methods...",
  initialValue = "",
  initialType = "all",
  className,
  large = false,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialValue);
  const [type, setType] = useState<"all" | "title" | "content">(initialType);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initialValue and initialType when they change (e.g. on page load)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  // Press "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value, type);
  };

  const handleClear = () => {
    setValue("");
    onSearch("", type);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400",
              large ? "h-6 w-6" : "h-5 w-5"
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-white pr-12 pl-12 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              large ? "py-4 text-lg" : "py-3 text-base"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value as any;
            setType(newType);
            if (value) onSearch(value, newType);
          }}
          className={cn(
            "rounded-xl border border-slate-200 bg-white px-4 text-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer",
            large ? "py-4 text-lg" : "py-3 text-base"
          )}
        >
          <option value="all">All</option>
          <option value="title">Title</option>
          <option value="content">Content</option>
        </select>
      </div>
    </form>
  );
}
