#!/usr/bin/env node
/**
 * Encrypt a standalone HTML page for private hosting.
 * Uses AES-256-GCM with PBKDF2 key derivation (same as Carly_Spec_v1.6.html).
 *
 * Usage:
 *   node scripts/encrypt-page.mjs <input.html> <output.html> <password>
 *
 * Example:
 *   node scripts/encrypt-page.mjs carly-first-look.html carly-first-look-encrypted.html carly26
 */

import { readFileSync, writeFileSync } from 'fs';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'crypto';

const [,, inputFile, outputFile, password] = process.argv;

if (!inputFile || !outputFile || !password) {
  console.error('Usage: node scripts/encrypt-page.mjs <input.html> <output.html> <password>');
  process.exit(1);
}

// Read source HTML
const sourceHTML = readFileSync(inputFile, 'utf-8');

// Encrypt with AES-256-GCM + PBKDF2 (matches Carly_Spec_v1.6.html parameters)
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, 100000, 32, 'sha256');

const cipher = createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(sourceHTML, 'utf-8'), cipher.final()]);
const authTag = cipher.getAuthTag();

// AES-GCM in Web Crypto API expects authTag appended to ciphertext
const ciphertextWithTag = Buffer.concat([encrypted, authTag]);

const payload = JSON.stringify({
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  ciphertext: ciphertextWithTag.toString('base64')
});

