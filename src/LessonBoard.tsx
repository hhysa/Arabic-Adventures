import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  Polygon,
  Path,
  Image as SvgImage,
} from 'react-native-svg';
import { groups, VocabularyWord } from './data';
import { useLanguage } from './language';
const reference = require('../examples/letter baa example.jpeg');
function Picture({ word, size }: { word: VocabularyWord; size: number }) {
  const crop =
    word.id === 'duck'
      ? { x: 223, y: 119, w: 493, h: 469 }
      : word.id === 'orange'
        ? { x: 269, y: 708, w: 488, h: 428 }
        : null;
  if (!crop)
    return (
      <Text
        style={{ fontSize: size * 0.76, lineHeight: size, textAlign: 'center' }}
      >
        {word.emoji}
      </Text>
    );
  const clipId = `art-${word.id}-${Math.round(size)}`;
  const points =
    word.id === 'duck'
      ? '446,119 544,119 571,249 562,291 579,393 572,474 682,476 717,521 717,589 220,589 220,503 343,472 359,363 403,296 397,222 436,204'
      : '267,908 312,825 415,758 535,746 613,714 695,708 713,730 684,778 747,823 749,875 703,863 679,906 706,944 751,1033 733,1111 614,1136 380,1136 267,1072';
  return (
    <Svg
      width={size}
      height={(crop.h * size) / crop.w}
      viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
    >
      <Defs>
        <ClipPath id={clipId}>
          <Polygon points={points} />
        </ClipPath>
      </Defs>
      <SvgImage
        href={reference}
        x={0}
        y={0}
        width={887}
        height={1280}
        clipPath={`url(#${clipId})`}
      />
    </Svg>
  );
}
function JoinedWord({
  word,
  width,
  fontSize,
  ghost = false,
}: {
  word: string;
  width: number;
  fontSize: number;
  ghost?: boolean;
}) {
  // Keep complete joined Arabic in both layers; clip only the highlight layer.
  const style = {
    width,
    fontSize,
    lineHeight: fontSize * 1.7,
    fontWeight: '700' as const,
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
    color: ghost ? '#C7CEAF' : '#48762B',
  };
  return (
    <View style={{ width, height: fontSize * 1.7 }}>
      <Text style={style}>{word}</Text>
      {!ghost && (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: fontSize * 0.48,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Text
            accessible={false}
            style={[
              style,
              { position: 'absolute', right: 0, color: '#ED171A' },
            ]}
          >
            {word}
          </Text>
        </View>
      )}
    </View>
  );
}
function WordRow({
  word,
  width,
  onPlay,
  onColor,
}: {
  word: VocabularyWord;
  width: number;
  onPlay: (id: string) => void;
  onColor: (id: string) => void;
}) {
  const { t } = useLanguage(),
    scale = width / 887,
    label = t('Hear {word} in Arabic', { word: t(word.english) });
  return (
    <View style={{ height: 680 * scale + 60, position: 'relative' }}>
      <Text
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '6%',
          top: '49%',
          fontSize: 65 * scale,
          opacity: 0.09,
        }}
      >
        🐾
      </Text>
      <Text
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: '4%',
          top: '29%',
          fontSize: 65 * scale,
          opacity: 0.08,
        }}
      >
        🐾
      </Text>
      <View
        style={{
          position: 'absolute',
          left: '24%',
          top: 0,
          width: '58%',
          alignItems: 'center',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => onPlay(word.id)}
        >
          <Picture word={word} size={width * 0.57} />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => onPlay(word.id)}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: pressed ? '#DDEDA9' : '#F3FACD',
              borderWidth: 1,
              borderColor: '#8DC63E',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Svg width={28} height={28} viewBox="0 0 24 24" aria-hidden>
              <Path d="M11 5 6 9H3v6h3l5 4Z" fill="#48762B" />
              <Path
                d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"
                fill="none"
                stroke="#48762B"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('✎  Let’s color')}: ${t(word.english)}`}
            onPress={() => onColor(word.id)}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: pressed ? '#FFE5A1' : '#FFF6D9',
              borderWidth: 1,
              borderColor: '#DBA844',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Text aria-hidden style={{ fontSize: 28 }}>
              🎨
            </Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => onPlay(word.id)}
        style={{ position: 'absolute', left: '14%', top: '16%' }}
      >
        <Picture word={word} size={width * 0.2} />
      </Pressable>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          left: '0%',
          bottom: 4 * scale,
          opacity: 0.75,
        }}
      >
        <JoinedWord
          word={word.arabic}
          width={width * 0.41}
          fontSize={word.arabic.length > 10 ? 65 * scale : 83 * scale}
          ghost
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => onPlay(word.id)}
        style={{ position: 'absolute', right: '5%', bottom: 0 }}
      >
        <JoinedWord
          word={word.arabic}
          width={width * 0.48}
          fontSize={word.arabic.length > 10 ? 73 * scale : 94 * scale}
        />
      </Pressable>
    </View>
  );
}
export function LessonBoard({
  group,
  words,
  width,
  onPlay,
  onColor,
}: {
  group: number;
  words: VocabularyWord[];
  width: number;
  onPlay: (id: string) => void;
  onColor: (id: string) => void;
}) {
  const { t, language } = useLanguage(),
    g = groups[group],
    scale = width / 887;
  return (
    <View
      style={{
        width,
        backgroundColor: '#EDF9B2',
        borderWidth: Math.max(4, 12 * scale),
        borderColor: '#BAC2B4',
      }}
    >
      <View
        style={{
          height: 158 * scale,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 23 * scale,
          }}
        >
          {[3, 2, 1].map((index) => (
            <View key={index} style={{ alignItems: 'center', gap: 19 * scale }}>
              <View
                style={{
                  backgroundColor: '#8DC63E',
                  width: 77 * scale,
                  height: 77 * scale,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 36 * scale,
                    color: '#F3FACD',
                    writingDirection: 'rtl',
                  }}
                >
                  {g.forms[index]}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'serif',
                  fontWeight: '700',
                  color: '#526735',
                  fontSize: Math.max(12, 17 * scale),
                }}
              >
                {t(['On its own', 'Beginning', 'Middle', 'Ending'][index])}
              </Text>
            </View>
          ))}
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          style={{
            maxWidth: width * 0.24,
            fontFamily: 'serif',
            fontWeight: '700',
            fontSize: (t(g.name).length > 5 ? 37 : 67) * scale,
            color: '#8CC63E',
            paddingTop: 20 * scale,
            marginRight: 22 * scale,
          }}
        >
          {language === 'sq' && g.letter === 'ب'
            ? 'be'
            : t(g.name).toLowerCase()}
        </Text>
        <View
          style={{
            width: 202 * scale,
            height: 134 * scale,
            backgroundColor: '#8DC63E',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            accessibilityLabel={t('On its own')}
            style={{
              fontSize: 85 * scale,
              color: '#F2F6D8',
              writingDirection: 'rtl',
            }}
          >
            {g.letter}
          </Text>
        </View>
      </View>
      {words.map((word) => (
        <WordRow
          key={word.id}
          word={word}
          width={width - 24 * scale}
          onPlay={onPlay}
          onColor={onColor}
        />
      ))}
      <View
        style={{
          height: 65 * scale,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 64 * scale,
            height: 64 * scale,
            borderRadius: 50,
            backgroundColor: '#8DC63E',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 22 * scale,
              color: '#F3FACD',
              fontFamily: 'serif',
            }}
          >
            {group + 1}
          </Text>
        </View>
      </View>
    </View>
  );
}
