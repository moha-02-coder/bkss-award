"use client"

import { motion } from "framer-motion"
import { Trophy, Vote, BarChart3, Sparkles, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Page, User } from "@/app/page"

interface HeroSectionProps {
  setCurrentPage: (page: Page) => void
  currentUser: User | null
}

export function HeroSection({ setCurrentPage, currentUser }: HeroSectionProps) {
  const features = [
    {
      icon: Trophy,
      title: "9 Catégories",
      description: "Catégories prestigieuses récompensant l'excellence dans différents domaines",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Vote,
      title: "Vote Transparent",
      description: "Système de vote sécurisé et transparent pour une élection équitable",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Award,
      title: "Reconnaissance",
      description: "Mettez en lumière les talents qui façonnent notre communauté",
      gradient: "from-primary to-accent",
    },
  ]

  const stats = [
    { value: "9", label: "Catégories" },
    { value: "36+", label: "Candidats" },
    { value: "∞", label: "Possibilités" },
  ]

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Hero Content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Édition 2026</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="block text-foreground">Bienvenue aux</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                BANKASS AWARDS
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Célébrez l'excellence et récompensez les talents exceptionnels de notre communauté. Votez pour vos favoris
              et participez à cet événement unique.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setCurrentPage(currentUser ? "vote" : "auth")}
                className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/25 px-8 h-14 text-lg"
              >
                <Vote className="w-5 h-5 mr-2" />
                Commencer à voter
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage("results")}
                className="h-14 px-8 text-lg border-2 hover:bg-muted"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Voir les résultats
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-8 sm:gap-16 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pourquoi participer ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce qui fait des BANKASS AWARDS un événement unique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />
    </section>
  )
}
