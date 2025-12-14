'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 10,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach(file => {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} не является изображением`);
        return;
      }

      // Проверяем размер
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} превышает максимальный размер ${maxSizeMB}MB`);
        return;
      }

      // Проверяем лимит
      if (images.length + validFiles.length >= maxImages) {
        alert(`Максимум ${maxImages} изображений`);
        return;
      }

      validFiles.push(file);

      // Создаем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreviews([...previews, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }
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
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop зона */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Нажмите для выбора или перетащите файлы
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF до {maxSizeMB}MB (макс. {maxImages} файлов)
            </p>
          </div>
        </div>
      </div>

      {/* Превью загруженных изображений */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Счетчик */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} из {maxImages} изображений
        </p>
      )}
    </div>
  );
}
