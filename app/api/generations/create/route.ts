import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, inputUrl, outputUrl, modelUsed, creditsUsed = 1 } = await request.json()

    if (!outputUrl || !modelUsed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user has enough credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (!userData || userData.credits < creditsUsed) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Create generation record (credits will be deducted by trigger)
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        prompt,
        input_url: inputUrl,
        output_url: outputUrl,
        model_used: modelUsed,
        credits_used: creditsUsed,
      })
      .select()
      .single()

    if (genError) {
      return NextResponse.json(
        { error: genError.message },
        { status: 500 }
      )
    }

    // Fetch updated user credits
    const { data: updatedUser } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      generation,
      remainingCredits: updatedUser?.credits,
    })
  } catch (error) {
    console.error('Generation creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
