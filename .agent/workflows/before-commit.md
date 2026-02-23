---
description: before committing and pushing any code
---

# Before Commit & Push Workflow

Before making any commit or pushing to GitHub, you MUST verify that all checks pass locally. Follow these steps in order:

// turbo-all

1. Go to the backend directory and install dependencies:
```
cd backend && npm install
```

2. Validate that rules.json is valid JSON:
```
node -e "require('./knowledge-base/rules.json'); console.log('rules.json OK')"
```
(Run from: `backend/`)

3. Check engine.js syntax:
```
node --check src/engine.js
```
(Run from: `backend/`)

4. Only after all steps above pass with no errors, stage and commit:
```
git add .
git commit -m "<type>: <Turkish description>"
```

5. Push to the remote branch:
```
git push
```

> If any step fails, fix the issue before committing. Do NOT commit broken code.
