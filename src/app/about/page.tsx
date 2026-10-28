import React from 'react';
import AboutClient from './AboutClient';
import { getAboutServerData } from '@/lib/storage/pageServerData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  // Load admin content on the server so banner images are in the initial HTML
  const content = await getAboutServerData();
  return <AboutClient initialContent={content} />;
}

