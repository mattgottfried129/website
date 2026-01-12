export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Optional contact endpoint (site works even if you never configure this)
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

      let body;
      try { body = await request.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }

      const name = String(body?.name || "").trim();
      const email = String(body?.email || "").trim();
      const phone = String(body?.phone || "").trim();
      const message = String(body?.message || "").trim();
      const token = String(body?.turnstileToken || "").trim();

      if (!name || !email || !message) return new Response("Missing required fields", { status: 400 });

      const to = env.CONTACT_TO;
      const from = env.CONTACT_FROM;
      if (!to || !from) return new Response("Contact form not configured. Please email matt@mattgottfriedcpa.com.", { status: 501 });

      // Optional Turnstile verification
      const turnstileSecret = env.TURNSTILE_SECRET;
      if (turnstileSecret) {
        if (!token) return new Response("Missing Turnstile token", { status: 400 });

        const ip = request.headers.get("CF-Connecting-IP") || "";
        const fd = new FormData();
        fd.append("secret", turnstileSecret);
        fd.append("response", token);
        if (ip) fd.append("remoteip", ip);

        const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: fd });
        const vj = await vr.json();
        if (!vj?.success) return new Response("Turnstile verification failed", { status: 403 });
      }

      const subject = `New website inquiry — ${name}`;
      const lines = [
        "New website contact form submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        "",
        "Message:",
        message,
      ].filter(Boolean);

      const content = lines.join("\n");

      const mc = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from, name: "Gottfried & Associates PA Website" },
          reply_to: { email: email, name: name },
          subject,
          content: [{ type: "text/plain", value: content }],
        }),
      });

      if (!mc.ok) return new Response(`Email send failed: ${await mc.text()}`, { status: 500 });
      return new Response("OK", { status: 200 });
    }

    // Serve static assets from ./dist (configured via wrangler.jsonc)
    return env.ASSETS.fetch(request);
  }
};