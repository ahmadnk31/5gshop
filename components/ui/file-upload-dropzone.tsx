'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle,
  Image as ImageIcon,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadDropzoneProps {
  onFileUpload: (file: File) => Promise<string>
  accept?: Record<string, string[]>
  maxSize?: number
  multiple?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
  description?: string
}

interface UploadFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
}

export function FileUploadDropzone({
  onFileUpload,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className,
  disabled = false,
  placeholder = "Drag & drop files here, or click to select",
  description = "Upload files up to 5MB"
}: FileUploadDropzoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Upload files one by one
    for (let i = 0; i < newFiles.length; i++) {
      const uploadFile = newFiles[i]
      const fileIndex = files.length + i

      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { ...f, status: 'uploading', progress: 0 } : f
        ))

        // Simulate progress (you can implement real progress tracking)
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map((f, idx) => 
            idx === fileIndex && f.status === 'uploading' 
              ? { ...f, progress: Math.min(f.progress + 10, 90) } 
              : f
          ))
        }, 100)

        // Upload the file
        const url = await onFileUpload(uploadFile.file)

        clearInterval(progressInterval)

        // Update status to success
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex 
            ? { ...f, status: 'success', progress: 100, url } 
            : f
        ))
      } catch (error) {
        // Update status to error
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex 
            ? { 
                ...f, 
                status: 'error', 
                progress: 0, 
                error: error instanceof Error ? error.message : 'Upload failed' 
              } 
            : f
        ))
      }
    }
  }, [files.length, onFileUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const retryUpload = async (index: number) => {
    const file = files[index]
    if (!file || file.status !== 'error') return

    try {
      setFiles(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'uploading', progress: 0, error: undefined } : f
      ))

      const url = await onFileUpload(file.file)

      setFiles(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'success', progress: 100, url } : f
      ))
    } catch (error) {
      setFiles(prev => prev.map((f, idx) => 
        idx === index 
          ? { 
              ...f, 
              status: 'error', 
              progress: 0, 
              error: error instanceof Error ? error.message : 'Upload failed' 
            } 
          : f
      ))
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'uploading':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <Card 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive && !isDragReject && "border-blue-500 bg-blue-50",
          isDragReject && "border-red-500 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed",
          !isDragActive && !isDragReject && "border-gray-300 hover:border-gray-400"
        )}
      >
        <div className="p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragActive ? "Drop files here..." : placeholder}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {description}
          </p>
          <Button variant="outline" type="button" disabled={disabled}>
            Choose Files
          </Button>
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length})
          </h4>
          
          {files.map((uploadFile, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(uploadFile.file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadFile.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="capitalize">{uploadFile.status}</span>
                  </div>

                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="mt-2" />
                  )}

                  {/* Error Message */}
                  {uploadFile.status === 'error' && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-red-600">{uploadFile.error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryUpload(index)}
                        className="h-6 text-xs"
                      >
                        Retry
                      </Button>
                    </div>
                  )}

                  {/* Success URL */}
                  {uploadFile.status === 'success' && uploadFile.url && (
                    <div className="mt-2">
                      <a 
                        href={uploadFile.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View uploaded file
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
