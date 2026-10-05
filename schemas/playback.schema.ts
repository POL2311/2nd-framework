// schemas/playback.schema.ts
export const heartbeatResponseSchema = {
  type: 'object',
  properties: {
    status: 
    { 
        type: 'string' 
    },
    message: 
    { 
        type: 'string' 
    },
    updated_at: 
    {
         type: 'string' 
        }
  },
  required: ['status', 'updated_at'],
  additionalProperties: false // Falla si el backend manda campos "extra" no esperados
};