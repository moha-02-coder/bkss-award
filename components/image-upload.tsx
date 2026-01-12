"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  currentImage: string
  onImageChange: (imageUrl: string) => void
  label?: string
}

export function ImageUpload({ currentImage, onImageChange, label = "Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    // Convert to base64 for local storage
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setPreview(base64)
      onImageChange(base64)
      setIsUploading(false)
    }
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError("Veuillez entrer une URL")
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      setError("URL invalide")
      return
    }

    setError(null)
    setPreview(urlInput)
    onImageChange(urlInput)
    setUrlInput("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant={uploadMode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("upload")}
          className={uploadMode === "upload" ? "bg-primary text-primary-foreground" : ""}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          className={uploadMode === "url" ? "bg-primary text-primary-foreground" : ""}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          URL
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {uploadMode === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isUploading ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
                  />
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Glissez une image ici</p>
                    <p className="text-sm text-muted-foreground">ou cliquez pour parcourir</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2"
          >
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button type="button" onClick={handleUrlSubmit}>
              <Check className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative inline-block"
        >
          <img
            src={preview || "/placeholder.svg"}
            alt="Aperçu"
            className="w-24 h-24 rounded-xl object-cover border border-border"
            onError={() => setError("Impossible de charger l'image")}
          />
          <button
            type="button"
            onClick={() => {
              setPreview("")
              onImageChange("")
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
