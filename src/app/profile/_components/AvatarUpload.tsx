"use client";

import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Camera, Trash, Upload, User, X } from "lucide-react";
import { deleteAvatar, uploadAvatar } from "../_actions/profile";
import { toast } from "sonner";
import Image from "next/image";
import getPublicUrl from "@/lib/getPublicUrl";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface AvatarUploadProps {
  userId: string;
  currentAvatar?: string;
  userName: string;
  setUser?: any;
}

export default function AvatarUpload({
  userId,
  currentAvatar,
  userName,
  setUser,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file || !previewUrl) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to server
      const uploadResponse = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok)
        throw new Error(uploadResult.error || "Upload failed");

      // Update user avatar in database
      const result = await uploadAvatar(userId, uploadResult.url);

      if (result.success) {
        toast.success(result.message);
        setUser((prev: any) => ({
          ...prev,
          avatar: uploadResult.url,
        }));
        setPreviewUrl(null);
        if (fileInput) fileInput.value = "";
        await update({ image: uploadResult.url });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (
      !currentAvatar ||
      !confirm("Are you sure you want to delete your avatar?")
    )
      return;

    setIsDeleting(true);
    try {
      const result = await deleteAvatar(userId);

      const response = await fetch("/api/upload/avatar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentAvatar }),
      });

      if (!response.ok) {
        console.error("Failed to delete avatar file, but database updated");
      }

      if (result.success) {
        toast.success(result.message);
        setUser((prev: any) => ({
          ...prev,
          avatar: null,
        }));
        await update({ image: null });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete avatar"
      );
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group" title="Click to upload new avatar">
      <div className="relative">
        {previewUrl ? (
          <Image
            className="size-16 sm:size-20 rounded-full object-cover border-2 border-muted transition-colors group-hover:border-primary/50"
            src={previewUrl}
            alt={userName}
            width={80}
            height={80}
          />
        ) : (
          <Avatar className="size-16 sm:size-20 grid place-content-center bg-background/50 text-foreground">
            <AvatarImage src={getPublicUrl(currentAvatar)} alt={userName} />
            <AvatarFallback className="text-4xl">
              {userName.charAt(0) || <User className="size-16" />}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0"
            onClick={openFileDialog}
            disabled={isUploading || isDeleting}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>

          {currentAvatar && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0"
              onClick={handleDeleteAvatar}
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Upload progress indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
            <div className="text-white text-xs font-medium">Uploading...</div>
          </div>
        )}

        {/* Delete progress indicator */}
        {isDeleting && (
          <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
            <div className="text-white text-xs font-medium">Deleting...</div>
          </div>
        )}
      </div>

      {/* Preview controls */}
      {previewUrl && (
        <div className="absolute -bottom-2 left-0 right-0 flex justify-center space-x-2">
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
            className="h-8 px-3"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
            className="h-8 px-3"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
