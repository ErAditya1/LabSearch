"use client";
import FileUploader from "@/components/upload/FileUploader";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText, Zap, Database } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (role === "viewer") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-slate-300" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-600">Upload Not Available</p>
          <p className="text-sm text-slate-400">Viewer accounts cannot upload documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Info banner */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { icon: FileText, title: "Supported Files", desc: "PDF, JPG, PNG, TIFF up to 50MB", color: "text-blue-600 bg-blue-50" },
          { icon: Zap, title: "Auto OCR", desc: "Text extracted automatically from images", color: "text-amber-600 bg-amber-50" },
          { icon: Database, title: "Indexed Instantly", desc: "Searchable immediately after upload", color: "text-green-600 bg-green-50" },
        ].map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Upload Lab Manual</h2>
        <FileUploader onSuccess={() => setTimeout(() => router.push("/dashboard/library"), 1000)} />
      </div>

      {/* Tips */}
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">Tips for best OCR results</p>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• Use high-resolution scans (300 DPI or higher)</li>
              <li>• Ensure text is clearly legible and not skewed</li>
              <li>• PDFs with embedded text extract faster and more accurately</li>
              <li>• Standard lab manual formatting improves section detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
