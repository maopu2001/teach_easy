import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { uploadFile } from "@/lib/s3-service";
import { auth } from "@/lib/next-auth";
import { deleteFile } from "@/lib/s3-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!config.file.allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > config.file.maxFileSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const userId = session?.user?.id || "unknown-user";
    const fileName = `${userId}_${timestamp}.${fileExtension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileUrl = await uploadFile(
      buffer,
      fileName,
      file.type,
      "users/avatars"
    );

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { url: fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" },
        { status: 400 }
      );
    }

    if (fileUrl.includes("users/avatars") && !fileUrl.includes(session.user.id))
      return NextResponse.json(
        { error: "You can only delete your own avatars" },
        { status: 403 }
      );

    const success = await deleteFile(fileUrl);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
