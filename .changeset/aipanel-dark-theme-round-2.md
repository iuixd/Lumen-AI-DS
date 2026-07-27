---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fixed 3 further dark-theme drifts in AIPanel: the "Show sources" link now matches `TextLink`'s own dark color instead of an independently-drifted value; the bot avatar icon now uses a new, correctly-scoped `app-shell.bot-icon` token instead of borrowing `text-body`'s (wrong in dark); and message-bubble text now correctly renders smaller in dark mode (14/16 vs light's 16/18), the first theme-varying typography token in this system — `typography.json` scale entries can now carry a `dark` override, emitted by `build.mjs` as a `[data-theme="dark"]` CSS-variable override alongside colors.
