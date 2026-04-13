import 'dotenv/config';

export const PORT         = process.env.PORT         ?? 4000;
export const CORS_ORIGIN  = process.env.CORS_ORIGIN  ?? 'http://localhost:5173';
export const JWT_SECRET   = process.env.JWT_SECRET   ?? 'change_me_in_production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
export const DATA_STORE   = process.env.DATA_STORE   ?? 'file'; // 'memory' | 'file'
export const DATA_DIR     = process.env.DATA_DIR     ?? './data';
