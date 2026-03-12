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

    const { billingId, status } = await request.json()

    if (!billingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify billing record belongs to user
    const { data: billing, error: fetchError } = await supabase
      .from('billing')
      .select('*')
      .eq('id', billingId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !billing) {
      return NextResponse.json(
        { error: 'Billing record not found' },
        { status: 404 }
      )
    }

    // Update billing status
    const { data: updated, error: updateError } = await supabase
      .from('billing')
      .update({ status })
      .eq('id', billingId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // If completed, credits will be added automatically by trigger
    if (status === 'completed') {
      // Fetch updated user to confirm credits
      const { data: updatedUser } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()

      return NextResponse.json({
        success: true,
        billing: updated,
        userCredits: updatedUser?.credits,
      })
    }

    return NextResponse.json({
      success: true,
      billing: updated,
    })
  } catch (error) {
    console.error('Payment completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
