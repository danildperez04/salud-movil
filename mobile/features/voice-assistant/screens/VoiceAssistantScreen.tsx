// features/voice-assistant/screens/VoiceAssistantScreen.tsx
import { router } from 'expo-router';
import { Map, ShieldCheck } from '@/lib/icons';
import { Pressable, ScrollView, View } from 'react-native';
import { ListItemCard } from '@/components/ui/list-item-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { SCREEN_TITLES, VOICE_ASSISTANT_LABELS } from '@/constants/labels';
import { VoiceOrb } from '../components/VoiceOrb';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const labels = VOICE_ASSISTANT_LABELS;

export default function VoiceAssistantScreen() {
  const { isListening, title, transcript, hasTranscript, toggleListening, chooseExample } =
    useVoiceAssistant();

  return (
    <View className="bg-background flex-1">
      <ScreenHeader title={SCREEN_TITLES.voiceAssistant} align="center" />

      <ScrollView contentContainerClassName="items-center gap-6 px-6 pt-2 pb-10">
        <VoiceOrb listening={isListening} onPress={toggleListening} />

        <View className="items-center gap-2">
          <Text className="text-h3 font-heading-semibold text-foreground text-center">{title}</Text>
          <Text className="text-small font-body text-muted-foreground text-center">
            {labels.description}
          </Text>
        </View>

        <View
          accessibilityLiveRegion="polite"
          className="border-primary/40 bg-primary/5 min-h-28 w-full gap-2 rounded-3xl border border-dashed p-5"
        >
          <Text className="text-caption font-body-semibold text-primary tracking-widest uppercase">
            {labels.transcriptLabel}
          </Text>
          <Text
            className={
              hasTranscript
                ? 'text-body font-body text-foreground'
                : 'text-body font-body text-muted-foreground'
            }
          >
            {transcript}
          </Text>
        </View>

        <View className="w-full flex-row flex-wrap gap-2">
          {labels.prompts.map((prompt) => (
            <Pressable
              key={prompt.label}
              onPress={() => chooseExample(prompt.text)}
              accessibilityRole="button"
              className="border-primary/30 bg-primary/5 rounded-full border px-4 py-2.5 active:opacity-70"
            >
              <Text className="text-caption font-body-semibold text-primary">{prompt.label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="w-full gap-3">
          <SectionHeader title={labels.actionsTitle} />
          <ListItemCard
            icon={ShieldCheck}
            title={labels.priorityAction.title}
            subtitle={labels.priorityAction.subtitle}
            onPress={() => router.push('/(app)/ipcp')}
          />
          <ListItemCard
            icon={Map}
            title={labels.careAction.title}
            subtitle={labels.careAction.subtitle}
            onPress={() => router.push('/(app)/health-map')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
