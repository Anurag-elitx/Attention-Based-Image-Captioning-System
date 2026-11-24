import client from './client';
import type { EvaluationMetrics, EvaluationRunResponse } from '../types';

export const evaluationApi = {
  getBaselines: async (): Promise<EvaluationMetrics> => {
    const response = await client.get('/evaluate/baselines');
    return response.data;
  },
  
  getResults: async (): Promise<EvaluationMetrics> => {
    const response = await client.get('/evaluate/results');
    return response.data;
  },
  
  triggerEvaluation: async (): Promise<EvaluationRunResponse> => {
    const response = await client.post('/evaluate/trigger');
    return response.data;
  },
};
