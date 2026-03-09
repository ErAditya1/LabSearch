"use client";
import { StructuredData } from "@/types/document";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionProps {
  title: string;
  content: string | string[] | undefined;
  color: string;
  emoji: string;
}

function Section({ title, content, color, emoji }: SectionProps) {
  const [expanded, setExpanded] = useState(true);
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  return (
    <div className={`mb-4 rounded-2xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          {Array.isArray(content) ? (
            <ul className="space-y-2">
              {content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface StructuredViewProps {
  data: StructuredData;
}

export default function StructuredView({ data }: StructuredViewProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-400">
        <p>No structured data extracted. View the extracted text instead.</p>
      </div>
    );
  }

  return (
    <div>
      <Section title="Principle" content={data.principle} color="border-blue-100 bg-blue-50" emoji="🔬" />
      <Section title="Reagents & Materials" content={data.reagents} color="border-green-100 bg-green-50" emoji="🧪" />
      <Section title="Procedure" content={data.procedure} color="border-amber-100 bg-amber-50" emoji="📋" />
      <Section title="Calculation" content={data.calculation} color="border-purple-100 bg-purple-50" emoji="🧮" />
      <Section title="Precautions" content={data.precautions} color="border-red-100 bg-red-50" emoji="⚠️" />
      <Section title="Notes" content={data.notes} color="border-slate-100 bg-slate-50" emoji="📝" />
    </div>
  );
}
