import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer tous les candidats
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    let query = supabaseAdmin
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: true })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau candidat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, name, alias, image, bio, achievements, songCount, candidateSong, audioFile } = body

    // Validation
    if (!categoryId || !name || !image || !bio) {
      return NextResponse.json({ error: 'Catégorie, nom, image et bio sont requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('candidates')
      .insert({
        category_id: categoryId,
        name,
        alias,
        image,
        bio,
        achievements: achievements || [],
        song_count: songCount,
        candidate_song: candidateSong,
        audio_file: audioFile
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

// PUT - Mettre à jour un candidat
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID candidat requis' }, { status: 400 })
    }

    // Convertir les noms de champs pour la base de données
    const dbUpdateData: any = {}
    if (updateData.categoryId !== undefined) {
      dbUpdateData.category_id = updateData.categoryId
    }
    if (updateData.songCount !== undefined) {
      dbUpdateData.song_count = updateData.songCount
    }
    if (updateData.candidateSong !== undefined) {
      dbUpdateData.candidate_song = updateData.candidateSong
    }
    if (updateData.audioFile !== undefined) {
      dbUpdateData.audio_file = updateData.audioFile
    }

    // Ajouter les autres champs
    Object.keys(updateData).forEach(key => {
      if (!['categoryId', 'songCount', 'candidateSong', 'audioFile'].includes(key)) {
        dbUpdateData[key] = updateData[key]
      }
    })

    const { data, error } = await supabaseAdmin
      .from('candidates')
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

// DELETE - Supprimer un candidat
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID candidat requis' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Candidat supprimé avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
