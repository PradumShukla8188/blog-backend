require('dotenv').config();

var local = {
    env: {
        name: process.env.NODE_ENV || 'development',
        allowedOrigins: ['*'],
        server: {
            host: process.env.SERVER_HOST || '0.0.0.0',
            port: process.env.PORT || process.env.SERVER_PORT || '4001',
        },
        database: {
            name: process.env.DATABASE_NAME || 'blog',
            debug: process.env.DATABASE_DEBUG === 'true',
            uri: process.env.MONGODB_URI,
        },
        projectName: process.env.PROJECT_NAME || 'Blogging Site',
        jwt: {
            secret: process.env.JWT_SECRET,
        },
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    },
    numberOfEmails: Number(process.env.NUMBER_OF_EMAILS) || 12,
    intervalBetween: Number(process.env.INTERVAL_BETWEEN) || 60,
};

if (!local.env.database.uri) {
    console.error('Missing MONGODB_URI environment variable.');
}

if (!local.env.jwt.secret) {
    console.error('Missing JWT_SECRET environment variable.');
}

global.secret = process.env.GLOBAL_SECRET || process.env.JWT_SECRET || 'Admin';
global.project_name = process.env.GLOBAL_PROJECT_NAME || 'Tech-round';
global.pagination_limit = Number(process.env.PAGINATION_LIMIT) || 10;

module.exports = { config: local };
