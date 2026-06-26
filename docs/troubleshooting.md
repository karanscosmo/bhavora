# Troubleshooting

## Mapbox fails to render
**Symptom:** The map container is completely black or shows a 401 Unauthorized error in the console.
**Solution:** Check `.env.local` and ensure `NEXT_PUBLIC_MAPBOX_TOKEN` is correctly configured with a valid Mapbox GL JS token that has URL restrictions allowing `localhost` or your production domain.

## Build fails on Vercel (Type Errors)
**Symptom:** Next.js throws `Failed to type check` during build.
**Solution:** Ensure you are running `npm run type-check` locally before pushing. Bhavora enforces strict TypeScript configurations.

## API returns 400 Bad Request
**Symptom:** Zod validation fails on an API route.
**Solution:** Ensure the payload strictly matches the expected types in the documentation. E.g., `evAdoption` must be a number between 0 and 100.
