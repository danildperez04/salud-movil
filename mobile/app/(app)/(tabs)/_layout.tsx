// app/(app)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Calendar, Home, MoreHorizontal, Pill } from 'lucide-react-native';
import { TAB_LABELS } from '@/constants/labels';

const ACTIVE_COLOR = '#2DB79A'; // --color-primary
const INACTIVE_COLOR = '#6B7280'; // --color-muted-foreground

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_LABELS.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: TAB_LABELS.appointments,
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: TAB_LABELS.medications,
          tabBarIcon: ({ color, size }) => <Pill color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: TAB_LABELS.more,
          tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
