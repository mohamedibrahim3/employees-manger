import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    console.log(`File uploaded successfully: ${fileName}`); // للتأكد

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      success: true
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 });
    }

    const fileName = filePath.replace('/uploads/', '');
    const fullPath = path.join(process.cwd(), "public", "uploads", fileName);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}