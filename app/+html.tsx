import {ScrollViewStyleReset} from 'expo-router/html';
import type {PropsWithChildren} from 'react';
export default function Root({children}:PropsWithChildren){return <html lang="sq"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Aventura me arabishten</title><meta name="description" content="Zbulo shkronjat arabe përmes figurave, shqiptimit, ngjyrosjes dhe kuizeve të shkurtra."/><meta name="theme-color" content="#447D45"/><ScrollViewStyleReset/></head><body>{children}</body></html>}
