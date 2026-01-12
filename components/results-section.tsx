"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, BarChart3, Sparkles, Crown, Lock, Heart, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Vote } from "@/app/page"
import type { Category } from "@/lib/categories"

interface ResultsSectionProps {
  votes: Vote[]
  categories: Category[]
  leadershipRevealed: boolean
  isSuperAdmin: boolean
  onRevealLeadership: () => void
}

export function ResultsSection({
  votes,
  categories,
  leadershipRevealed,
  isSuperAdmin,
  onRevealLeadership,
}: ResultsSectionProps) {
  const [showLeadershipReveal, setShowLeadershipReveal] = useState(false)

  const getResultsForCategory = (categoryId: string) => {
    const categoryVotes = votes.filter((v) => v.categoryId === categoryId)
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return []

    const voteCounts: Record<string, number> = {}
    category.candidates.forEach((candidate) => {
      voteCounts[candidate.name] = 0
    })

    categoryVotes.forEach((vote) => {
      if (voteCounts[vote.candidateName] !== undefined) {
        voteCounts[vote.candidateName]++
      }
    })

    const totalVotes = categoryVotes.length

    return Object.entries(voteCounts)
      .map(([name, count]) => {
        const candidate = category.candidates.find((c) => c.name === name)
        return {
          name,
          votes: count,
          percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
          image: candidate?.image || "",
        }
      })
      .sort((a, b) => b.votes - a.votes)
  }

  const totalVotes = votes.length
  const uniqueVoters = new Set(votes.map((v) => v.userId)).size

  const leadershipPrize = categories.find((c) => c.isLeadershipPrize)

  const handleRevealClick = () => {
    if (isSuperAdmin && !leadershipRevealed) {
      onRevealLeadership()
    }
    if (leadershipRevealed || isSuperAdmin) {
      setShowLeadershipReveal(true)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Résultats des votes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Classement par catégorie - Mise à jour en temps réel
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Votes totaux</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{uniqueVoters}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {categories
            .filter((c) => !c.isLeadershipPrize)
            .map((category, index) => {
              const results = getResultsForCategory(category.id)
              const totalCategoryVotes = results.reduce((sum, r) => sum + r.votes, 0)

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{totalCategoryVotes} votes</p>
                    </div>
                  </div>

                  {results.length > 0 && totalCategoryVotes > 0 ? (
                    <div className="space-y-4">
                      {results.map((result, idx) => (
                        <motion.div
                          key={result.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {result.image && (
                                <img
                                  src={result.image || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-8 h-8 rounded-full object-cover border-2 border-border"
                                />
                              )}
                              {idx === 0 && totalCategoryVotes > 0 && <Crown className="w-5 h-5 text-primary" />}
                              <span className="font-medium">{result.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-primary">
                              {result.votes} votes ({result.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                              className={`h-full rounded-full ${
                                idx === 0 ? "bg-gradient-to-r from-primary to-accent" : "bg-muted-foreground/30"
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun vote pour le moment</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
        </div>

        {/* Leadership Prize Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Trophée Leadership</h2>
            <p className="text-muted-foreground mb-6">Prix hommage en l'honneur de Kassim Guindo</p>

            {leadershipRevealed ? (
              <Button
                onClick={handleRevealClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Voir l'hommage à Kassim
              </Button>
            ) : isSuperAdmin ? (
              <Button
                onClick={handleRevealClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Révéler le Trophée Leadership
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5" />
                <span>Ce prix sera révélé lors de la cérémonie officielle</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leadership Revelation Modal */}
      <AnimatePresence>
        {showLeadershipReveal && leadershipPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowLeadershipReveal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-card border border-amber-500/20 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowLeadershipReveal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with trophy animation */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Trophée Leadership
                </h2>
                <p className="text-muted-foreground">Prix hommage - BANKASS AWARDS</p>
              </div>

              {/* Kassim Profile */}
              <div className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    src={
                      leadershipPrize.preAssignedWinnerImage ||
                      "/placeholder.svg?height=150&width=150&query=african leader portrait distinguished"
                    }
                    alt={leadershipPrize.preAssignedWinner}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-amber-500/20 shadow-xl"
                  />
                  <div className="text-center sm:text-left">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2"
                    >
                      {leadershipPrize.preAssignedWinner}
                    </motion.h3>
                    <p className="text-muted-foreground">Lauréat du Trophée Leadership</p>
                  </div>
                </div>

                {/* Biography */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground leading-relaxed mb-6"
                >
                  {leadershipPrize.preAssignedWinnerBio}
                </motion.p>

                {/* Achievements */}
                {leadershipPrize.preAssignedWinnerAchievements && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      Réalisations
                    </h4>
                    <ul className="space-y-2">
                      {leadershipPrize.preAssignedWinnerAchievements.map((achievement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tribute */}
              {leadershipPrize.preAssignedWinnerTribute && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-muted/30 rounded-2xl p-6 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold">Hommage</h4>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line italic">
                    {leadershipPrize.preAssignedWinnerTribute}
                  </div>
                </motion.div>
              )}

              {/* Close button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowLeadershipReveal(false)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
