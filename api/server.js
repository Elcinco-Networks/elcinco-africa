const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting - DDoS protection
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many email requests from this IP, please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for health checks
    skip: (req) => req.path === '/health'
});

// CORS Configuration - Only allow your domains
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'https://elcinco.africa',
            'https://www.elcinco.africa'
        ];

        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Body parser with size limits
app.use(express.json({
    limit: process.env.MAX_EMAIL_SIZE || '10mb',
    strict: true
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});



const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465, // Auto-detect SSL/TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        // Only reject unauthorized in production
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    },
    // Connection timeouts
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    // Retry configuration
    pool: true,
    maxConnections: 5,
    maxMessages: 100
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Connection Error:', error.message);
        console.error('⚠️  Please check your SMTP credentials in .env file');
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Email service will NOT work until SMTP is configured correctly!');
        }
    } else {
        console.log('✅ SMTP Server ready to send emails');
        console.log(`📧 Sending from: ${process.env.SMTP_USER}`);
    }
});



function validateAndSanitizeInput(req, res, next) {
    const { to, from, replyTo, subject, templateType, data } = req.body;

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (to && !emailRegex.test(to)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid recipient email address'
        });
    }

    if (replyTo && !emailRegex.test(replyTo)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid reply-to email address'
        });
    }

    if (from && !emailRegex.test(from)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sender email address'
        });
    }

    // Prevent email header injection attacks
    const dangerousPatterns = ['\r', '\n', 'bcc:', 'cc:', 'content-type:', '%0a', '%0d'];
    const checkFields = [subject, to, from, replyTo].filter(Boolean);

    for (const field of checkFields) {
        const fieldLower = String(field).toLowerCase();
        for (const pattern of dangerousPatterns) {
            if (fieldLower.includes(pattern)) {
                console.warn('🚨 Security Alert: Email injection attempt detected!');
                return res.status(400).json({
                    success: false,
                    message: 'Invalid characters detected in email fields'
                });
            }
        }
    }

    // Validate subject length
    if (subject && subject.length > 200) {
        return res.status(400).json({
            success: false,
            message: 'Subject line too long (max 200 characters)'
        });
    }

    // Validate template type
    const validTemplates = ['contact', 'project', 'application', 'newsletter', 'newsletter-confirmation'];
    if (!validTemplates.includes(templateType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid template type'
        });
    }

    // Validate data object exists
    if (!data || typeof data !== 'object') {
        return res.status(400).json({
            success: false,
            message: 'Invalid or missing data object'
        });
    }

    next();
}



