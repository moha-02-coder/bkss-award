import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email ou numéro de téléphone requis' }, { status: 400 })
    }

    // Déterminer le champ de recherche
    let searchField: string
    let searchValue: string

    if (email) {
      searchField = 'email'
      searchValue = email.toLowerCase().trim()
    } else {
      searchField = 'phone'
      searchValue = phone
    }

    // Récupérer l'utilisateur depuis la base de données
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq(searchField, searchValue)
      .single()

    if (error || !user) {
      const identifier = email || phone
      return NextResponse.json({ 
        error: email 
          ? 'Email ou mot de passe incorrect' 
          : 'Numéro de téléphone ou mot de passe incorrect'
      }, { status: 401 })
    }

    // Vérifier le mot de passe
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        const identifier = email || phone
        return NextResponse.json({ 
          error: email 
            ? 'Email ou mot de passe incorrect' 
            : 'Numéro de téléphone ou mot de passe incorrect'
        }, { status: 401 })
      }
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
