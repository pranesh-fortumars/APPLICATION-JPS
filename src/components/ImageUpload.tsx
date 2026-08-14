"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/firestore"; // oops, firebase/storage
import { app } from "@/lib/firebase/config";
import { getStorage as getFirebaseStorage } from "firebase/storage";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

const storage = getFirebaseStorage(app);

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
  currentUrl?: string;
  label?: string;
}

export default function ImageUpload({ onUploadSuccess, onRemove, currentUrl, label = "Upload Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `products/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        alert("Upload failed. Please try again.");
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUploadSuccess(downloadURL);
        setUploading(false);
      }
    );
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">{label}</label>
      
      {currentUrl ? (
        <div className="relative w-full h-48 border border-black/10 rounded-sm overflow-hidden bg-black/5 group">
          <img src={currentUrl} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button" 
              onClick={onRemove}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-48 border-2 border-dashed border-black/20 rounded-sm flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors">
          {uploading ? (
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm font-bold">{Math.round(progress)}%</p>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-foreground/40 mb-2" />
              <p className="text-sm text-foreground/60 font-bold mb-1">Click to Upload</p>
              <p className="text-xs text-foreground/40">PNG, JPG up to 5MB</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
