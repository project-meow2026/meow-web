import React from 'react';
import CollectionsClient from './CollectionsClient';
import { getCollectionsServerData } from '@/lib/storage/pageServerData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CollectionsPage() {
  // Load admin content on the server so banner & card images are in the initial HTML
  const content = await getCollectionsServerData();
  return <CollectionsClient initialContent={content} />;
}

