---
"@lumen/ui": minor
"@lumen/patterns": patch
---

`FileUploadDropzone` now shows the full-viewport violet drag overlay ("Drop your files like there's no limit!") while files are dragged over the window, and accepts a drop anywhere — the same behavior `DataExtractionOnboardingPage` already had. The overlay and its drag tracking moved from the pattern into `@lumen/ui` as the new `FileDropOverlay` component and `useWindowFileDrag` hook, and both packages now use them. New `dropOverlay` prop (`"page"` default, `"none"` limits drag feedback to the card). The resting appearance is unchanged.

New `FileUploadFlow` composite: the working upload journey (dropzone → drag overlay → Uploading → Uploaded → Create Project, with remove confirmation, Cancel, and create-failure recovery), extracted unchanged from `DataExtractionOnboardingPage`. That pattern now renders `FileUploadFlow` after login and no longer adds its own `ToastProvider` wrapper.
