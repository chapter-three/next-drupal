# CORS Configuration for Next.js Module

## Security Update

As of version 2.x (and backported to 1.x), the Next module **no longer automatically enables CORS**. Previous versions created a security vulnerability by forcing `Access-Control-Allow-Origin: *` on all requests.

## Do You Need CORS?

Most Next.js applications do **NOT** need CORS:

- ✅ **No CORS needed**: `getStaticProps`, `getServerSideProps`, Server Components, API routes, Server Actions
- ❌ **CORS required**: Client-side `fetch()` calls directly to Drupal from the browser

**Recommended**: Use Next.js API routes or Server Actions as a proxy. Your client fetches from Next.js (same-origin), which fetches from Drupal server-side. More secure, no CORS needed.

## Configuration

If you need CORS, configure it in `sites/default/services.yml`:

```yaml
parameters:
  cors.config:
    enabled: true
    allowedOrigins:
      - "https://www.your-site.com" # Your Next.js domain
      - "http://localhost:3000" # Local development
    allowedMethods: ["GET", "POST", "OPTIONS"]
    allowedHeaders: ["authorization", "content-type", "accept"]
    supportsCredentials: true # Required for auth
```

**Never use `allowedOrigins: ['*']` in production.**

Then clear cache: `drush cr`

## Next.js-Specific Notes

- **Different subdomains = different origins**: `www.site.com` ≠ `cms.site.com` - list each explicitly
- **Preview mode**: Uses server-side auth, doesn't need CORS
- **On-demand revalidation**: Drupal → Next.js, doesn't need CORS on Drupal side
- **Environment-specific config**: Use `development.services.yml` for local development (loaded via `settings.local.php`)

## Resources

- [Drupal CORS Documentation](https://www.drupal.org/node/2715637)
