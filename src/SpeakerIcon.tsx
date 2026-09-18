import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from './ui';

export function SpeakerIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <Path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke={colors.green}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"
        stroke={colors.green}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