// Build the wrapper HTML
const wrapper = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SlashExperts | Access Restricted</title>

    <!-- ANTI-INDEXING: Prevent all search engines and robots from indexing -->
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <meta name="bingbot" content="noindex, nofollow, noarchive">
    <meta name="slurp" content="noindex, nofollow">
    <meta name="duckduckbot" content="noindex, nofollow">
    <meta name="baiduspider" content="noindex, nofollow">
    <meta name="yandexbot" content="noindex, nofollow">

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --navy: #0e0e44;
            --violet: #8167ea;
            --primary-purple: #6A48F3;
            --lavender: #d2c3ef;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #080820;
            color: #e0e0e0;
        }

        #login-screen {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, #080820 0%, var(--navy) 50%, #1a1a5c 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }

        #login-screen.hidden { display: none; }

        .login-logo {
            width: 280px;
            margin-bottom: 40px;
            opacity: 0.95;
        }

        .login-box { text-align: center; }

        .access-badge {
            display: inline-block;
            padding: 6px 16px;
            border: 1px solid var(--violet);
            border-radius: 4px;
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--violet);
            margin-bottom: 30px;
            background: rgba(129, 103, 234, 0.1);
        }

        .login-input {
            display: block;
            width: 280px;
            padding: 14px 20px;
            border: 1px solid rgba(129, 103, 234, 0.3);
            border-radius: 8px;
            background: rgba(14, 14, 68, 0.5);
            color: #fff;
            font-size: 16px;
            text-align: center;
            margin-bottom: 16px;
            outline: none;
            transition: border-color 0.3s;
        }

        .login-input:focus { border-color: var(--violet); }
        .login-input::placeholder { color: rgba(255,255,255,0.4); }

        .login-btn {
            width: 280px;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--primary-purple), var(--violet));
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(106, 72, 243, 0.4);
        }

        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .error-msg {
            color: #ff6b6b;
            font-size: 13px;
            margin-top: 16px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .error-msg.show { opacity: 1; }

        .decrypt-status {
            color: var(--lavender);
            font-size: 12px;
            margin-top: 12px;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <!-- LOGIN SCREEN -->
    <div id="login-screen">
        <svg class="login-logo" viewBox="0 0 564 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M85.18 13.88H81.96V18.39L85.18 13.88ZM94.9 28.33L105.23 13.88H129.04V28.33H94.9ZM60.99 75.75L77.67 52.43V52.46H122.49V65.86H77.67V93.86H128.14V108.31H60.99V75.75Z" fill="#FFFFFF"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M79.57 0L0 108.2H19.86L99.91 0H79.57Z" fill="#6A48F3"/>
                <path d="M509.35 89.44C512.22 91.03 515.64 92.61 519.61 94.2C523.57 95.69 528.33 96.44 533.88 96.44C535.77 96.44 537.6 96.34 539.38 96.14C541.17 95.84 542.7 95.44 543.99 94.95C545.38 94.35 546.47 93.61 547.26 92.71C548.06 91.72 548.45 90.58 548.45 89.29C548.45 87.4 547.51 85.77 545.63 84.38C543.84 82.89 540.72 81.4 536.26 79.91L530.76 78.27C527.59 77.38 524.66 76.34 521.99 75.14C519.41 73.85 517.13 72.31 515.15 70.53C513.26 68.74 511.78 66.66 510.69 64.27C509.59 61.89 509.05 59.06 509.05 55.79C509.05 52.02 509.69 48.84 510.98 46.26C512.37 43.58 514.2 41.44 516.48 39.86C518.86 38.27 521.64 37.13 524.81 36.43C527.98 35.74 531.35 35.39 534.92 35.39C539.38 35.39 543.99 35.94 548.75 37.03C553.51 38.02 557.87 39.71 561.84 42.09L560.2 56.83C559.01 56.04 557.38 55.19 555.29 54.3C553.31 53.31 551.08 52.41 548.6 51.62C546.12 50.82 543.6 50.18 541.02 49.68C538.44 49.09 536.01 48.79 533.73 48.79C531.16 48.79 528.97 49.29 527.19 50.28C525.51 51.27 524.66 52.96 524.66 55.34C524.66 57.72 525.65 59.71 527.64 61.3C529.62 62.89 532.69 64.42 536.86 65.91L542.06 67.55C544.93 68.44 547.66 69.39 550.24 70.38C552.91 71.37 555.24 72.66 557.23 74.25C559.31 75.84 560.94 77.77 562.13 80.06C563.42 82.24 564.07 85.07 564.07 88.54C564.07 92.51 563.22 95.89 561.54 98.67C559.95 101.35 557.77 103.53 555 105.22C552.22 106.91 548.95 108.1 545.18 108.79C541.51 109.59 537.55 109.99 533.29 109.99C527.74 109.99 522.98 109.44 519.01 108.35C515.05 107.26 511.33 105.87 507.86 104.18L509.35 89.44Z" fill="#FFFFFF"/>
                <path d="M459.2 36.62V19.42L474.83 16.31V36.62H497.3V49.97H475.12V94.61H500.57V108.25H477.8C475.12 108.25 472.64 107.9 470.36 107.21C468.08 106.42 466.1 105.28 464.41 103.8C462.72 102.32 461.38 100.44 460.39 98.17C459.5 95.89 459.05 93.22 459.05 90.16V49.97H445.06V36.62H459.2Z" fill="#FFFFFF"/>
                <path d="M409.9 36.56V47.69C411.49 44.23 413.93 41.31 417.21 38.93C420.48 36.56 424.31 35.27 428.68 35.07H430.47C432.16 34.97 433.75 35.12 435.24 35.52C436.83 35.81 438.37 36.21 439.86 36.7V50.95C438.17 50.16 436.38 49.57 434.49 49.17C432.7 48.78 430.87 48.58 428.98 48.58C426.59 48.58 424.26 48.93 421.97 49.62C419.79 50.21 417.8 51.15 416.01 52.44C414.23 53.63 412.79 55.21 411.69 57.19C410.6 59.07 410.05 61.34 410.05 64.02V108.25H394.41V36.56H409.9Z" fill="#FFFFFF"/>
                <path d="M318.53 75.41C318.83 78.37 319.57 81.14 320.76 83.72C321.94 86.29 323.52 88.52 325.5 90.4C327.58 92.18 330 93.61 332.77 94.7C335.54 95.79 338.7 96.33 342.26 96.33C347.6 96.33 352 95.24 355.46 93.07C358.92 90.79 361.64 87.97 363.62 84.61L376.67 90.84C373.4 96.58 368.91 101.23 363.17 104.79C357.44 108.25 350.32 109.98 341.81 109.98C336.08 109.98 330.79 109.05 325.95 107.17C321.2 105.29 317.1 102.71 313.64 99.45C310.18 96.08 307.51 92.13 305.63 87.58C303.75 83.02 302.81 78.03 302.81 72.59C302.81 67.05 303.75 62 305.63 57.45C307.61 52.8 310.28 48.84 313.64 45.58C317.1 42.21 321.15 39.64 325.8 37.86C330.44 35.98 335.49 35.04 340.93 35.04C346.26 35.04 351.21 35.93 355.76 37.71C360.4 39.49 364.36 42.02 367.62 45.28C370.98 48.55 373.6 52.45 375.48 57.01C377.46 61.56 378.45 66.55 378.45 71.99V75.41H318.53ZM361.69 64.28C360.4 59.63 357.98 55.82 354.42 52.85C350.86 49.88 346.36 48.4 340.93 48.4C335.59 48.4 331.04 49.88 327.28 52.85C323.52 55.72 320.95 59.53 319.57 64.28H361.69Z" fill="#FFFFFF"/>
                <path d="M215.38 140.17V36.53H230.58V52.29C231.77 49.51 233.31 47.09 235.19 45C237.18 42.82 239.41 40.99 241.9 39.5C244.48 38.02 247.21 36.93 250.09 36.23C252.97 35.44 255.9 35.04 258.88 35.04C263.45 35.04 267.72 35.93 271.7 37.72C275.67 39.5 279.09 42.03 281.98 45.3C284.86 48.57 287.14 52.49 288.83 57.05C290.52 61.51 291.36 66.47 291.36 71.92C291.36 77.37 290.52 82.43 288.83 87.08C287.14 91.74 284.76 95.76 281.68 99.13C278.6 102.5 274.92 105.13 270.65 107.01C266.38 108.89 261.66 109.84 256.5 109.84C253.82 109.84 251.18 109.39 248.6 108.5C246.02 107.7 243.64 106.61 241.45 105.23C239.27 103.84 237.28 102.2 235.49 100.32C233.7 98.34 232.21 96.25 231.02 94.07V140.17H215.38ZM253.07 96.3C256.45 96.3 259.48 95.66 262.16 94.37C264.94 93.08 267.28 91.4 269.16 89.32C271.15 87.13 272.64 84.61 273.63 81.73C274.72 78.86 275.27 75.83 275.27 72.66C275.27 69.39 274.72 66.32 273.63 63.44C272.64 60.57 271.15 58.09 269.16 56.01C267.28 53.83 264.99 52.14 262.31 50.95C259.63 49.66 256.6 49.02 253.22 49.02C249.84 49.02 246.76 49.66 243.98 50.95C241.2 52.14 238.82 53.83 236.83 56.01C234.95 58.19 233.46 60.72 232.36 63.59C231.37 66.47 230.87 69.49 230.87 72.66C230.87 75.83 231.37 78.86 232.36 81.73C233.46 84.61 234.95 87.13 236.83 89.32C238.82 91.4 241.15 93.08 243.83 94.37C246.62 95.66 249.69 96.3 253.07 96.3Z" fill="#FFFFFF"/>
                <path d="M157.75 71.67L130.72 36.43H148.69L166.8 60.07L184.92 36.43H202.89L175.57 71.67L203.93 108.25H185.66L166.8 83.27L147.65 108.25H129.68L157.75 71.67Z" fill="#FFFFFF"/>
            </g>
            <defs><clipPath id="clip0"><rect width="564" height="140" fill="white"/></clipPath></defs>
        </svg>

        <div class="login-box">
            <div class="access-badge">Access Restricted</div>
            <input type="password" id="password-input" class="login-input" placeholder="Enter Authorization Code">
            <button id="auth-btn" class="login-btn">Authorize</button>
            <div id="error-msg" class="error-msg">Invalid authorization code</div>
            <div id="decrypt-status" class="decrypt-status"></div>
        </div>
    </div>

    <!-- ENCRYPTED PAYLOAD (AES-GCM encrypted with PBKDF2 key derivation) -->
    <script id="encrypted-data" type="application/json">
    ${payload}
    </script>

    <script>
    (function() {
        const loginScreen = document.getElementById('login-screen');
        const passwordInput = document.getElementById('password-input');
        const authBtn = document.getElementById('auth-btn');
        const errorMsg = document.getElementById('error-msg');
        const decryptStatus = document.getElementById('decrypt-status');

        function base64ToArrayBuffer(base64) {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        }

        async function deriveKey(password, salt) {
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );
            return crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
        }

        async function decryptContent(password) {
            try {
                decryptStatus.textContent = 'Decrypting...';
                const encryptedData = JSON.parse(
                    document.getElementById('encrypted-data').textContent
                );
                const salt = base64ToArrayBuffer(encryptedData.salt);
                const iv = base64ToArrayBuffer(encryptedData.iv);
                const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
                const key = await deriveKey(password, salt);
                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv },
                    key,
                    ciphertext
                );
                const decoder = new TextDecoder();
                return decoder.decode(decrypted);
            } catch (e) {
                return null;
            }
        }

        async function authenticate() {
            authBtn.disabled = true;
            const password = passwordInput.value;
            const content = await decryptContent(password);

            if (content) {
                // Replace the entire page with the decrypted HTML
                document.open();
                document.write(content);
                document.close();
            } else {
                errorMsg.classList.add('show');
                decryptStatus.textContent = '';
                passwordInput.value = '';
                setTimeout(() => errorMsg.classList.remove('show'), 3000);
            }
            authBtn.disabled = false;
        }

        authBtn.addEventListener('click', authenticate);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authenticate();
        });
    })();
    </script>
</body>
</html>`;

writeFileSync(outputFile, wrapper, 'utf-8');
console.log(`Encrypted ${inputFile} -> ${outputFile}`);
console.log(`Payload size: ${(payload.length / 1024).toFixed(1)} KB`);
