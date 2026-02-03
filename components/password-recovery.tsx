"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, ArrowLeft, Check, AlertCircle, Key, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/types"

interface PasswordRecoveryProps {
  users: User[]
  setUsers: (users: User[]) => void
  onBack: () => void
}

type Step = "email" | "verify" | "reset" | "success"

export function PasswordRecovery({ users, setUsers, onBack }: PasswordRecoveryProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    const user = users.find((u) => u.email === email)
    if (!user) {
      setError("Aucun compte associé à cet email")
      setIsLoading(false)
      return
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(code)

    // In a real app, this would send an email
    console.log(`[v0] Code de récupération pour ${email}: ${code}`)

    setIsLoading(false)
    setStep("verify")
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    if (verificationCode !== generatedCode) {
      setError("Code incorrect. Réessayez.")
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setStep("reset")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))

    // Update user password (in localStorage through users state)
    const updatedUsers = users.map((u) => (u.email === email ? { ...u, password: newPassword } : u))
    setUsers(updatedUsers)

    setIsLoading(false)
    setStep("success")
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold">Récupération du mot de passe</h2>
              <p className="text-sm text-muted-foreground">
                {step === "email" && "Entrez votre email pour recevoir un code"}
                {step === "verify" && "Entrez le code de vérification"}
                {step === "reset" && "Créez un nouveau mot de passe"}
                {step === "success" && "Mot de passe réinitialisé"}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {["email", "verify", "reset", "success"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  ["email", "verify", "reset", "success"].indexOf(step) >= i ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="recoveryEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="recoveryEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Envoyer le code"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 2: Verify Code */}
            {step === "verify" && (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <div className="p-4 bg-primary/10 rounded-xl text-center mb-4">
                  <Key className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Un code a été envoyé à <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Code de démo: <strong>{generatedCode}</strong>)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Code de vérification</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="h-12 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Vérifier"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-11 pr-11 h-12"
                      required
                      minLength={4}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Réinitialiser"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mot de passe réinitialisé</h3>
                <p className="text-muted-foreground mb-6">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <Button onClick={onBack} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  Retour à la connexion
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-destructive/10 text-destructive border border-destructive/20"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
