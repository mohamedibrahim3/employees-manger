'use client';

import {
  UploaderProvider,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { ReactNode } from 'react';

const localUploadFn: UploadFn = async ({
  file,
  signal,
  onProgressChange,
}) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgressChange(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        onProgressChange(100);
        resolve({ url: response.url }); 
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.error || `Upload failed: ${xhr.statusText}`));
        } catch (e) {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload.'));
    });

    signal.addEventListener('abort', () => {
      xhr.abort();
      reject(new Error('Upload canceled'));
    });

    xhr.open('POST', '/api/upload', true);
    xhr.send(formData);
  });
};

export function LocalUploaderWrapper({ children }: { children: ReactNode }) {
  return (
    <UploaderProvider
      uploadFn={localUploadFn}
      autoUpload={true}
      onUploadCompleted={(file) => {
        console.log('Local Upload Complete:', file.url);
      }}
      onFileRemoved={(key) => {
        console.log('File removed:', key);

      }}
    >
      {children}
    </UploaderProvider>
  );
}