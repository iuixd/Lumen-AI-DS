---
"@lumen/ui": patch
---

Replace `FileUploadDropzone`'s separately assembled header illustration with the supplied default and animated hover SVG exports. Hovering the upload zone now crossfades the fixed-size header artwork to the self-animated SVG and reverses the transition on pointer exit, without changing the component API or layout. The upload zone now uses a native label/file-input relationship, fixing the missing form label and nested interactive-control accessibility violations while preserving click, keyboard, and drag-and-drop behavior.
