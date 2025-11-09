"use client";

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, CheckCircle, ImageIcon, AlertCircle } from 'lucide-react';
import { getPresignedUploadUrl } from '@/app/actions/file-actions';

interface FileUploadProps {
  onUploadComplete?: (fileUrl: string, key: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  key?: string;
  error?: string;
  uniqueId: string; // Add unique identifier
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/*",
  maxSize = 10,
  multiple = false,
  disabled = false,
  className = "",
  label = "Drop files here or click to browse",
  description,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  // Convert accept prop to dropzone format
  const acceptedFiles = useMemo(() => {
    if (accept === "image/*") {
      return {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      };
    }
    if (accept.includes("image")) {
      return {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      };
    }
    // For other file types, create a basic mapping
    if (accept) {
      return {
        [accept]: []
      };
    }
    return undefined;
  }, [accept]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    console.log('Starting upload for file:', file.name, file.type, file.size);
    
    // Generate unique ID for this upload
    const uniqueId = `${file.name}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setUploadingFiles(prev => [...prev, {
      file,
      progress: 0,
      status: 'uploading',
      uniqueId,
    }]);

    try {
      // Get presigned URL
      console.log('Getting presigned URL...');
      const { uploadUrl, key, fileUrl } = await getPresignedUploadUrl(file.name, file.type);
      console.log('Got presigned URL, key:', key);
      
      // Update progress
      setUploadingFiles(prev => prev.map(f => 
        f.uniqueId === uniqueId ? 
        { ...f, progress: 25 } : f
      ));

      // Upload to S3
      console.log('Uploading to S3...');
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('S3 upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('S3 upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      // Update progress
      setUploadingFiles(prev => prev.map(f => 
        f.uniqueId === uniqueId ? { 
          ...f, 
          progress: 100, 
          status: 'completed',
          url: fileUrl,
          key,
        } : f
      ));

      console.log('Upload completed successfully:', fileUrl);
      onUploadComplete?.(fileUrl, key);

    } catch (error) {
      console.error('Upload error details:', error);
      
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setUploadingFiles(prev => prev.map(f => 
        f.uniqueId === uniqueId ? { 
          ...f, 
          status: 'error',
          error: errorMessage,
        } : f
      ));

      onUploadError?.(errorMessage);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('onDrop called with:', { acceptedFiles, rejectedFiles });
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      console.log('Rejected file:', file.name, errors);
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          onUploadError?.(`File "${file.name}" is too large. Max size is ${maxSize}MB`);
        } else if (error.code === 'file-invalid-type') {
          onUploadError?.(`File "${file.name}" has invalid type. Accepted types: ${accept}`);
        } else {
          onUploadError?.(`File "${file.name}": ${error.message}`);
        }
      });
    });

    // Handle accepted files
    acceptedFiles.forEach(file => {
      console.log('Processing accepted file:', file.name, file.type, file.size);
      const error = validateFile(file);
      if (error) {
        console.log('Validation error:', error);
        onUploadError?.(error);
        return;
      }
      uploadFile(file);
    });
  }, [maxSize, accept, onUploadError]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({
    onDrop,
    onDragEnter: (event) => {
      console.log('onDragEnter:', event);
    },
    onDragLeave: (event) => {
      console.log('onDragLeave:', event);
    },
    onDragOver: (event) => {
      console.log('onDragOver:', event);
    },
    onDropAccepted: (files) => {
      console.log('onDropAccepted:', files);
    },
    onDropRejected: (rejectedFiles) => {
      console.log('onDropRejected:', rejectedFiles);
    },
    accept: acceptedFiles,
    maxSize: maxSize * 1024 * 1024,
    multiple,
    disabled,
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true,
    useFsAccessApi: false, // Disable File System Access API for better compatibility
  });

  const removeFile = (uniqueId: string) => {
    setUploadingFiles(prev => 
      prev.filter(f => f.uniqueId !== uniqueId)
    );
  };

  // Determine drop zone styling
  const getDropZoneClassName = () => {
    let baseClasses = `border-2 border-dashed transition-all duration-300 cursor-pointer h-auto rounded-lg ${className}`;
    
    if (disabled) {
      return `${baseClasses} border-gray-200 bg-gray-50 cursor-not-allowed opacity-50`;
    }
    
    if (isDragReject) {
      return `${baseClasses} border-red-500 bg-red-50 shadow-lg transform scale-[1.02]`;
    }
    
    if (isDragAccept || isDragActive) {
      return `${baseClasses} border-green-500 bg-green-50 shadow-lg transform scale-[1.02] ring-2 ring-green-200`;
    }
    
    return `${baseClasses} border-gray-300 hover:border-green-400 hover:bg-green-50 hover:shadow-md`;
  };

  const isImageFile = (file: File) => file.type.startsWith('image/');

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      {/* Enhanced Drop Zone */}
      <Card className={getDropZoneClassName()}>
        <div {...getRootProps()} style={{ outline: 'none' }}>
          <input {...getInputProps()} />
          <CardContent className="flex flex-col items-center justify-center py-8 px-6 min-h-[160px]">
            <div className="flex flex-col items-center space-y-4 max-w-full">
              {isDragActive ? (
                isDragReject ? (
                  <AlertCircle className="h-12 w-12 text-red-500 flex-shrink-0" />
                ) : (
                  <Upload className="h-12 w-12 text-green-500 animate-bounce flex-shrink-0" />
                )
              ) : (
                <div className="relative flex-shrink-0">
                  <Upload className="h-10 w-10 text-gray-400" />
                  {accept.includes('image') && (
                    <ImageIcon className="h-6 w-6 text-gray-300 absolute -bottom-1 -right-1" />
                  )}
                </div>
              )}
              
