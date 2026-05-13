import { useState, useRef } from "react";
import { Camera, Pencil, Trash2, X } from "lucide-react";
import type { Image } from "../types";
import { DrawingCanvas } from "./DrawingCanvas";

interface ImageGridProps {
  images: Image[];
  onAddImage: (dataUrl: string, caption: string, isDrawing: boolean) => void;
  onDeleteImage: (imageId: string) => void;
}

export function ImageGrid({ images, onAddImage, onDeleteImage }: ImageGridProps) {
  const [lightboxImage, setLightboxImage] = useState<Image | null>(null);
  const [showDrawing, setShowDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onAddImage(dataUrl, "", false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleDrawingSave(dataUrl: string) {
    onAddImage(dataUrl, "", true);
    setShowDrawing(false);
  }

  return (
    <div>
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group"
            >
              <img
                src={img.dataUrl}
                alt={img.caption || (img.isDrawing ? "Ritning" : "Bild")}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightboxImage(img)}
              />
              {img.isDrawing && (
                <span className="absolute top-1 left-1 bg-wood-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  ritning
                </span>
              )}
              <button
                onClick={() => onDeleteImage(img.id)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-active:opacity-100 sm:group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 active:bg-slate-50 transition-colors"
        >
          <Camera size={18} />
          Lägg till bild
        </button>
        <button
          onClick={() => setShowDrawing(true)}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 active:bg-slate-50 transition-colors"
        >
          <Pencil size={18} />
          Rita skiss
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-4 right-4 p-2 text-white">
            <X size={24} />
          </button>
          <img
            src={lightboxImage.dataUrl}
            alt={lightboxImage.caption || ""}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Drawing canvas modal */}
      {showDrawing && (
        <DrawingCanvas
          onSave={handleDrawingSave}
          onClose={() => setShowDrawing(false)}
        />
      )}
    </div>
  );
}
