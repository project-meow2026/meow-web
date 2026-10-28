import { NextRequest, NextResponse } from 'next/server';
import { dbService, INITIAL_CONTACT_INFO, INITIAL_SOCIAL_LINKS } from '@/lib/storage/db';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let contactInfo = { ...INITIAL_CONTACT_INFO };
    let socialLinks = { ...INITIAL_SOCIAL_LINKS };
    let aboutSection = null;
    let collectionsPage = null;
    let loadedFromDisk = false;

    // 1. Read persistent disk backup first (always reflects latest admin save)
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const contactPath = path.join(process.cwd(), 'public', 'settings', 'contact.json');
      const raw = await fs.readFile(contactPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.contact_info) {
        contactInfo = { ...contactInfo, ...parsed.contact_info };
        loadedFromDisk = true;
      }
      if (parsed.social_links) {
        socialLinks = { ...socialLinks, ...parsed.social_links };
        loadedFromDisk = true;
      }
    } catch (_) {}

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const aboutPath = path.join(process.cwd(), 'public', 'settings', 'about.json');
      const rawAbout = await fs.readFile(aboutPath, 'utf-8');
      aboutSection = JSON.parse(rawAbout);
    } catch (_) {}

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const collectionsPath = path.join(process.cwd(), 'public', 'settings', 'collections.json');
      const rawCollections = await fs.readFile(collectionsPath, 'utf-8');
      collectionsPage = JSON.parse(rawCollections);
    } catch (_) {}

    // 2. Query Supabase if configured
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data: rows } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_info', 'social_links', 'about_section', 'collections_page']);

      rows?.forEach((r) => {
        if (r.key === 'contact_info' && r.value) {
          if (!loadedFromDisk || (r.value.whatsapp && r.value.whatsapp !== INITIAL_CONTACT_INFO.whatsapp)) {
            contactInfo = { ...contactInfo, ...r.value };
          }
        }
        if (r.key === 'social_links' && r.value) {
          if (!loadedFromDisk) {
            socialLinks = { ...socialLinks, ...r.value };
          }
        }
        if (r.key === 'about_section' && r.value && !aboutSection) {
          aboutSection = r.value;
        }
        if (r.key === 'collections_page' && r.value && !collectionsPage) {
          collectionsPage = r.value;
        }
      });
    }

    return NextResponse.json(
      { contactInfo, socialLinks, aboutSection, collectionsPage },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json({
      contactInfo: INITIAL_CONTACT_INFO,
      socialLinks: INITIAL_SOCIAL_LINKS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle Admin CMS Contact & Social settings update
    if (body.type === 'settings') {
      const { contactInfo, socialLinks } = body;

      // 1. Always write to disk backup first
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const settingsDir = path.join(process.cwd(), 'public', 'settings');
        await fs.mkdir(settingsDir, { recursive: true });
        const contactPath = path.join(settingsDir, 'contact.json');
        let currentData: Record<string, any> = {};
        try {
          const raw = await fs.readFile(contactPath, 'utf-8');
          currentData = JSON.parse(raw);
        } catch (_) {}
        if (contactInfo) currentData.contact_info = contactInfo;
        if (socialLinks) currentData.social_links = socialLinks;
        await fs.writeFile(contactPath, JSON.stringify(currentData, null, 2), 'utf-8');
      } catch (fsErr) {
        console.warn('Could not write contact.json:', fsErr);
      }

      // 2. Upsert to Supabase site_settings with onConflict: 'key'
      const supabase = getSupabaseServerClient();
      if (supabase) {
        if (contactInfo) {
          const { error: err1 } = await supabase.from('site_settings').upsert(
            {
              key: 'contact_info',
              value: contactInfo,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );
          if (err1) console.warn('Supabase contact_info upsert warning:', err1.message);
        }
        if (socialLinks) {
          const { error: err2 } = await supabase.from('site_settings').upsert(
            {
              key: 'social_links',
              value: socialLinks,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );
          if (err2) console.warn('Supabase social_links upsert warning:', err2.message);
        }
      }

      return NextResponse.json({ success: true, contactInfo, socialLinks });
    }

    // Handle Admin CMS About Us content update
    if (body.type === 'about' && body.about) {
      const { about } = body;
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const settingsDir = path.join(process.cwd(), 'public', 'settings');
        await fs.mkdir(settingsDir, { recursive: true });
        await fs.writeFile(
          path.join(settingsDir, 'about.json'),
          JSON.stringify(about, null, 2),
          'utf-8'
        );
      } catch (_) {}

      const supabase = getSupabaseServerClient();
      if (supabase) {
        await supabase.from('about_sections').upsert(about).then(() => {}, () => {});
        await supabase
          .from('site_settings')
          .upsert(
            { key: 'about_section', value: about, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          )
          .then(() => {}, () => {});
      }

      return NextResponse.json({ success: true, about });
    }

    // Handle Admin CMS Collections Page content update
    if (body.type === 'collections' && body.collections) {
      const { collections } = body;
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const settingsDir = path.join(process.cwd(), 'public', 'settings');
        await fs.mkdir(settingsDir, { recursive: true });
        await fs.writeFile(
          path.join(settingsDir, 'collections.json'),
          JSON.stringify(collections, null, 2),
          'utf-8'
        );
      } catch (_) {}

      const supabase = getSupabaseServerClient();
      if (supabase) {
        await supabase
          .from('site_settings')
          .upsert(
            { key: 'collections_page', value: collections, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          )
          .then(() => {}, () => {});
      }

      return NextResponse.json({ success: true, collections });
    }

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