              <div className="text-center max-w-full">
                <p className={`text-lg font-medium mb-2 break-words ${
                  isDragActive 
                    ? isDragReject 
                      ? 'text-red-700' 
                      : 'text-green-700'
                    : 'text-gray-700'
                }`}>
                  {isDragActive
                    ? isDragReject
                      ? 'Some files will be rejected'
                      : 'Drop files here'
                    : label
                  }
                </p>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Max file size: {maxSize}MB</p>
                  {accept && <p className="break-words">Accepted: {accept}</p>}
                  {multiple && <p>Multiple files allowed</p>}
                  {description && <p className="break-words">{description}</p>}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This will trigger the file input
                  }}
                >
                  Browse Files
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Enhanced Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              Uploading {uploadingFiles.length} file{uploadingFiles.length !== 1 ? 's' : ''}
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadingFiles([])}
              className="text-xs flex-shrink-0"
            >
              Clear All
            </Button>
          </div>
          
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={uploadingFile.uniqueId} className="p-3 max-w-full overflow-hidden">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {isImageFile(uploadingFile.file) ? (
                    <ImageIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadingFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{(uploadingFile.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        uploadingFile.status === 'completed' ? 'text-green-600' :
                        uploadingFile.status === 'error' ? 'text-red-600' :
                        'text-green-600'
                      }`}>
                        {uploadingFile.status === 'uploading' ? 'Uploading...' :
                         uploadingFile.status === 'completed' ? 'Completed' :
                         'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {uploadingFile.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadingFile.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadingFile.uniqueId)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {uploadingFile.status === 'uploading' && (
                <div className="space-y-1">
                  <Progress value={uploadingFile.progress} className="w-full h-1.5" />
                  <p className="text-xs text-gray-500">
                    {uploadingFile.progress}% complete
                  </p>
                </div>
              )}
              
              {uploadingFile.status === 'error' && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-700 break-words">
                    <AlertCircle className="h-3 w-3 inline mr-1 flex-shrink-0" />
                    {uploadingFile.error}
                  </p>
                </div>
              )}
              
              {uploadingFile.status === 'completed' && uploadingFile.url && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-700 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    Upload completed successfully
                  </p>
                  {isImageFile(uploadingFile.file) && (
                    <div className="mt-2">
                      <img
                        src={uploadingFile.url}
                        alt={uploadingFile.file.name}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
