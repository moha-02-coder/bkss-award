import { supabaseAdmin } from '../lib/supabase'
import { CATEGORIES } from '../lib/categories'

async function seedDatabase() {
  console.log('🌱 Début de l\'initialisation de la base de données...')

  try {
    // Créer l'administrateur par défaut
    console.log('👤 Création de l\'administrateur par défaut...')
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: 'super_admin_001',
        name: 'Super Admin',
        email: 'admin@bankassawards.com',
        role: 'SUPER_ADMIN',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (adminError) {
      console.error('❌ Erreur lors de la création de l\'administrateur:', adminError)
    } else {
      console.log('✅ Administrateur créé avec succès')
    }

    // Insérer les catégories par défaut
    console.log('📁 Création des catégories...')
    for (const category of CATEGORIES) {
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          subtitle: category.subtitle,
          special: category.special,
          is_leadership_prize: category.isLeadershipPrize,
          pre_assigned_winner: category.preAssignedWinner,
          pre_assigned_winner_bio: category.preAssignedWinnerBio,
          pre_assigned_winner_image: category.preAssignedWinnerImage,
          pre_assigned_winner_achievements: category.preAssignedWinnerAchievements,
          pre_assigned_winner_tribute: category.preAssignedWinnerTribute,
          leadership_revealed: false,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single()

      if (categoryError) {
        console.error(`❌ Erreur lors de la création de la catégorie ${category.name}:`, categoryError)
      } else {
        console.log(`✅ Catégorie "${category.name}" créée avec succès`)

        // Insérer les candidats pour cette catégorie
        if (category.candidates && category.candidates.length > 0) {
          console.log(`🎭 Création des candidats pour "${category.name}"...`)
          
          for (const candidate of category.candidates) {
            const { error: candidateError } = await supabaseAdmin
              .from('candidates')
              .upsert({
                id: candidate.id,
                category_id: category.id,
                name: candidate.name,
                alias: candidate.alias,
                image: candidate.image,
                bio: candidate.bio,
                achievements: candidate.achievements || [],
                song_count: candidate.songCount,
                candidate_song: candidate.candidateSong,
                audio_file: candidate.audioFile,
                created_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })

            if (candidateError) {
              console.error(`❌ Erreur lors de la création du candidat ${candidate.name}:`, candidateError)
            } else {
              console.log(`✅ Candidat "${candidate.name}" créé avec succès`)
            }
          }
        }
      }
    }

    // Créer les paramètres de l'application par défaut
    console.log('⚙️ Création des paramètres de l\'application...')
    const defaultSettings = [
      {
        key: 'leadership_revealed',
        value: false
      },
      {
        key: 'voting_enabled',
        value: true
      },
      {
        key: 'app_version',
        value: '1.0.0'
      }
    ]

    for (const setting of defaultSettings) {
      const { error: settingError } = await supabaseAdmin
        .from('app_settings')
        .upsert({
          key: setting.key,
          value: setting.value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })

      if (settingError) {
        console.error(`❌ Erreur lors de la création du paramètre ${setting.key}:`, settingError)
      } else {
        console.log(`✅ Paramètre "${setting.key}" créé avec succès`)
      }
    }

    console.log('🎉 Base de données initialisée avec succès!')
    console.log('')
    console.log('📊 Résumé:')
    console.log('- 1 administrateur par défaut')
    console.log(`- ${CATEGORIES.length} catégories`)
    console.log(`- ${CATEGORIES.reduce((acc, cat) => acc + cat.candidates.length, 0)} candidats`)
    console.log('- 3 paramètres d\'application')

  } catch (error) {
    console.error('❌ Erreur critique lors de l\'initialisation:', error)
    process.exit(1)
  }
}

// Exécuter le script
seedDatabase()
  .then(() => {
    console.log('✨ Script terminé avec succès')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erreur lors de l\'exécution du script:', error)
    process.exit(1)
  })
