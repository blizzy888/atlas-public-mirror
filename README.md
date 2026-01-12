# Atlas

Supplement tracking app with AI-powered analysis.

## Setup

```bash
bun install
```

Add your OpenAI key to `.env`:
```
EXPO_PUBLIC_OPENAI_API_KEY=your_key
```

## Run

```bash
bunx expo start
```

## Security Note

The OpenAI API key is currently stored client-side for demo purposes only. This is acceptable for a closed demo to avoid infrastructure overhead, but **must not be used in production**.

For production, API calls should be proxied through an authenticated backend server to:
- Protect the API key from exposure
- Enable rate limiting and abuse prevention
- Add user authentication and access control
