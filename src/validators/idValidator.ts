import { z } from 'zod';

export const idSchema = z.string().regex(/^\d+$/, "ID deve conter apenas números"); 
