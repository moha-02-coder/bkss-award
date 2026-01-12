"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { AuthSection } from "@/components/auth-section"
import { VoteSection } from "@/components/vote-section"
import { ResultsSection } from "@/components/results-section"
import { ProfileSection } from "@/components/profile-section"
import { AdminSection } from "@/components/admin-section"
import { Navigation } from "@/components/navigation"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Category } from "@/lib/categories"
import { CATEGORIES as DEFAULT_CATEGORIES } from "@/lib/categories"

export type UserRole = "voter" | "super_admin"

export type User = {
  id: string
  name: string
  email: string
  domain?: string
  city?: string
  phone?: string
  role: UserRole
  createdAt?: string
}

export type Vote = {
  userId: string
  categoryId: string
  candidateName: string
  timestamp: number
}

export type Page = "home" | "auth" | "vote" | "results" | "profile" | "admin"

const particlePositions = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 73.13) % 100,
  duration: 10 + (i % 10),
  yOffset: -200 - (i % 5) * 100,
}))

const DEFAULT_SUPER_ADMIN: User = {
  id: "super_admin_001",
  name: "Super Admin",
  email: "admin@bankassawards.com",
  role: "super_admin",
  createdAt: new Date().toISOString(),
}

export default function BankassAwards() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("currentUser", null)
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "dark")
  const [votes, setVotes] = useLocalStorage<Vote[]>("votes", [])
  const [users, setUsers] = useLocalStorage<User[]>("users", [DEFAULT_SUPER_ADMIN])
  const [categories, setCategories] = useLocalStorage<Category[]>("categories", DEFAULT_CATEGORIES)
  const [leadershipRevealed, setLeadershipRevealed] = useLocalStorage<boolean>("leadershipRevealed", false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (!users.find((u) => u.email === "admin@bankassawards.com")) {
      setUsers([...users, DEFAULT_SUPER_ADMIN])
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage("home")
  }

  const isSuperAdmin = currentUser?.role === "super_admin"

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        isSuperAdmin={isSuperAdmin}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {currentPage === "home" && <HeroSection setCurrentPage={setCurrentPage} currentUser={currentUser} />}
          {currentPage === "auth" && (
            <AuthSection
              setCurrentPage={setCurrentPage}
              setCurrentUser={setCurrentUser}
              users={users}
              setUsers={setUsers}
            />
          )}
          {currentPage === "vote" && (
            <VoteSection
              currentUser={currentUser}
              votes={votes}
              setVotes={setVotes}
              setCurrentPage={setCurrentPage}
              categories={categories}
              leadershipRevealed={leadershipRevealed}
            />
          )}
          {currentPage === "results" && (
            <ResultsSection
              votes={votes}
              categories={categories}
              leadershipRevealed={leadershipRevealed}
              isSuperAdmin={isSuperAdmin}
              onRevealLeadership={() => setLeadershipRevealed(true)}
            />
          )}
          {currentPage === "profile" && (
            <ProfileSection
              currentUser={currentUser}
              votes={votes}
              setCurrentPage={setCurrentPage}
              categories={categories}
              users={users}
              setUsers={setUsers}
            />
          )}
          {currentPage === "admin" && isSuperAdmin && (
            <AdminSection
              users={users}
              setUsers={setUsers}
              categories={categories}
              setCategories={setCategories}
              votes={votes}
              leadershipRevealed={leadershipRevealed}
              setLeadershipRevealed={setLeadershipRevealed}
              currentUser={currentUser}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {isMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, particle.yOffset],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
