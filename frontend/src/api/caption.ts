import client from './client';
import type { CaptionResponse } from '../types';

export interface GenerateCaptionOptions {
  language?: string;
  tone?: string;
  length?: string;
}

export const captionApi = {
  uploadImage: async (
    file: File,
    options?: GenerateCaptionOptions
  ): Promise<CaptionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.language) formData.append('language', options.language);
    if (options?.tone) formData.append('tone', options.tone);
    if (options?.length) formData.append('length', options.length);

    const response = await client.post('/caption/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getHistory: async (skip: number = 0, limit: number = 20): Promise<CaptionResponse[]> => {
    const response = await client.get(`/caption/history?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  deleteCaption: async (id: string): Promise<void> => {
    await client.delete(`/caption/${id}`);
  },
};
