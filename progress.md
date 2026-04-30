Original prompt: Apply all reasonable changes

Progress:
- Reviewed the Vite React card game structure.
- Found two parallel game implementations: a polished inline App.jsx flow and a cleaner pure logic layer in src/logic.
- Plan: keep the current UI, wire it to the pure logic layer, fix lint, improve labels/game feedback, and add logic tests.
- Wired App.jsx to the shared deck/outcome helpers and removed duplicate random-card logic.
- Added session stats, better bet validation text, scroll reset on screen changes, and final-round accuracy.
- Added Node logic tests and a Playwright smoke script.
- Ran lint, tests, build, the develop-web-game client, and the targeted smoke test successfully.

TODO:
- Future polish idea: add card flip/sound settings if the game needs more arcade feel.
