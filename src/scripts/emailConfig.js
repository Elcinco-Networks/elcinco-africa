

let EmailConfig = {
    // Auto-detect environment
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

    // API endpoints
    endpoints: {
        development: 'http://localhost:3000/api/send-email',
        // IMPORTANT: Update this URL after deploying to Vercel or your server
        // Option 1: If deploying API with main site
        production: 'https://elcinco.africa/api/send-email',
        // Option 2: If deploying API separately (uncomment and use this instead)
        // production: 'https://api.elcinco.africa/api/send-email'
    },

    // Get current endpoint based on environment
    getEndpoint() {
        return this.isDevelopment ? this.endpoints.development : this.endpoints.production;
    },

    // Get environment info
    getEnvironmentInfo() {
        return {
            environment: this.isDevelopment ? 'development' : 'production',
            endpoint: this.getEndpoint(),
            hostname: window.location.hostname
        };
    }
};

// Export for use in emailService.js
if (typeof window !== 'undefined') {
    window.EmailConfig = EmailConfig;

    // Log configuration in development mode only
    if (EmailConfig.isDevelopment) {
        console.log('📧 Email Config:', EmailConfig.getEnvironmentInfo());
    }
}