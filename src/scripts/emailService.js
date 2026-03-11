/**
 * EmailService - Static site email handler using mailto: links
 * Since this site is hosted on GitHub Pages (static only),
 * all form submissions open the user's email client via mailto: URIs.
 */
class EmailService {
    constructor() {
        // Emails are resolved lazily via getters to avoid race conditions
        // with deobfuscate.js script load order.
        this._adminEmail = null;
        this._careersEmail = null;
        this._legalEmail = null;
    }

    /**
     * Lazily resolve email from deobfuscation engine.
     * Guarantees window.__ec is checked at call time, not constructor time.
     * @private
     */
    _resolveEmail(key) {
        if (window.__ec && window.__ec.e) {
            return window.__ec.e(key);
        }
        console.warn('EmailService: engine (window.__ec) not available. Email functionality will not work. <script> must appear before any script that instantiates EmailService.');
        return '';
    }

    get adminEmail() {
        if (!this._adminEmail) this._adminEmail = this._resolveEmail('ae');
        return this._adminEmail;
    }

    get careersEmail() {
        if (!this._careersEmail) this._careersEmail = this._resolveEmail('ce');
        return this._careersEmail;
    }

    get legalEmail() {
        if (!this._legalEmail) this._legalEmail = this._resolveEmail('le');
        return this._legalEmail;
    }

    /**
     * Send contact form email via mailto:
     * @param {Object} formData - Contact form data
     */
    sendContactEmail(formData) {
        const subject = `[CONTACT] ${formData.projectType}`;
        const body = [
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            `Project Type: ${formData.projectType}`,
            ``,
            `Message:`,
            `${formData.message}`,
            ``,
            `---`,
            `Sent from Elcinco Africa website`
        ].join('\n');

        this._openMailto(this.adminEmail, subject, body);
    }

    /**
     * Send project inquiry email via mailto:
     * @param {Object} formData - Project form data
     */
    sendProjectEmail(formData) {
        const subject = `[PROJECT INQUIRY] ${formData.org_name || formData.lead_name}`;
        const body = [
            `Lead Name: ${formData.lead_name}`,
            `Organization: ${formData.org_name}`,
            `Email: ${formData.email}`,
            `Phone: ${formData.phone}`,
            `Services: ${Array.isArray(formData.services) ? formData.services.join(', ') : formData.services}`,
            `Current Status: ${formData.current_status}`,
            `Budget: ${formData.budget}`,
            `Timeline: ${formData.timeline}`,
            ``,
            `Project Summary:`,
            `${formData.project_summary}`,
            ``,
            `---`,
            `Sent from Elcinco Africa website`
        ].join('\n');

        this._openMailto(this.adminEmail, subject, body);
    }

    /**
     * Send career application email via mailto:
     * Note: Attachments (CV) must be added manually by the user in their email client.
     * @param {Object} formData - Application form data
     */
    sendApplicationEmail(formData) {
        const subject = `[APPLICATION] ${formData.role} - ${formData.name}`;
        const body = [
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            `Phone: ${formData.phone}`,
            `Role: ${formData.role}`,
            ``,
            `Cover Letter:`,
            `${formData.message}`,
            ``,
            `⚠ Please attach your CV/Resume to this email before sending.`,
            ``,
            `---`,
            `Sent from Elcinco Africa website`
        ].join('\n');

        this._openMailto(this.careersEmail, subject, body);
    }

    /**
     * Open newsletter subscription mailto
     * @param {string} email - Subscriber email
     */
    sendNewsletterSubscription(email) {
        const subject = '[NEWSLETTER] New Subscription Request';
        const body = [
            `New newsletter subscription request:`,
            `Email: ${email}`,
            ``,
            `---`,
            `Sent from Elcinco Africa website`
        ].join('\n');

        this._openMailto(this.adminEmail, subject, body);
    }

    /**
     * Open mailto: link
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} body - Email body
     * @private
     */
    _openMailto(to, subject, body) {
        const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
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
    setLoadingState(button, text = 'Opening email client...') {
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
     * @param {string} type - Message type (success/error/info)
     */
    showMessage(message, type = 'info') {
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

