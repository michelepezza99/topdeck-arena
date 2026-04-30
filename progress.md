Original prompt: Apply all reasonable changes

Progress:
- Reviewed the Vite React card game structure.
- Found two parallel game implementations: a polished inline App.jsx flow and a cleaner pure logic layer in src/logic.
- Plan: keep the current UI, wire it to the pure logic layer, fix lint, improve labels/game feedback, and add logic tests.
- Wired App.jsx to the shared deck/outcome helpers and removed duplicate random-card logic.
- Added session stats, better bet validation text, scroll reset on screen changes, and final-round accuracy.
- Added Node logic tests and a Playwright smoke script.
- Ran lint, tests, build, the develop-web-game client, and the targeted smoke test successfully.
- New request: considerably improve the website graphics, then save, commit, and push.
- Current plan: keep the existing game behavior, redesign the visual system in App.jsx/main.css, fix visible mojibake text, then rerun lint/test/build/smoke/browser checks before committing.
- Implemented the visual redesign and found the 1280x720 game view needed tighter vertical rhythm, so the in-game hero/card area was compacted to keep controls reachable without scroll.
- Verified with npm test, npm run lint, npm run build, npm run smoke, develop-web-game Playwright client, and desktop/mobile screenshot inspection.
- New request: make every website section more professional and advanced, especially the text.
- Updated the main website copy, legal/contact content, game labels, result language, metadata, and smoke script labels while preserving the existing game behavior.
- Re-verified with npm test, npm run lint, npm run build, npm run smoke, the develop-web-game client, and desktop/mobile screenshots of start, game, result, privacy, and contact views.

TODO:
- Future polish idea: add card flip/sound settings if the game needs more arcade feel.
