"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn, formatFileSize } from "@/utils/helpers";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

interface FileUploaderProps {
  onSuccess?: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader({ onSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!ALLOWED_FILE_TYPES.includes(f.type)) {
      setError("Invalid file type. Please upload PDF, JPG, PNG, or TIFF.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 50MB.");
      return;
    }
    setError("");
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);

      setProgress(30);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setProgress(80);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setProgress(100);
      setStatus("success");
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setStatus("idle");
        setProgress(0);
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 transition-all",
            dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
          )}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-800">Drop your file here</h3>
          <p className="mb-4 text-center text-slate-500">
            or click to browse your files
          </p>
          <p className="text-xs text-slate-400">PDF, JPG, PNG, TIFF · Max 50MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.tiff"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        /* File Selected */
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <File className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            {status === "idle" && (
              <button onClick={() => { setFile(null); setTitle(""); }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Title input */}
      {file && status === "idle" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}

      {/* Progress bar */}
      {status === "uploading" && (
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600 font-medium">Uploading & processing...</span>
            <span className="text-blue-600 font-bold">{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Running OCR and extracting structured procedures... This may take a moment.
          </p>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4 text-green-700">
          <CheckCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">Upload successful!</p>
            <p className="text-sm text-green-600">Document processed and indexed.</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Upload button */}
      {file && status === "idle" && (
        <button
          onClick={handleUpload}
          disabled={!file}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Upload className="h-5 w-5" />
          Upload & Process Document
        </button>
      )}
    </div>
  );
}
