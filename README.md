# Arabic Adventures

Arabic Adventures is a React Native / Expo learning app for children starting Arabic. It contains all 28 letters in alphabetical order, two vocabulary lessons per letter. Albanian is the default interface language; English is available from the language switcher. Arabic text and pronunciation do not change with the interface language.

This guide is for the developer taking over the project. Start with the setup below, then read `src/data.ts`, `app/_layout.tsx`, and one lesson route to understand the main flow.

## Start locally

The project uses Expo SDK 57, React 19, React Native 0.86, TypeScript, and npm. Node 22.13.1 was used during development. Use the committed `package-lock.json` for reproducible installs.

```sh
npm ci
npm run web
```

Use the URL printed by Expo. For mobile development:

```sh
npm start
npm run android
```

Use an SDK-compatible Expo client or configured development build. `npm run ios` requires macOS for the iOS simulator. These commands start development sessions; they do not produce installable release binaries.

There are no application API keys, environment variables, backend services, or database migrations required to run the learning experience.

### Preview a production web export

```sh
npm run build
python scripts/preview.py
```

Open `http://localhost:8081`. The Python server handles extensionless routes such as `/lesson/duck`, so refreshing a lesson works. Stop it before starting another server on port 8081. Python 3 is only required for this optional preview server, not for the app or development server.

The native app bundles images and audio and saves progress locally. The web export is **not an offline PWA**: there is no service worker, so it still needs a server to load its files.

## Codebase map

| Path                           | Responsibility                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `app/_layout.tsx`              | Root safe-area setup, language and progress providers, Expo Router stack.                                                        |
| `app/index.tsx`                | Game home: play/continue, level totals, stars and bonus quiz.                                                                    |
| `app/levels.tsx`               | One continuous map of all 28 letter levels, with completed and current level markers.                                            |
| `src/levels.ts`                | Level status derived from existing completed word IDs. Both words complete a level; all levels remain available to replay.       |
| `app/lesson/[id].tsx`          | Finds a lesson by its stable word ID, connects audio and completion, renders the poster board. Exports the static lesson routes. |
| `app/coloring.tsx`             | Temporary drawing state, pointer responder, palette, Undo and reset.                                                             |
| `app/quiz.tsx`                 | Ten-question round: five letter questions and five image-to-Arabic questions, answer feedback, rewards and replay.               |
| `app/progress.tsx`             | Completed words and aggregate progress.                                                                                          |
| `app/+html.tsx`                | Default Albanian document language and web metadata.                                                                             |
| `src/data.ts`                  | Typed letter groups, vocabulary objects, derived flat lesson list.                                                               |
| `src/LessonBoard.tsx`          | Shared reference-inspired poster presentation and artwork masks.                                                                 |
| `src/ui.tsx`                   | Shared shell, button, colors and common styles. The lesson route has its own minimal frame.                                      |
| `src/LanguageSwitcher.tsx`     | The single language selector used by both screen frames.                                                                         |
| `src/language.tsx`             | Selected language, local persistence and web document language/title.                                                            |
| `src/translations.ts`          | Interface messages, interpolation and English fallback.                                                                          |
| `src/alphabet-translations.ts` | Albanian letter names and vocabulary meanings. Merged into the interface dictionary.                                             |
| `src/progress-model.ts`        | Pure completion/reward rules, stored progress shape, star totals and streak calculation.                                         |
| `src/progress.tsx`             | React progress context and serialized AsyncStorage reads/writes.                                                                 |
| `src/quiz.ts`                  | Question sampling and answer-option shuffling. Accepts a random function for deterministic checks.                               |
| `src/drawing.ts`               | Immutable stroke snapshots and canvas-relative movement math.                                                                    |
| `src/audio.ts`                 | Generated literal WAV imports required by Metro.                                                                                 |
| `assets/audio/`                | Bundled recordings and generated pronunciation manifest.                                                                         |
| `examples/`                    | Original Baa design supplied for the app.                                                                                        |
| `scripts/`                     | Checks, audio-list synchronization, optional voice generation and web preview.                                                   |

