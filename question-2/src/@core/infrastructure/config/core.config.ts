import './env'

export default function coreConfig() {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      uri: process.env.DB_URI || 'mongodb://localhost:27017',
      dbName: process.env.DB_NAME || 'core',
      ssl: process.env.DB_SSL === 'true' || false,
    },
    env: process.env.NODE_ENV || 'local',
    redis: {
      host: process.env.REDIS_URL || 'localhost',
      prefix: process.env.PROJECT_NAME || 'PAVE-interview',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    },
    projectName: process.env.PROJECT_NAME || 'PAVE-interview',
  }

};

export const configData = coreConfig();
