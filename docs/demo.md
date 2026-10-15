# Try the working demo

The release-review demo uses the components in `skills/ui-motion/assets/react`
directly. It runs a local server for verification; it doesn't contact an account
service or publish a release.

From a repository checkout, with Node.js 22.18+ or 24.11+:

```sh
npm ci
npm run demo
```

Open [127.0.0.1:4317](http://127.0.0.1:4317). The server binds to the local machine.
Stop it with Ctrl+C. The demo and video tools are development files; installing
the skill doesn't install or launch them.

## Things to try

1. Switch between All, Ready, and Needs review. Selection and results update together.
2. Start a review, change its name, continue, and go back. The name stays in place.
3. At confirmation, enter a wrong code, then retry with **246810**. Verification
   comes from the local server. Clearing a verified code disables completion again.
4. Enable **Hold verification response**, submit, and press Escape. The pending
   fetch is aborted and focus returns to the opener. Turn the switch off afterward.
5. Enable **Simulate reduced motion** and repeat the flow. The demo makes the
   reduced-motion media query true; it never overrides a real reduced-motion
   preference to enable animation.
6. Follow the story links. The content is always present; the progress rail and
   reading indicator follow the scroll position when motion is allowed.

The held-response switch deliberately leaves a request pending for cancellation
testing. It doesn't fake a successful response or add a timed delay.

## Video

[Watch the edited recording](https://github.com/adnanrahim110/ui-motion-skill/blob/main/docs/assets/ui-motion-demo.mp4).
It is a silent, captioned 1080p recording of the working browser UI. Section cuts
use short dissolves; the interactions retain their captured timing. Mobile footage
uses a 390 × 844 viewport. Output encoding is 30 fps; this is not an animation
performance measurement.

Raw frames and timestamps stay in the ignored `.artifacts/capture` directory.
`node demo/edit-video.mjs` rebuilds the edit when that capture is present and FFmpeg
is on PATH. On another OS, set `DEMO_FONT` to a local font file. The video is kept
out of the CLI package.

[Browser test results](https://github.com/adnanrahim110/ui-motion-skill/blob/main/docs/browser-validation.md)
record what was checked and the remaining limits.
