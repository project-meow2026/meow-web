import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/storage/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, subject, message } = body;

    if (!fullName || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are mandatory. Please complete the enquiry form.' },
        { status: 400 }
      );
    }

    const newEnquiry = await dbService.createEnquiry({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit contact enquiry' },
      { status: 500 }
    );
  }
}
