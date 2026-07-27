---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fixed 3 further dark-theme drifts in AIPanel: the "Show sources" link now matches `TextLink`'s own dark color instead of an independently-drifted value; the bot avatar icon now uses a new, correctly-scoped `app-shell.bot-icon` token instead of borrowing `text-body`'s (wrong in dark); and `typography.json` scale entries can now carry a `dark` override, emitted by `build.mjs` as a `[data-theme="dark"]` CSS-variable override alongside colors (added for message-bubble text, though a same-day correction found that specific token's dark/light split wasn't real — see `chat-message-single-size-correction.md` — the override mechanism itself stays, generic and available for a real future case).
