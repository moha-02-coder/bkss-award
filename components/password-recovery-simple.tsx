"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordRecoverySimpleProps {
  onBack: () => void
}

export function PasswordRecoverySimple({ onBack }: PasswordRecoverySimpleProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Valider le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setMessage({
          type: "error",
          text: "Veuillez entrer une adresse email valide"
        })
        setIsSubmitting(false)
        return
      }

      // Vérifier si l'email existe dans la base
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const users = await response.json()
        const user = users.find((u: any) => u.email === email)

        if (!user) {
          setMessage({
            type: "error",
            text: "Aucun compte trouvé avec cet email. Veuillez vous inscrire d'abord."
          })
          setIsSubmitting(false)
          return
        }

        // Simuler l'envoi d'email de récupération
        // En production, vous utiliserez un service d'envoi d'emails réel
        setMessage({
          type: "success",
          text: `Instructions de récupération envoyées à ${email}. Vérifiez votre boîte de réception.`
        })

        // Simuler un délai d'envoi
        setTimeout(() => {
          setIsSubmitting(false)
        }, 2000)

      } else {
        setMessage({
          type: "error",
          text: "Erreur lors de la vérification de l'email."
        })
        setIsSubmitting(false)
      }

    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de connexion. Veuillez réessayer."
      })
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Récupération du Mot de Passe</h2>
          <p className="text-muted-foreground text-sm">
            Entrez votre email pour recevoir les instructions de récupération
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="pl-11 h-12"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </motion.div>
          )}

          {/* Boutons */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer les instructions"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Button>
          </div>
        </form>

        {/* Informations */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">
            📧 Instructions de récupération
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Entrez l'email utilisé lors de votre inscription</li>
            <li>• Vous recevrez un lien pour réinitialiser votre mot de passe</li>
            <li>• Le lien est valide pendant 24 heures</li>
            <li>• Vérifiez votre dossier spam si nécessaire</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