Keep this structure small. Screens own their interaction state; shared modules cover actual reuse or independently testable behavior. There is no global navigation store, service layer, or generic persistence framework.

## How a lesson works

1. `src/data.ts` defines each group and its words. A word has named fields: `id`, `arabic`, `english`, `say` (transliteration), and `emoji`.
2. `lessons` flattens these words and adds a numeric `group` index. The index is used for in-memory lookup only.
3. The home screen opens `/lesson/<word-id>`. The lesson screen passes the group's words to `LessonBoard` and looks up bundled audio by the same ID.
4. Finishing a letter records both displayed word IDs. Each newly completed word awards three stars once; saved completions are not rewarded again. A completion popup shows three stars and plays the preloaded Arabic “MashaAllah” clip automatically on a dedicated player. Reopening a finished letter does not replay the celebration.
5. The next-letter action opens the first word of the following letter, wrapping from Yaa to Alif. The home screen recommends the first unfinished word, returning to the first word when all are complete.

Baa has two vocabulary lessons: duck and orange, matching the supplied reference. Both count toward completion within the 56-lesson total.

### Arabic rendering and artwork

Render each Arabic word in one parent `Text` layout. The first letter and its combining vowel marks use a nested inline `Text` color span, so shaping stays continuous and the entire initial glyph is red. Do not put the pieces in separate layout views or use a fixed-width clipping mask.

Letter forms are stored in this order: isolated, beginning, middle, ending. The board shows ending, middle and beginning across the top, with the isolated letter in the square. Letters that do not connect forward use their appropriate repeated forms.

Duck and orange use SVG masks over the original JPEG. The mask coordinates depend on that image's dimensions; replacing the image requires checking those masks. Other words use platform emoji, so their appearance varies by OS. This is an MVP artwork limitation, not a collection of custom illustrations for every word.

## Local state and compatibility

AsyncStorage uses two separate keys:

| Key                             | Value                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `arabic-adventures-v1`          | JSON object with `completed: string[]`, `days: string[]`, and `quizStars: number`. |
| `arabic-adventures-language-v1` | `sq` or `en`. Missing or unrecognized values leave Albanian selected.              |

**Keep vocabulary IDs stable.** They are both route names and persisted completion identifiers. Renaming `duck` would orphan a saved completion unless you add a migration. Rearranging groups is safe because group indexes are not stored. Unknown completion IDs are filtered when progress loads.

Progress updates wait for the initial read. Writes are queued so an older save cannot finish after a newer one and overwrite it. The two providers intentionally manage their own small queues rather than introducing a generic storage abstraction.

Stars are derived from completed lessons plus quiz stars; screens read the total from the progress context. Correct quiz answers award one star, including on replay. A streak counts consecutive local calendar dates with activity, starting today or yesterday. Dates use the device's local timezone.

Drawings are temporary screen state. Leaving the coloring screen discards them; they are not part of saved progress. No account, cloud sync, payments or advertising are implemented.

## Making common changes

### Add or edit vocabulary

1. Edit the named word object in `src/data.ts`. Keep its ID if it is an existing word.
2. Add its English-to-Albanian meaning in `src/alphabet-translations.ts`.
3. Run `npm run audio:sync`. This regenerates `src/audio.ts` and `assets/audio/words.json` from the catalog; do not maintain those lists by hand.
4. Supply `assets/audio/<id>.wav`. The runtime must use bundled audio, not a remote pronunciation service.
5. Run `npm run verify`, then open the lesson, coloring activity and quiz. Verify the word starts with the intended letter and fits the board.

The checks intentionally assert the current 28-letter / 56-lesson scope. If a product decision changes the number of words per letter, update those assertions and the home screen's two-word progress labels together.

### Generate pronunciation files on Windows

The vocabulary recordings were generated with the installed Microsoft Naayf Arabic voice, except `assets/audio/zaby.wav`, synthesized from “ظَبْي” using Google Translate’s Arabic speech service and converted to PCM WAV. The separate `assets/audio/MashaAllah.mp3` celebration clip was synthesized from “مَا شَاءَ اللَّهُ” using Google Translate’s Arabic speech service and is bundled locally; playback makes no request to that service. Generation is an optional contributor tool; end users do not need that voice installed.

