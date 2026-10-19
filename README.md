# Interview Question 09 — Community Post Comments

A small social feed with the supplied “Change can” style post, a locally drawn community illustration, and a comment thread below it. Press Enter to save a comment; Shift+Enter inserts a line break. The API fixes the author name to **Blend 285** and persists comments in SQLite.

## Run locally

Requires .NET 10, Node.js 22.22.3+, and npm 10.9.8+.

```powershell
dotnet run --project backend/Question009.Api/Question009.Api.csproj --launch-profile http
```

Run `npm ci` and `npm start` from `frontend`, then open `http://localhost:4208`. Angular proxies `/api` to `http://localhost:5224`. SQLite creates `backend/Question009.Api/comments.db` at first start.

## API

- `GET /api/comments` returns saved comments in posting order.
- `POST /api/comments` accepts `{ "text": "..." }`; the server supplies the fixed author name.
- `GET /api/comments/{id}` returns a saved comment.

Comment text is trimmed, required, and limited to 1,000 characters. Author identity is not accepted from the browser request.

## Verify

```powershell
dotnet test tests/backend/Question009.Api.Tests/Question009.Api.Tests.csproj --configuration Release
dotnet build backend/Question009.Api/Question009.Api.csproj --configuration Release
cd frontend
npm ci
npm test
npm run build
```

Results: backend **3 passed**, Angular **3 passed**, and production Angular bundle **148.30 kB** initial (estimated transfer **43.91 kB**).

Package identity: `@example-com/interview-question-009`; namespace: `Example.Com.InterviewQuestion009`.
