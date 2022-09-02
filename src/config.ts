export const CONFIG = {
    service: {
        endpoint: {
            protocol: process.env.SERVICE_PROTOCOL || 'http',
            host: process.env.SERVICE_HOST || 'localhost',
            port: process.env.SERVICE_PORT || 3000
        },
        auth: {
            username: process.env.SERVICE_CLIENT_ID || '',
            password: process.env.SERVICE_CLIENT_SECRET || ''
        },
        login: {
            user: process.env.SERVICE_USERNAME,
            password: process.env.SERVICE_PASSWORD
        }
    }
};
