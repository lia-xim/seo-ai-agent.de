# Security policy

Do not open a public issue for a suspected vulnerability, exposed credential, private endpoint, or personal data. Use GitHub's private vulnerability reporting or security advisory flow for this repository.

The implemented site is static. The Task Spec Builder and SEO agent cost calculator run locally in the browser and do not upload task contents, require login, or call a provider API. The canonical public pages are indexable; the true 404 remains noindex.

Any future network fetcher, authentication flow, API, upload, user data, billing, automated site write, or destructive action requires a dedicated security and privacy review before release. Provider credentials must remain domain- and task-scoped, and public benchmark evidence must not expose customer or personal data.