const emailTemplates = {
    contact: (data) => ({
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #380885, #5c0fb5); color: white; padding: 30px; text-align: center; }
                    .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
                    .field { margin-bottom: 20px; }
                    .label { font-weight: bold; color: #380885; display: block; margin-bottom: 5px; }
                    .value { color: #555; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ELCINCO AFRICA</h1>
                        <p>New Contact Form Submission</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <span class="label">From:</span>
                            <span class="value">${escapeHtml(data.name)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Email:</span>
                            <span class="value">${escapeHtml(data.email)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Project Type:</span>
                            <span class="value">${escapeHtml(data.projectType)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Message:</span>
                            <div class="value" style="white-space: pre-wrap;">${escapeHtml(data.message)}</div>
                        </div>
                        <div class="field">
                            <span class="label">Timestamp:</span>
                            <span class="value">${new Date(data.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2026 ELCINCO AFRICA. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
ELCINCO AFRICA - New Contact Form Submission

From: ${data.name}
Email: ${data.email}
Project Type: ${data.projectType}

Message:
${data.message}

Timestamp: ${new Date(data.timestamp).toLocaleString()}
        `
    }),

    project: (data) => ({
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #380885, #5c0fb5); color: white; padding: 30px; text-align: center; }
                    .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
                    .section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
                    .section:last-child { border-bottom: none; }
                    .section-title { color: #380885; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
                    .value { color: #333; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ELCINCO AFRICA</h1>
                        <p>New Project Inquiry</p>
                    </div>
                    <div class="content">
                        <div class="section">
                            <div class="section-title">01 // CLIENT INFORMATION</div>
                            <div class="field">
                                <span class="label">Lead Name:</span>
                                <span class="value">${escapeHtml(data.leadName)}</span>
                            </div>
                            <div class="field">
                                <span class="label">Organization:</span>
                                <span class="value">${escapeHtml(data.organization || 'N/A')}</span>
                            </div>
                            <div class="field">
                                <span class="label">Email:</span>
                                <span class="value">${escapeHtml(data.email)}</span>
                            </div>
                            <div class="field">
                                <span class="label">Phone:</span>
                                <span class="value">${escapeHtml(data.phone || 'N/A')}</span>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">02 // PROJECT SCOPE</div>
                            <div class="field">
                                <span class="label">Services Required:</span>
                                <span class="value">${escapeHtml(Array.isArray(data.services) ? data.services.join(', ') : data.services)}</span>
                            </div>
                            <div class="field">
                                <span class="label">Current Status:</span>
                                <span class="value">${escapeHtml(data.currentStatus)}</span>
                            </div>
                            <div class="field">
                                <span class="label">Project Summary:</span>
                                <div class="value" style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 4px;">${escapeHtml(data.projectSummary)}</div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">03 // RESOURCES & TIMELINE</div>
                            <div class="field">
                                <span class="label">Budget:</span>
                                <span class="value">${escapeHtml(data.budget)}</span>
                            </div>
                            <div class="field">
                                <span class="label">Timeline:</span>
                                <span class="value">${escapeHtml(data.timeline)}</span>
                            </div>
                        </div>
                        
                        <div class="field">
                            <span class="label">Timestamp:</span>
                            <span class="value">${new Date(data.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2026 ELCINCO AFRICA. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
ELCINCO AFRICA - New Project Inquiry

=== CLIENT INFORMATION ===
Lead Name: ${data.leadName}
Organization: ${data.organization || 'N/A'}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}

=== PROJECT SCOPE ===
Services Required: ${Array.isArray(data.services) ? data.services.join(', ') : data.services}
Current Status: ${data.currentStatus}
Project Summary:
${data.projectSummary}

=== RESOURCES & TIMELINE ===
Budget: ${data.budget}
Timeline: ${data.timeline}

Timestamp: ${new Date(data.timestamp).toLocaleString()}
        `
    }),

    application: (data) => ({
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #380885, #5c0fb5); color: white; padding: 30px; text-align: center; }
                    .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
                    .field { margin-bottom: 20px; }
                    .label { font-weight: bold; color: #380885; display: block; margin-bottom: 5px; }
                    .value { color: #555; }
                    .cover-letter { background: #f5f5f5; padding: 20px; border-left: 4px solid #380885; margin-top: 10px; white-space: pre-wrap; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ELCINCO AFRICA</h1>
                        <p>New Job Application</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <span class="label">Applicant Name:</span>
                            <span class="value">${escapeHtml(data.name)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Email:</span>
                            <span class="value">${escapeHtml(data.email)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Phone:</span>
                            <span class="value">${escapeHtml(data.phone)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Position Applied:</span>
                            <span class="value">${escapeHtml(data.role)}</span>
                        </div>
                        <div class="field">
                            <span class="label">Cover Letter:</span>
                            <div class="cover-letter">${escapeHtml(data.coverLetter || 'Not provided')}</div>
                        </div>
                        <div class="field">
                            <span class="label">Timestamp:</span>
                            <span class="value">${new Date(data.timestamp).toLocaleString()}</span>
                        </div>
                        ${data.cvAttachment ? '<p style="color: #380885;"><strong>📎 CV/Resume attached to this email.</strong></p>' : ''}
                    </div>
                    <div class="footer">
                        <p>© 2026 ELCINCO AFRICA. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
ELCINCO AFRICA - New Job Application

Applicant: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Position: ${data.role}

Cover Letter:
${data.coverLetter || 'Not provided'}

Timestamp: ${new Date(data.timestamp).toLocaleString()}
        `
    }),

    newsletter: (data) => ({
        html: `
            <!DOCTYPE html>
            <html>
            <body>
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #380885;">New Newsletter Subscription</h2>
                    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                    <p><strong>Date:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                </div>
            </body>
            </html>
        `,
        text: `New Newsletter Subscription\n\nEmail: ${data.email}\nDate: ${new Date(data.timestamp).toLocaleString()}`
    }),

    'newsletter-confirmation': (data) => ({
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #380885, #5c0fb5); color: white; padding: 40px; text-align: center; }
                    .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                    .btn { display: inline-block; padding: 12px 30px; background: #380885; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ELCINCO AFRICA</h1>
                        <p>Welcome to the Network</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #380885;">Thank You for Subscribing!</h2>
                        <p>You've successfully joined the ELCINCO AFRICA newsletter. Get ready for exclusive insights on:</p>
                        <ul>
                            <li>AI Automation & Innovation</li>
                            <li>Web & Mobile Development Trends</li>
                            <li>Digital Marketing Strategies</li>
                            <li>UI/UX Design Best Practices</li>
                            <li>Growth & Business Intelligence</li>
                        </ul>
                        <p>Stay tuned for our latest updates and exclusive content.</p>
                        <a href="https://elcinco.africa" class="btn">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>© 2026 ELCINCO AFRICA. All rights reserved.</p>
                        <p>If you didn't subscribe, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to ELCINCO AFRICA Newsletter!

Thank you for subscribing. You'll receive exclusive insights on AI Automation, Web Development, Digital Marketing, UI/UX Design, and Growth Strategies.

Visit us at: https://elcinco.africa

© 2026 ELCINCO AFRICA. All rights reserved.
        `
    })
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// HTML escape function to prevent XSS in email templates
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}


// API ENDPOINTS


// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'ELCINCO Email API',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// Main email sending endpoint
app.post('/api/send-email', emailLimiter, validateAndSanitizeInput, async (req, res) => {
    try {
        const { to, from, replyTo, subject, templateType, data } = req.body;

        // Get template
        const template = emailTemplates[templateType];
        if (!template) {
            return res.status(400).json({
                success: false,
                message: `Invalid template type: ${templateType}`
            });
        }

        const emailContent = template(data);

        // Prepare email options
        const mailOptions = {
            from: from || `ELCINCO AFRICA <${process.env.SMTP_USER}>`,
            to: to,
            replyTo: replyTo || from,
            subject: subject,
            text: emailContent.text,
            html: emailContent.html,
            // Add email headers for better deliverability
            headers: {
                'X-Mailer': 'ELCINCO AFRICA Email Service',
                'X-Priority': '3'
            }
        };

        // Handle CV attachment for applications
        if (templateType === 'application' && data.cvAttachment) {
            // Validate attachment size (max 10MB)
            const attachmentSize = Buffer.from(data.cvAttachment, 'base64').length;
            if (attachmentSize > 10 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: 'CV attachment too large (max 10MB)'
                });
            }

            mailOptions.attachments = [{
                filename: `CV_${data.name.replace(/\s+/g, '_')}.pdf`,
                content: data.cvAttachment,
                encoding: 'base64'
            }];
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully:', info.messageId);

        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Email sending error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});


// SERVER STARTUP


// Start server (for traditional hosting)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('===========================================');
        console.log(' ELCINCO Email API Server Started');
        console.log('===========================================');
        console.log(` Port: ${PORT}`);
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(` SMTP Host: ${process.env.SMTP_HOST}`);
        console.log(` SMTP User: ${process.env.SMTP_USER}`);
        console.log('===========================================');
    });
}

// Export for serverless deployment (Vercel, Netlify, etc.)
module.exports = app;