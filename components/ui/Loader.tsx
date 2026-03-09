import { cn } from "@/utils/helpers";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({ size = "md", className, text }: LoaderProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-slate-200 border-t-blue-600", sizes[size])} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
