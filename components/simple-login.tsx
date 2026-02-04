"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { recordUserConnection } from "@/lib/anti-fraud"
import type { User } from "@/hooks/use-api-data"

interface SimpleLoginProps {
  onSuccess: (user: User) => void
  onSwitchToSignup: () => void
}

export function SimpleLogin({ onSuccess, onSwitchToSignup }: SimpleLoginProps) {
  const [formData, setFormData] = useState({
    identifier: "", // Peut être email ou téléphone
    password: ""
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [errorCount, setErrorCount] = useState(0) // Nouveau compteur d'erreurs
  const [userDomain, setUserDomain] = useState("") // Domaine récupéré automatiquement

  // Détecter si l'identifiant est un email ou un téléphone
  const detectIdentifierType = (identifier: string): "email" | "phone" => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(identifier) ? "email" : "phone"
  }

  // Obtenir l'IP client
  const getClientIP = (): string | undefined => {
    if (typeof window !== 'undefined') {
      return undefined
    }
    return undefined
  }

  // Récupérer instantanément le domaine de l'utilisateur
  const fetchUserDomain = async (identifier: string) => {
    if (!identifier) {
      setUserDomain("")
      return
    }

    try {
      const identifierType = detectIdentifierType(identifier)
      let searchField = identifierType === "email" ? "email" : "phone"
      
      const response = await fetch(`/api/users?${searchField}=${encodeURIComponent(identifier)}`)
      if (response.ok) {
        const users = await response.json()
        const user = users.find((u: any) => 
          identifierType === "email" ? u.email === identifier : u.phone === identifier
        )
        
        if (user && user.domain) {
          setUserDomain(user.domain)
        } else {
          setUserDomain("")
        }
      }
    } catch (error) {
      // Silencieux en cas d'erreur
      setUserDomain("")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage(null)
    
    // Récupérer le domaine instantanément quand l'identifiant change
    if (field === "identifier") {
      fetchUserDomain(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      setMessage({
        type: "error",
        text: `Compte temporairement bloqué. Réessayez dans ${blockTimeLeft} secondes.`
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const identifierType = detectIdentifierType(formData.identifier)
      
      // CONNEXION DIRECTE PAR EMAIL OU TÉLÉPHONE
      // Appeler directement l'API de connexion
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [identifierType === 'email' ? 'email' : 'phone']: formData.identifier,
          password: formData.password
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const user = data.user || data
        
        // Enregistrer la connexion pour la sécurité
        recordUserConnection(user, getClientIP(), navigator.userAgent)
        
        // Stocker la session
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('loginTime', Date.now().toString())
        
        setMessage({
          type: "success",
          text: `Connexion réussie ! Bienvenue ${user.name}`
        })
        
        setAttempts(0)
        
        setTimeout(() => {
          onSuccess(user)
        }, 1500)
        
      } else {
        // Incrémenter les tentatives (limité à 2)
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        // Bloquer après 2 tentatives échouées
        if (newAttempts >= 2) {
          setIsBlocked(true)
          setBlockTimeLeft(30) // 30 secondes
          startBlockCountdown()
          
          setMessage({
            type: "error",
            text: "Trop de tentatives échouées. Compte bloqué pendant 30 secondes."
          })
        } else {
          const error = await response.json()
          setMessage({
            type: "error",
            text: error.error || "Mot de passe incorrect. Veuillez réessayer."
          })
        }
      }
    } catch (error) {
      // Incrémenter le compteur d'erreurs même en cas d'erreur technique
      const newErrorCount = errorCount + 1
      setErrorCount(newErrorCount)
      
      if (newErrorCount >= 2) {
        setIsBlocked(true)
        setBlockTimeLeft(300)
        
        const countdown = setInterval(() => {
          setBlockTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdown)
              setIsBlocked(false)
              setErrorCount(0)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        setMessage({
          type: "error",
          text: "Trop d'erreurs. Compte bloqué pour 5 minutes."
        })
      } else {
        setMessage({
          type: "error",
          text: "Erreur de connexion. Veuillez réessayer."
        })
      }
      
      setAttempts(prev => prev + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startBlockCountdown = () => {
    const interval = setInterval(() => {
      setBlockTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsBlocked(false)
          setErrorCount(0) // Réinitialiser après déblocage
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connexion Sécurisée</h2>
          <p className="text-muted-foreground text-sm">
            Accédez à votre espace avec votre email ou numéro de téléphone
          </p>
        </div>

        {/* Alertes de sécurité */}
        {attempts > 0 && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>
                {attempts === 1 && "Attention : Vérifiez bien vos identifiants"}
                {attempts === 2 && "Dernière tentative avant blocage"}
                {attempts >= 3 && "Compte bloqué temporairement"}
              </span>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email ou Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email ou numéro de téléphone</Label>
            <div className="relative">
              {detectIdentifierType(formData.identifier) === "email" ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              ) : (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              )}
              <Input
                id="identifier"
                type="text"
                value={formData.identifier}
                onChange={(e) => handleInputChange("identifier", e.target.value)}
                placeholder="votre@email.com ou +223 XX XX XX XX"
                className="pl-11 h-12"
                required
                disabled={isSubmitting || isBlocked}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Entrez votre email (ancien compte) ou votre numéro de téléphone (nouveau compte)
            </p>
            
            {/* Domaine récupéré automatiquement */}
            {userDomain && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-xs text-blue-700">
                  <span className="font-medium">Domaine détecté:</span> {userDomain}
                </p>
              </motion.div>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Votre mot de passe"
                className="pl-11 pr-11 h-12"
                required
                disabled={isSubmitting || isBlocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting || isBlocked}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
            disabled={isSubmitting || isBlocked || !formData.identifier || !formData.password}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : isBlocked ? (
              `Bloqué (${formatTime(blockTimeLeft)})`
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Informations de sécurité */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">
            🔐 Sécurité de connexion
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Protection contre les tentatives multiples</li>
            <li>• Blocage automatique après 3 échecs</li>
            <li>• Traçabilité des connexions</li>
            <li>• Support email et téléphone</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:underline font-medium"
            >
              Inscrivez-vous
            </button>
          </p>
          <p className="text-xs text-muted-foreground">
            Mot de passe oublié ? Contactez l'administration
          </p>
        </div>
      </div>
    </motion.div>
  )
}
