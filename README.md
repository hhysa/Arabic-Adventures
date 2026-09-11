# Arabic Adventures

A child-friendly Expo / React Native app with all 28 Arabic letters in alphabetical order, 56 vocabulary lessons, a bonus orange word, local pronunciation, drawing activities, quizzes, and device-local progress.

Every letter uses the shared poster board and includes two words, contextual forms, coloring, and bundled WAV audio. Quizzes sample five different letters across the whole alphabet with four choices per question. Existing completion IDs are preserved when new letters are added.

## Languages

Albanian (`sq`) is the default interface language. The header’s Shqip / English selector changes every screen immediately and saves the choice locally, separately from learning progress. Arabic words, letter forms, and pronunciation stay in Arabic. The supplied poster remains unchanged.

`src/translations.ts` centralizes interface text, vocabulary meanings, and interpolated messages. `src/language.tsx` owns the selected language and storage. Add future locales through this shared layer. Run `node scripts/check-translations.cjs` after the web build to validate translations and default-locale output.

## Run

```sh
npm install
npm start
```

Open with a compatible Expo SDK 57 client, or run `npm run web` for the browser version. `npm run android` opens the Android development flow. iOS simulator builds require macOS.

```sh
npm run typecheck
npm run build
```

The web export is written to `dist`. Native release binaries have not been built or tested on a physical device. The native application bundles its lesson images and WAV files and saves progress through AsyncStorage. The web preview requires its local server; it is not a service-worker-enabled offline PWA.

## Content and assets

- `src/data.ts`: joined Arabic vocabulary and contextual letter forms.
- `src/progress.tsx`: serialized local progress, completion rewards, quiz stars, and calendar-day streaks.
- `app/`: home, lesson, quiz, coloring, and progress routes.
- `examples/letter baa example.jpeg`: supplied reference image, used on the home screen and as masked duck/orange artwork on the Baa board.
- `src/LessonBoard.tsx`: shared poster layout with contextual forms, large and small pictures, faded practice words, and joined Arabic with a clipped red highlight. Baa pairs duck with orange; the door lesson remains available below the board.
- `assets/audio/`: bundled Arabic pronunciation generated with the installed Microsoft Naayf Arabic voice. No runtime speech service is used. Pronunciation should receive a native Arabic speaker’s review before classroom distribution.

Coloring is a freehand drawing and word-tracing activity. Drawings are temporary and are cleared when leaving the screen. Vocabulary without supplied artwork uses platform emoji. The original poster is retained unchanged, including its original typography and language.

Lesson completion awards three stars once per word. Each correct quiz answer awards one star; replaying quizzes can earn additional stars. No accounts, ads, payments, or cloud storage are included.
