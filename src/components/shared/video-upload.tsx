"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Loader2, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  maxSize?: number; // in MB
  onFileChange?: (file: File | null) => void;
  existingUrl?: string;
  className?: string;
}

export function VideoUpload({
  maxSize = 50,
  onFileChange,
  existingUrl,
  className,
}: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (newFile: File | null) => {
    if (!newFile) return;

    // Check file type
    if (!newFile.type.startsWith("video/")) {
      alert("Выбранный файл не является видео");
      return;
    }

    // Check file size
    if (newFile.size > maxSize * 1024 * 1024) {
      alert(`Видео превышает максимальный размер ${maxSize}MB`);
      return;
    }

    setFile(newFile);
    
    // Create preview
    const url = URL.createObjectURL(newFile);
    setPreview(url);
    onFileChange?.(newFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onFileChange?.(null);
    if (preview && !existingUrl) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!preview ? (
        // Upload Area
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Загрузка...</p>
                </>
              ) : (
                <>
                  <Video className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-2">
                    Нажмите или перетащите видео сюда
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, MOV, AVI до {maxSize}MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </Card>
      ) : (
        // Preview
        <Card className="relative overflow-hidden">
          <div className="aspect-video relative bg-black">
            <video
              src={preview}
              controls
              className="w-full h-full"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {file && (
            <div className="p-4">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

