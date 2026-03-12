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

    const { creditsAmount, provider, providerRef } = await request.json()

    if (!creditsAmount || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate price based on credits (example: 1 credit = €0.10)
    const pricePerCredit = 0.1
    const amount = creditsAmount * pricePerCredit

    // Create billing record
    const { data: billing, error: billingError } = await supabase
      .from('billing')
      .insert({
        user_id: user.id,
        amount,
        currency: 'EUR',
        credits_added: creditsAmount,
        status: 'pending',
        provider,
        provider_ref: providerRef,
      })
      .select()
      .single()

    if (billingError) {
      return NextResponse.json(
        { error: billingError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      billing,
      amount,
      creditsAmount,
    })
  } catch (error) {
    console.error('Billing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
