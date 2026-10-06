// features/onboarding/screens/WelcomeScreen.tsx
import { router } from 'expo-router';
import { ScrollView, useColorScheme, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WelcomeIllustration, WELCOME_ILLUSTRATION_SIZE } from '@/components/welcome-illustration';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LOGIN_LABELS, ONBOARDING_LABELS } from '@/constants/labels';
import { colors, fonts } from '@/lib/tokens';
import { useAppStore } from '@/store';

// Medidas tomadas del export de Figma (402pt de ancho, status bar de 59pt).
// Las posiciones verticales son relativas al safe area superior.
const DESIGN_WIDTH = 402;
const DESIGN_INSET_TOP = 59;
const ILLUSTRATION_TOP = 129;
const STAGE_BOTTOM = 648; // donde empieza "Bienvenido a SALUD MÓVIL"
const BOTTOM_GAP = 38; // espacio bajo el botón, además del safe area inferior

// Manchas de fondo (px del export @3x: 1206 de ancho).
const BLOB_TOP_LEFT =
  'M0,0 L836,0 L614,100 C611,103 600,113 596,120 C592,127 590,132 589,140 C588,148 588,158 588,170 C588,182 588,197 588,210 C588,223 588,237 586,250 C584,263 582,278 578,290 C574,302 568,312 562,320 C556,328 553,333 544,340 C535,347 519,355 509,360 C499,365 493,366 485,368 C477,370 470,371 462,371 C454,371 445,369 437,367 C429,365 428,364 414,360 C400,356 369,346 352,340 C335,334 325,327 314,322 C303,317 294,312 285,309 C276,306 270,306 262,306 C254,306 246,309 240,312 C234,315 232,317 224,322 C216,327 201,334 193,340 C185,346 181,353 176,360 C171,367 168,373 165,380 C162,387 160,393 159,400 C158,407 158,413 156,420 C154,427 152,433 149,440 C146,447 142,453 137,460 C132,467 128,473 122,480 C116,487 111,493 103,500 C95,507 87,513 74,520 C61,527 36,533 26,540 C16,547 17,553 14,560 C11,567 11,573 9,580 C7,587 6,595 4,600 C2,605 1,610 0,612 Z';
const BLOB_BOTTOM_RIGHT =
  'M1206,940 L1206,945 C1202,949 1190,961 1183,970 C1176,979 1169,990 1161,1000 C1153,1010 1144,1020 1134,1030 C1124,1040 1112,1050 1100,1060 C1088,1070 1075,1080 1062,1090 C1049,1100 1033,1110 1024,1120 C1015,1130 1012,1138 1006,1150 C1000,1162 993,1183 990,1190 L950,1300 L950,1840 L1000,1860 C1010,1862 1038,1865 1060,1872 C1082,1879 1107,1892 1131,1900 C1155,1908 1194,1918 1206,1922 Z';

const MINT_LIGHT = '#DFF1EB';
const MINT_DARK = 'rgba(45, 183, 154, 0.12)';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDark = useColorScheme() === 'dark';
  const markOnboardingSeen = useAppStore((state) => state.markOnboardingSeen);

  const scale = width / DESIGN_WIDTH;
  const mint = isDark ? MINT_DARK : MINT_LIGHT;
  // y de diseño -> y en pantalla (el diseño asume un safe area de 59pt)
  const y = (designY: number) => insets.top + (designY - DESIGN_INSET_TOP);
  const stageHeight = y(STAGE_BOTTOM);

  const handleContinue = () => {
    markOnboardingSeen();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="grow"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* ESCENARIO: manchas + marca + ilustración */}
      <View style={{ height: stageHeight }}>
        <Svg
          width={width}
          height={(650 / 1206) * width}
          viewBox="0 0 1206 650"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Path d={BLOB_TOP_LEFT} fill={mint} />
        </Svg>
        <Svg
          width={(266 / 3) * scale}
          height={(990 / 3) * scale}
          viewBox="940 940 266 990"
          style={{ position: 'absolute', right: 0, top: y(940 / 3) }}
        >
          <Path d={BLOB_BOTTOM_RIGHT} fill={mint} />
        </Svg>

        <View className="items-center" style={{ paddingTop: y(DESIGN_INSET_TOP) }}>
          <Text
            className="text-brand-blue dark:text-neutral-white text-center"
            style={{ fontFamily: fonts.heading, fontSize: 42.6, lineHeight: 64 }}
          >
            Salud{' '}
            <Text
              className="text-brand-green"
              style={{ fontFamily: fonts.heading, fontSize: 42.6, lineHeight: 64 }}
            >
              Móvil
            </Text>
          </Text>
          <Text
            className="text-secondary-green-light text-center"
            style={{
              fontFamily: fonts.headingSemibold,
              fontSize: 19.2,
              lineHeight: 28,
              marginTop: -5.8,
            }}
          >
            {LOGIN_LABELS.tagline}
          </Text>
        </View>

        <View style={{ position: 'absolute', alignSelf: 'center', top: y(ILLUSTRATION_TOP) }}>
          <WelcomeIllustration
            width={WELCOME_ILLUSTRATION_SIZE.width * scale}
            height={WELCOME_ILLUSTRATION_SIZE.height * scale}
          />
        </View>
      </View>

      <View className="flex-1" />

      {/* TEXTO + CTA */}
      <View
        className="items-center px-6"
        style={{ paddingBottom: insets.bottom + BOTTOM_GAP, minHeight: 154 + BOTTOM_GAP }}
      >
        <Text
          className="text-brand-blue dark:text-neutral-white text-center"
          style={{ fontFamily: fonts.heading, fontSize: 24, lineHeight: 36 }}
        >
          {ONBOARDING_LABELS.welcomePrefix} SALUD{' '}
          <Text
            className="text-brand-green"
            style={{ fontFamily: fonts.heading, fontSize: 24, lineHeight: 36 }}
          >
            MÓVIL
          </Text>
        </Text>

        <Text
          className="text-secondary-green-light mt-2 text-center"
          style={{
            fontFamily: fonts.headingSemibold,
            fontSize: 13,
            lineHeight: 20,
            maxWidth: 300,
          }}
        >
          {ONBOARDING_LABELS.description}
        </Text>

        <Button
          size="lg"
          onPress={handleContinue}
          className="mt-3.5 h-14 w-full max-w-[314px] rounded-2xl shadow-none"
          style={{ boxShadow: `0px 8px 24px ${colors.brandGreen}4D` }}
        >
          <Text
            className="text-white"
            style={{ fontFamily: fonts.heading, fontSize: 16, lineHeight: 24, fontWeight: '400' }}
          >
            {ONBOARDING_LABELS.cta}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}
