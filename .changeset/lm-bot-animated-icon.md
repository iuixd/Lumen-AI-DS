---
"@lumen/ui": minor
---

Added `lm-bot-animated`, an animated bot avatar icon (antenna wiggle, eye-blink, and a built-in loading-dot animation via embedded CSS `@keyframes`), to the generated icon set as `LmBotAnimatedIcon`. Added `AIPanelMessage.avatarIcon`, a new optional per-message override for the bot avatar, so a consumer can show a different icon (e.g. this animated one during a "thinking" state) for one specific message without affecting any other — fully backward compatible, existing usage is unaffected. Also fixed the icon-generation pipeline (`icons-import.mjs`) to correctly handle SVGs with embedded `<style>`/animation blocks, which previously had never been exercised and failed to compile.
