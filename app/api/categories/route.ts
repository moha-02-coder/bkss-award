import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer toutes les catégories avec leurs candidats
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        candidates (*)
      `)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subtitle, special = false, isLeadershipPrize = false } = body

    // Validation
    if (!name || !subtitle) {
      return NextResponse.json({ error: 'Nom et sous-titre requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        subtitle,
        special,
        is_leadership_prize: isLeadershipPrize
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID catégorie requis' }, { status: 400 })
    }

    // Convertir les noms de champs pour la base de données
    const dbUpdateData: any = {}
    if (updateData.isLeadershipPrize !== undefined) {
      dbUpdateData.is_leadership_prize = updateData.isLeadershipPrize
    }
    if (updateData.preAssignedWinner !== undefined) {
      dbUpdateData.pre_assigned_winner = updateData.preAssignedWinner
    }
    if (updateData.preAssignedWinnerBio !== undefined) {
      dbUpdateData.pre_assigned_winner_bio = updateData.preAssignedWinnerBio
    }
    if (updateData.preAssignedWinnerImage !== undefined) {
      dbUpdateData.pre_assigned_winner_image = updateData.preAssignedWinnerImage
    }
    if (updateData.preAssignedWinnerAchievements !== undefined) {
      dbUpdateData.pre_assigned_winner_achievements = updateData.preAssignedWinnerAchievements
    }
    if (updateData.preAssignedWinnerTribute !== undefined) {
      dbUpdateData.pre_assigned_winner_tribute = updateData.preAssignedWinnerTribute
    }
    if (updateData.leadershipRevealed !== undefined) {
      dbUpdateData.leadership_revealed = updateData.leadershipRevealed
    }

    // Ajouter les autres champs
    Object.keys(updateData).forEach(key => {
      if (!['isLeadershipPrize', 'preAssignedWinner', 'preAssignedWinnerBio', 'preAssignedWinnerImage', 'preAssignedWinnerAchievements', 'preAssignedWinnerTribute', 'leadershipRevealed'].includes(key)) {
        dbUpdateData[key] = updateData[key]
      }
    })

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID catégorie requis' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
