// features/activity/domain/activity-catalogs.ts
import { ACTIVITY_INTENSITY_LABELS, ACTIVITY_TYPE_LABELS } from '@/constants/labels';
import { keysOf } from '@/lib/catalog';

export type ActivityType = keyof typeof ACTIVITY_TYPE_LABELS;
export type ActivityIntensity = keyof typeof ACTIVITY_INTENSITY_LABELS;

export const ACTIVITY_TYPES = keysOf(ACTIVITY_TYPE_LABELS);
export const ACTIVITY_INTENSITIES = keysOf(ACTIVITY_INTENSITY_LABELS);
