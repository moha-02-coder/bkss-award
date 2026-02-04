import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Vérifier si l'admin existe déjà
    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'winnerboys@bankassaward.com')
      .single()

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Administrateur déjà existant',
        admin: { email: 'winnerboys@bankassaward.com', role: 'SUPER_ADMIN' }
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('winnerboys', 10)

    // Créer l'administrateur
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: 'Administrateur Principal',
        email: 'winnerboys@bankassaward.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        domain: 'Administration',
        city: 'Bamako',
        phone: '+22300000000'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Administrateur créé avec succès',
      admin: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Erreur lors de la création de l\'administrateur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
