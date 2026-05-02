/**
 * MotoHub Color Tokens
 * Used across themed components for light/dark mode support.
 */

const tintColorLight = '#dc2626'; // red-600
const tintColorDark = '#ff4444';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardBackground: '#ffffff',
    sectionBackground: '#f3f4f6',
    border: '#e5e7eb',
    subtext: '#6b7280',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    cardBackground: '#1e2022',
    sectionBackground: '#1c1c1e',
    border: '#2c2c2e',
    subtext: '#9BA1A6',
  },
};
