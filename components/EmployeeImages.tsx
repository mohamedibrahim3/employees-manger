"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, User, CreditCard, IdCard, AlertCircle } from "lucide-react";
import { copyFileSync } from "fs";
import { join } from "path";

interface EmployeeImagesProps {
  personalImageUrl?: string | null;
  idFrontImageUrl?: string | null;
  idBackImageUrl?: string | null;
  employeeName: string;
}

const EmployeeImages: React.FC<EmployeeImagesProps> = ({
  personalImageUrl,
  idFrontImageUrl,
  idBackImageUrl,
  employeeName,
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => ({ ...prev, [imageUrl]: true }));
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
    console.error("Failed to load image:", imageUrl);
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
    console.log("Image loaded successfully:", imageUrl);
  };

  const handleImageLoadStart = (imageUrl: string) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: true }));
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    try {
      const { app } = window.require("electron").remote;
      const downloadsPath = app.getPath("downloads");
      const localPath = imageUrl.replace("file://", "");
      const destPath = join(downloadsPath, filename);
      copyFileSync(localPath, destPath);
      console.log(`Image copied to ${destPath}`);
      alert(`تم نسخ الصورة إلى: ${destPath}`);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("حدث خطأ أثناء تحميل الصورة");
    }
  };

  const handleViewImage = (imageUrl: string) => {
    try {
      const { shell } = window.require("electron");
      shell.openExternal(imageUrl);
    } catch (error) {
      console.error("Error opening image:", error);
      alert("حدث خطأ أثناء فتح الصورة");
    }
  };

  const images = [
    {
      url: personalImageUrl,
      title: "الصورة الشخصية",
      description: "صورة شخصية للموظف",
      icon: User,
      filename: `${employeeName}_personal_image.jpg`,
      aspectRatio: "square",
    },
    {
      url: idFrontImageUrl,
      title: "الوجه الأمامي للهوية",
      description: "صورة الوجه الأمامي لبطاقة الهوية",
      icon: CreditCard,
      filename: `${employeeName}_id_front.jpg`,
      aspectRatio: "card",
    },
    {
      url: idBackImageUrl,
      title: "الوجه الخلفي للهوية",
      description: "صورة الوجه الخلفي لبطاقة الهوية",
      icon: IdCard,
      filename: `${employeeName}_id_back.jpg`,
      aspectRatio: "card",
    },
  ].filter((image) => image.url); // Only show images that exist

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          لا توجد صور مرفقة
        </h3>
        <p className="text-gray-500">لم يتم رفع أي صور أو وثائق لهذا الموظف</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => {
        const IconComponent = image.icon;
        const hasError = imageErrors[image.url!];
        const isLoading = loadingImages[image.url!];

        return (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">
                {image.title}
              </h3>
            </div>

            <div className="relative group overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <div className="relative w-full">
                {hasError ? (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-4 min-h-[200px]">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-xs text-center">فشل في تحميل الصورة</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewImage(image.url!)}
                      className="mt-2"
                    >
                      فتح في علامة تبويب جديدة
                    </Button>
                  </div>
                ) : (
                  <>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 min-h-[200px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                    <img
                      src={image.url!}
                      alt={image.description}
                      className={`w-full h-auto transition-transform group-hover:scale-105 ${
                        isLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onError={() => handleImageError(image.url!)}
                      onLoad={() => handleImageLoad(image.url!)}
                      onLoadStart={() => handleImageLoadStart(image.url!)}
                    />
                  </>
                )}
              </div>

              {!hasError && !isLoading && (
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewImage(image.url!)}
                      className="bg-white text-gray-800 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      عرض
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        handleDownloadImage(image.url!, image.filename)
                      }
                      className="bg-white text-gray-800 hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 text-center">
              {image.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeImages;