JCW – AI Coding Agent Instructions
1. Project Context

Project: Just Code Works (JCW) – V1 fresh start
Stack: Django backend + Next.js App Router (TypeScript + Tailwind) frontend.
Goal: Multi-tenant website builder with HQ site + user dashboard, but V1 is focused on a clean, working base (no legacy migrations, no old template systems, no huge refactors).

You are an assistant working inside VS Code on Windows.

2. Environment Rules

Assume Windows CMD, not PowerShell.

Do not use && or PowerShell syntax in any commands.

Typical commands should look like:

cd C:\projects\justcodeworks\backend_v1
python manage.py runserver 8000

cd C:\projects\justcodeworks\frontend_v1
npm run dev -- -p 3001


Never suggest destructive shell commands unless the user explicitly asks for them.

Forbidden without explicit request:

rm -rf, rmdir /S /Q

git clean -fdx

Deleting or renaming large folders (like backend, frontend, src/app, .github)

3. How You Should Work
General mindset

Make small, precise changes, not big refactors.

Prefer editing existing files over creating new structure.

If something is ambiguous: ask the user instead of guessing.

When modifying code

Only touch the files and functions the user names.

Before changing a file, make sure it actually exists (search first).

Keep changes minimal and focused on the task.

Show diffs / edited snippets, not whole files unless necessary.

Do not introduce new architecture, patterns, or large abstractions unless the user explicitly requests it.

4. Things You MUST NOT Do On Your Own

Unless the user explicitly asks for it in this session, you must not:

Rebuild or redesign the routing tree for Django or Next.js.

Rewrite the auth system (JWT, sessions, middleware, guards, etc.).

Replace the template / section / builder systems with a new design.

Add new Django models or migrations.

Change CORS, CSRF, or global security settings.

Implement features that are described as “future”, “planned”, or “v2+” in any docs.

Delete or “clean up” old code just because it looks unused.

If you see large documentation (like old builder specs, template lab reports, etc.), treat them as reference only, NOT as automatic todo lists.

5. How to Treat Documentation in This Repo

Files like project_setup.md are high-level reference.
Use them to understand the architecture, not as instructions to implement everything you see.

Any large documentation describing:

Step 0 builder

Template Lab

Advanced printing system

SEO systems

v0.3, v1.6, v2 or v3 plans

…is historical and planning material.
You must not treat it as something to implement unless the user explicitly asks.

6. When the User Asks You to Edit Files

When the user wants file changes, follow this pattern strictly:

Identify the exact file(s) they mention.

Confirm the current content (by reading it).

Apply only the changes needed for the requested behaviour.

Keep existing structure and style where possible.

Avoid touching unrelated parts of the file.

Do not:

“Improve” surrounding code unless asked.

Convert entire files to a new style or pattern.

Introduce new dependencies without explicit approval.

7. Communication Style

Be concise and practical.

Clearly separate:

What you changed,

Why you changed it,

What the user should run or test (if needed).

If something is risky or not fully verified, say so explicitly.

8. Summary

Your priorities in this repo:

Follow the user’s current request only.

Avoid destructive or large-scale changes.

Treat big docs as reference, not automatic tasks.

Keep JCW V1 simple, stable, and easy to extend later.
