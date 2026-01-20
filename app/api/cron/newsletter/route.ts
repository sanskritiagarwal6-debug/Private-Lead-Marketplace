import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    // Verify authorization (CRON_SECRET)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    try {
        // 1. Fetch leads created in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: newLeads, error } = await supabase
            .from('leads')
            .select('*')
            .gte('created_at', yesterday.toISOString())
            .eq('status', 'available');

        if (error) throw error;

        if (!newLeads || newLeads.length === 0) {
            return NextResponse.json({ message: 'No new leads to send.' });
        }

        // 2. Fetch all users (newsletter subscribers)
        // const { data: users } = await supabase.from('users').select('email');

        // 3. Send Emails (Mocking this part as we don't have an email provider configured)
        console.log(`[NEWSLETTER] Sending daily summary of ${newLeads.length} new leads to subscribers.`);

        // In production, use Resend or SendGrid here:
        // await resend.emails.send({ ... })

        return NextResponse.json({ success: true, leadsCount: newLeads.length });
    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
