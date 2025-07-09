'use server';

import { urlAnalyzerService } from '../../server/services/urlAnalyzer';
import { UrlAnalysisResult } from '@shared/schema';


export async function generateTags(url: string): Promise<UrlAnalysisResult> {
  return await urlAnalyzerService.analyzeUrl(url);
}
export async function generateTagsFromUrl(url: string): Promise<UrlAnalysisResult> {
  if (!url) {
    throw new Error('URL is required');
  }
  
  try {
    const result = await generateTags(url);
    return result;
  } catch (error) {
    console.error('Error generating tags:', error);
    throw new Error('Failed to generate tags from URL');
  }
}