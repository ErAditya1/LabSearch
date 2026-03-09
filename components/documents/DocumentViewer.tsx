"use client";

import { useState } from "react";
import { X, Copy, Printer, ExternalLink, CheckCircle, FlaskConical, BookOpen, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  document: any;
  onClose: () => void;
}

type Tab = "original" | "text" | "structured";

export function DocumentViewer({ document: doc, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("structured");
  const [copied, setCopied] = useState(false);
  const [stepMode, setStepMode] = useState(false);

  const tabs = [
    { id: "structured" as Tab, label: "Structured View", icon: FlaskConical },
    { id: "text" as Tab, label: "Extracted Text", icon: BookOpen },
    { id: "original" as Tab, label: "Original File", icon: FileText },
  ];

  const copyProcedure = () => {
    const text = doc.structuredData?.procedure || doc.extractedText || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const printProcedure = () => {
    window.print();
  };

  const procedureSteps = doc.structuredData?.procedure
    ?.split(/\n/)
    .map((s: string) => s.replace(/^[\d.\-•*]\s*/, "").trim())
    .filter((s: string) => s.length > 5) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-lg font-bold text-foreground truncate">{doc.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {doc.fileType?.toUpperCase()} document
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyProcedure}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
              title="Copy procedure"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
            <button
              onClick={printProcedure}
              className="p-2 rounded-lg border border-border hover:bg-muted transition text-muted-foreground"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 border-b border-border">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition -mb-px border-b-2
                ${activeTab === id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === "structured" && (
            <StructuredView
              data={doc.structuredData}
              rawText={doc.extractedText}
              stepMode={stepMode}
              onToggleStepMode={() => setStepMode(!stepMode)}
              steps={procedureSteps}
            />
          )}

          {activeTab === "text" && (
            <div className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-xl p-4 max-h-full overflow-auto">
              {doc.extractedText || "No text extracted from this document."}
            </div>
          )}

          {activeTab === "original" && (
            <div className="text-center py-8">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition"
              >
                <ExternalLink className="w-5 h-5" />
                Open Original File
              </a>
              <p className="text-sm text-muted-foreground mt-3">
                Opens in a new tab via ImageKit CDN
              </p>
              {doc.fileType?.includes("pdf") && (
                <iframe
                  src={doc.fileUrl}
                  className="w-full h-96 mt-4 rounded-xl border border-border"
                  title="Document preview"
                />
              )}
              {(doc.fileType?.includes("image") || ["jpg","jpeg","png","tiff"].some((t: string) => doc.fileUrl?.includes(t))) && (
                <img
                  src={doc.fileUrl}
                  alt={doc.title}
                  className="max-w-full mx-auto mt-4 rounded-xl border border-border"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;

function StructuredView({ data, rawText, stepMode, onToggleStepMode, steps }: {
  data: any;
  rawText: string;
  stepMode: boolean;
  onToggleStepMode: () => void;
  steps: string[];
}) {
  if (!data || Object.keys(data).every(k => !data[k] || (Array.isArray(data[k]) && data[k].length === 0))) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No structured data could be extracted.</p>
        <p className="text-sm text-muted-foreground mt-1">Check the Extracted Text tab to view the raw content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {data.principle && (
        <Section title="🔬 Principle" color="blue">
          <p className="text-sm text-foreground leading-relaxed">{data.principle}</p>
        </Section>
      )}

      {data.reagents?.length > 0 && (
        <Section title="⚗️ Reagents & Chemicals" color="purple">
          <ul className="space-y-1">
            {data.reagents.map((r: string, i: number) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary font-mono text-xs mt-0.5">{String(i+1).padStart(2,'0')}</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.procedure && (
        <Section
          title="📋 Procedure"
          color="green"
          action={
            <button
              onClick={onToggleStepMode}
              className="text-xs px-2 py-1 rounded-lg border border-border hover:bg-muted transition text-muted-foreground"
            >
              {stepMode ? "Paragraph View" : "Step Mode"}
            </button>
          }
        >
          {stepMode ? (
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.procedure}</p>
          )}
        </Section>
      )}

      {data.calculation && (
        <Section title="🧮 Calculations" color="orange">
          <p className="text-sm font-mono text-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
            {data.calculation}
          </p>
        </Section>
      )}

      {data.precautions?.length > 0 && (
        <Section title="⚠️ Precautions" color="red">
          <ul className="space-y-1">
            {data.precautions.map((p: string, i: number) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                {p}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.notes && (
        <Section title="📝 Notes" color="gray">
          <p className="text-sm text-foreground leading-relaxed">{data.notes}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, children, action }: {
  title: string;
  color: "blue"|"purple"|"green"|"orange"|"red"|"gray";
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const colors = {
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20",
    purple: "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20",
    green: "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20",
    orange: "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20",
    red: "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20",
    gray: "border-border bg-muted/30",
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
