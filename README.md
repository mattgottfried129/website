# Gottfried & Associates PA — Cloudflare Worker + Static Assets

This repository deploys a **Cloudflare Worker** that serves the site from ./dist.

## Deploy command (Cloudflare dashboard)
Use:
- npx wrangler deploy

Wrangler will read wrangler.jsonc and deploy:
- Worker script: src/index.js
- Static assets: dist/

## Calendar
The New Client Consultation calendar is embedded in dist/index.html.

## Optional: contact form email
If you want the contact form to actually email you, set Worker environment variables:
- CONTACT_TO = matt@mattgottfriedcpa.com
- CONTACT_FROM = website@mattgottfriedcpa.com (or any valid sender you control)
- TURNSTILE_SECRET (optional but recommended)

Also replace __REPLACE_WITH_TURNSTILE_SITE_KEY__ in dist/index.html with your Turnstile Site Key.
