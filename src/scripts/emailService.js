
class EmailService {
    constructor() {
        // Auto-detect environment and use appropriate endpoint
        this.apiEndpoint = this.getApiEndpoint();
        this.adminEmail = 'admin@elcinco.africa';
        this.careersEmail = 'careers@elcinco.africa';
        this.legalEmail = 'legal@elcinco.africa';
    }

    /**
     * Get the appropriate API endpoint based on environment
     * @returns {string} - API endpoint URL
     */
    getApiEndpoint() {
        // Check if EmailConfig is available
        if (typeof window !== 'undefined' && window.EmailConfig) {
            return window.EmailConfig.getEndpoint();
        }

        // Fallback: auto-detect based on hostname
        const isDevelopment = window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';

        if (isDevelopment) {
            return 'http://localhost:3000/api/send-email';
        } else {
            // Production endpoint - update this after deployment
            return 'https://elcinco-email-api.vercel.app/api/send-email';
        }
    }

    /**
     * Send contact form email
     * @param {Object} formData - Contact form data
     * @returns {Promise} - API response
     */
    async sendContactEmail(formData) {
        const emailPayload = {
            to: this.adminEmail,
            from: 'noreply@elcinco.africa',
            replyTo: formData.email,
            subject: `[CONTACT] ${formData.projectType}`,
            templateType: 'contact',
            data: {
                name: formData.name,
                email: formData.email,
                projectType: formData.projectType,
                message: formData.message,
                timestamp: new Date().toISOString()
            }
        };

        return this.sendEmail(emailPayload);
    }

    /**
     * Send project inquiry email
     * @param {Object} formData - Project form data
     * @returns {Promise} - API response
     */
    async sendProjectEmail(formData) {
        const emailPayload = {
            to: this.adminEmail,
            from: 'noreply@elcinco.africa',
            replyTo: formData.email,
            subject: `[PROJECT INQUIRY] ${formData.org_name || formData.lead_name}`,
            templateType: 'project',
            data: {
                leadName: formData.lead_name,
                organization: formData.org_name,
                email: formData.email,
                phone: formData.phone,
                services: formData.services,
                currentStatus: formData.current_status,
                projectSummary: formData.project_summary,
                budget: formData.budget,
                timeline: formData.timeline,
                timestamp: new Date().toISOString()
            }
        };

        return this.sendEmail(emailPayload);
    }

    /**
     * Send career application email
     * @param {Object} formData - Application form data
     * @returns {Promise} - API response
     */
    async sendApplicationEmail(formData) {
        const emailPayload = {
            to: this.careersEmail,
            from: 'noreply@elcinco.africa',
            replyTo: formData.email,
            subject: `[APPLICATION] ${formData.role} - ${formData.name}`,
            templateType: 'application',
            data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                coverLetter: formData.message,
                cvAttachment: formData.cvFile, // Base64 or file URL
                timestamp: new Date().toISOString()
            }
        };

        return this.sendEmail(emailPayload);
    }

    /**
     * Send newsletter subscription email
     * @param {string} email - Subscriber email
     * @returns {Promise} - API response
     */
    async sendNewsletterSubscription(email) {
        const emailPayload = {
            to: this.adminEmail,
            from: 'noreply@elcinco.africa',
            subject: '[NEWSLETTER] New Subscription',
            templateType: 'newsletter',
            data: {
                email: email,
                timestamp: new Date().toISOString()
            }
        };

        // Also send confirmation to subscriber
        const confirmationPayload = {
            to: email,
            from: 'noreply@elcinco.africa',
            subject: 'Welcome to ELCINCO AFRICA Newsletter',
            templateType: 'newsletter-confirmation',
            data: {
                timestamp: new Date().toISOString()
            }
        };

        await this.sendEmail(emailPayload);
        return this.sendEmail(confirmationPayload);
    }

    /**
     * Core email sending function
     * @param {Object} payload - Email payload
     * @returns {Promise} - API response
     */
    async sendEmail(payload) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Email sending failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Email Service Error:', error);
            throw error;
        }
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Valid or not
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show loading state on button
     * @param {HTMLElement} button - Submit button
     * @param {string} text - Loading text
     */
    setLoadingState(button, text = 'Transmitting...') {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = text;
        button.style.opacity = '0.7';
    }

    /**
     * Reset button state
     * @param {HTMLElement} button - Submit button
     */
    resetButtonState(button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Submit';
        button.style.opacity = '1';
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Show message to user
     * @param {string} message - Message text
     * @param {string} type - Message type (success/error)
     */
    showMessage(message, type = 'info') {
        // Create or update status message element
        let statusEl = document.getElementById('email-status-message');

        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'email-status-message';
            document.body.appendChild(statusEl);
        }

        statusEl.textContent = message;
        statusEl.className = `status-message status-${type}`;
        statusEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-family: 'Space Mono', monospace;
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 'background: #10b981; color: white;' : ''}
            ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
            ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
        `;

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (statusEl) {
                statusEl.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => statusEl.remove(), 300);
            }
        }, 5000);
    }
}

// Export singleton instance
const emailService = new EmailService();

// For ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = emailService;
}