```powershell
npm run audio:sync
./scripts/generate-audio.ps1
```

Use a PowerShell runtime that can access the voice; PowerShell 7 worked on the original development machine. If the voice is unavailable, use a reviewed recording instead. The generator skips existing WAV files larger than 1,000 bytes, so changing the Arabic text alone does **not** regenerate an existing recording. Replace that recording explicitly when changing pronunciation.

A native Arabic speaker should review the pronunciation and educational content before classroom distribution. File checks verify presence and catalog consistency, not pronunciation quality.

### Change interface text or add another language

Call `t('English message')` for interface text. English is the source message and fallback; Albanian lives in the dictionary. Use whole messages with named placeholders, for example `t('Hear {word} in Arabic', {word: t(lesson.english)})`, instead of concatenating translated fragments.

Vocabulary translations belong in `src/alphabet-translations.ts`; other interface copy belongs in `src/translations.ts`. Avoid duplicating vocabulary keys in both files.

To add another language, extend the `Language` union and translation selection in `src/translations.ts`, update the accepted stored values in `src/language.tsx`, and add the option in `src/LanguageSwitcher.tsx`. Keep `sq` as the initial language unless the product default changes. The original poster artwork and Arabic recordings remain independent of interface language.

### Change coloring interactions

Preserve the immutable stroke snapshots: a queued React state update must not read `active.current`, because release clears that reference. Movement is calculated from a fixed starting point plus gesture deltas. The inner canvas owns pointer events so crossing the picture or text cannot change the coordinate origin.

Native scrolling is disabled during drawing. Web uses `touchAction: 'none'` on the canvas while retaining the surrounding scroll layout. A second finger ends the active stroke to avoid jumps from a changed touch centroid. Re-test taps, long drags, release outside the canvas, Undo, reset, and touch scrolling after any responder change.

## Checks and formatting

```sh
npm run verify
```

This runs TypeScript checking, the lightweight Node checks, the web export, checks of that export, and formatting verification. For shorter feedback loops:

| Command                | Checks                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`    | TypeScript across application code.                                                                                                                                     |
| `npm test`             | Alphabet order and IDs, audio list consistency, translations/placeholders, quiz sampling, drawing regressions, progress rewards/storage/streaks. No web build required. |
| `npm run build`        | Production web export to `dist/`.                                                                                                                                       |
| `npm run test:export`  | Content checks plus default Albanian text/metadata in the existing web export. Run after building.                                                                      |
| `npm run format`       | Apply the pinned Prettier formatting rules.                                                                                                                             |
| `npm run format:check` | Report formatting differences without editing.                                                                                                                          |

The Node checks use `scripts/load-typescript.cjs` to load pure local TypeScript modules with the already installed compiler. They are not a replacement for React interaction tests or device testing. Translation scanning catches literal message keys and visible untranslated JSX text; dynamic messages still need review.

Manual smoke test before a release: open Baa and another letter, play both words, switch language and restart, complete a word twice, replay a quiz, and draw using both mouse and touch. Check saved progress after restart and test offline behavior in an installed native build. Browser checks cannot establish physical-device behavior.

## Builds, configuration and generated files

- `app.json` contains the existing Expo identity, Android package name and linked EAS project. Preserve these when handing over the app; changing them can create a different app identity.
- `eas.json` contains development, preview and production profiles. The development profile expects a development client setup. Verify that setup before using it; `expo-dev-client` is not currently a direct dependency.
- Native JavaScript bundling was checked during earlier development. That is not proof of a successful installable release build, store submission, or physical-device test.
- `dist/`, `dist-native/`, `.expo/` and `node_modules/` are generated and ignored. Do not edit them to change application behavior.
- Commit `package-lock.json` when changing dependencies. Preserve compatible Expo package versions rather than independently upgrading React Native modules.

There is no CI workflow configured in this repository. `npm run verify` is the local handoff gate and can be used by a future CI workflow without introducing a new test runner.
