require('dotenv').config();
const express      = require('express');
const nodemailer   = require('nodemailer');
const rateLimit    = require('express-rate-limit');
const path         = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ==========================================
   Middleware
   ========================================== */
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rate limit: max 5 emails per IP per 15 minutes
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Πολλά αιτήματα. Δοκίμασε ξανά σε λίγο.' }
});

/* ==========================================
   Email Transporter
   ========================================== */
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS   // Gmail App Password
        }
    });
}

/* ==========================================
   HTML Email Templates
   ========================================== */
function buildNotificationEmail({ name, email, subject, message }) {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2e2e2e;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1a1a1a,#222);padding:40px;border-bottom:1px solid #2e2e2e;text-align:center;">
                <p style="font-size:2.5rem;font-weight:700;color:#fff;margin:0;letter-spacing:-0.02em;">M<span style="color:#F7C948;">.</span></p>
                <p style="color:#888;font-size:0.78rem;letter-spacing:0.2em;text-transform:uppercase;margin:8px 0 0;">New Contact Message</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <p style="color:#F7C948;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;font-family:monospace;">From</p>
                <p style="color:#fff;font-size:1.1rem;font-weight:600;margin:0 0 24px;">${name} &lt;${email}&gt;</p>

                <p style="color:#F7C948;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;font-family:monospace;">Subject</p>
                <p style="color:#fff;font-size:1rem;margin:0 0 24px;">${subject || '(χωρίς θέμα)'}</p>

                <p style="color:#F7C948;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px;font-family:monospace;">Message</p>
                <div style="background:#111;border-left:3px solid #F7C948;padding:20px 24px;border-radius:0 8px 8px 0;">
                  <p style="color:#ccc;font-size:0.95rem;line-height:1.8;margin:0;">${message.replace(/\n/g, '<br>')}</p>
                </div>

                <div style="margin-top:32px;padding-top:24px;border-top:1px solid #2e2e2e;">
                  <a href="mailto:${email}" style="display:inline-block;background:#F7C948;color:#000;padding:12px 28px;border-radius:100px;font-weight:600;font-size:0.9rem;text-decoration:none;">
                    Reply to ${name} →
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #2e2e2e;text-align:center;">
                <p style="color:#555;font-size:0.78rem;margin:0;">Maria Portfolio · Athens, Greece</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
}

function buildAutoReplyEmail({ name }) {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2e2e2e;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1a0a1a,#200d30);padding:50px 40px;text-align:center;">
                <p style="font-size:3rem;font-weight:700;color:#fff;margin:0 0 4px;letter-spacing:-0.02em;">M<span style="color:#F7C948;">.</span></p>
                <p style="color:#FF4D8D;font-size:0.75rem;letter-spacing:0.25em;text-transform:uppercase;margin:0;font-family:monospace;">Maria · Graphic Designer & Animator</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:48px 40px;">
                <h2 style="color:#fff;font-size:1.8rem;font-weight:700;margin:0 0 16px;letter-spacing:-0.02em;">
                  Γεια σου, ${name}! 👋
                </h2>
                <p style="color:#888;font-size:1rem;line-height:1.8;margin:0 0 20px;">
                  Έλαβα το μήνυμά σου και σ' ευχαριστώ πολύ που επικοινώνησες μαζί μου!
                </p>
                <p style="color:#888;font-size:1rem;line-height:1.8;margin:0 0 36px;">
                  Θα σου απαντήσω το συντομότερο δυνατό — συνήθως εντός <strong style="color:#F7C948;">24-48 ωρών</strong>.
                </p>

                <div style="background:#111;border-radius:10px;padding:24px;margin-bottom:36px;border:1px solid #2e2e2e;">
                  <p style="color:#555;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px;font-family:monospace;">Εν τω μεταξύ, δες τη δουλειά μου</p>
                  <a href="${process.env.SITE_URL || '#'}" style="color:#F7C948;font-size:0.9rem;text-decoration:none;font-weight:500;">
                    🎨 Portfolio →
                  </a>
                </div>

                <p style="color:#555;font-size:0.9rem;margin:0;">
                  Με εκτίμηση,<br>
                  <strong style="color:#fff;">Maria</strong><br>
                  <span style="color:#FF4D8D;">Graphic Designer & Animator</span>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #2e2e2e;text-align:center;">
                <p style="color:#444;font-size:0.78rem;margin:0;">Athens, Greece · maria@email.com</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
}

/* ==========================================
   API Routes
   ========================================== */

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !name.trim())    return res.status(400).json({ error: 'Το όνομα είναι υποχρεωτικό.' });
    if (!email || !email.trim())  return res.status(400).json({ error: 'Το email είναι υποχρεωτικό.' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Το μήνυμα είναι υποχρεωτικό.' });

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Μη έγκυρο email.' });

    // Check env vars
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing EMAIL_USER or EMAIL_PASS in .env');
        return res.status(500).json({ error: 'Σφάλμα διαμόρφωσης server.' });
    }

    try {
        const transporter = createTransporter();

        // 1. Notification email to Maria
        await transporter.sendMail({
            from: `"Maria Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            replyTo: email,
            subject: `📬 Portfolio: ${subject || 'Νέο μήνυμα'} — από ${name}`,
            html: buildNotificationEmail({ name, email, subject, message })
        });

        // 2. Auto-reply to the visitor
        await transporter.sendMail({
            from: `"Maria" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Έλαβα το μήνυμά σου, ${name}! ✨`,
            html: buildAutoReplyEmail({ name })
        });

        console.log(`[Contact] Email sent from ${name} <${email}>`);
        res.json({ success: true, message: 'Το μήνυμα εστάλη επιτυχώς!' });

    } catch (err) {
        console.error('[Contact] Email error:', err.message);
        res.status(500).json({ error: 'Αποτυχία αποστολής. Δοκίμασε ξανά.' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/* ==========================================
   Start Server
   ========================================== */
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || '(not set)'}\n`);
});
