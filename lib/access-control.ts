// Configuration du contrôle d'accès
export const ACCESS_CONFIG = {
  // Mettre à true pour bloquer l'accès au plateforme
  isBlocked: true,
  
  // Date limite pour le paiement (15 février 2026)
  deadline: new Date('2026-02-15'),
  
  // Message affiché lors du blocage
  blockMessage: "🔒 Plateforme temporairement inaccessible",
  
  // Message détaillé
  blockDetails: "La plateforme est actuellement en maintenance en attente de paiement. Veuillez contacter l'administrateur pour débloquer l'accès avant le 15 février 2026.",
  
  // Contact pour débloquer
  contactInfo: "Contact: mahometguindo@gmail.com",
  phoneNumber: "+22392592294",
  
  // Code d'activation pour déblocage permanent
  activationCode: "MohaG",
}

// Fonction pour vérifier si l'accès est bloqué (côté serveur)
export function isAccessBlockedServer(): boolean {
  return ACCESS_CONFIG.isBlocked
}

// Fonction pour vérifier si l'accès est bloqué (côté client)
export function isAccessBlocked(): boolean {
  // Vérifier si la plateforme a été débloquée globalement
  const isGloballyUnlocked = typeof window !== 'undefined' && localStorage.getItem('platform_globally_unlocked') === 'true'
  if (isGloballyUnlocked) return false
  
  // Vérifier si la date limite est dépassée
  if (isDeadlinePassed()) return false
  
  // Vérifier si l'accès a été débloqué localement
  const isUnlocked = typeof window !== 'undefined' && localStorage.getItem('platform_unlocked') === 'true'
  return !isUnlocked && ACCESS_CONFIG.isBlocked
}

// Fonction pour débloquer l'accès globalement (permanent pour tous)
export function unlockGlobalAccess(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('platform_globally_unlocked', 'true')
    localStorage.setItem('global_unlock_timestamp', new Date().toISOString())
    localStorage.setItem('unlocked_by', 'MohaG')
  }
}

// Fonction pour débloquer l'accès localement
export function unlockAccess(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('platform_unlocked', 'true')
    localStorage.setItem('unlock_timestamp', new Date().toISOString())
  }
}

// Fonction pour vérifier si un code d'activation est valide
export function validateActivationCode(code: string): boolean {
  return code === ACCESS_CONFIG.activationCode
}

// Fonction pour vérifier si la date limite est dépassée
export function isDeadlinePassed(): boolean {
  if (!ACCESS_CONFIG.deadline) return false
  return new Date() > ACCESS_CONFIG.deadline
}
