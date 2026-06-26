# Security Posture

Bhavora adheres to enterprise-grade security standards across its web application stack.

## Middleware Controls (`middleware.ts`)
- **Content-Security-Policy (CSP):** Restricts script, style, and image sources to self, Mapbox, and trusted domains. Disables object execution.
- **Strict-Transport-Security (HSTS):** Enforced globally.
- **X-Frame-Options:** Set to `DENY` to prevent clickjacking.
- **Rate Limiting:** IP-based request throttling applied to all `/api/*` endpoints.

## API Validation
All external input hitting the API routes is validated strictly against predefined Zod schemas. Invalid payloads receive a standardized `400 Bad Request` containing precise error structures.

## Cross-Site Scripting (XSS)
- React inherently protects against XSS by escaping text.
- No instances of `dangerouslySetInnerHTML` are used across the codebase.
- User-generated content in the Scenario Builder is sanitized before persistence.

## Dependencies
Regularly audited via `npm audit`. Outdated vulnerable packages are patched immediately.
