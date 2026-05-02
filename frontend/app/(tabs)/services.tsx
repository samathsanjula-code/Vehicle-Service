import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// ─── Data ────────────────────────────────────────────────────────────────────

type ServiceItem = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  name: string;
  description: string;
  features: string[];
  accent: string;
  accentBg: string;
};

const services: ServiceItem[] = [
  {
    icon: 'build',
    name: 'Mechanical Repairs',
    description: 'Expert mechanical diagnostics and repairs for all makes and models',
    features: ['Engine diagnostics', 'Brake repair', 'Transmission service', 'Suspension work'],
    accent: '#2563eb',
    accentBg: '#eff6ff',
  },
  {
    icon: 'car',
    name: 'Collision Repairs',
    description: 'Professional bodywork and paint services',
    features: ['Dent removal', 'Paint matching', 'Frame straightening', 'Insurance claims'],
    accent: '#dc2626',
    accentBg: '#fef2f2',
  },
  {
    icon: 'water',
    name: 'Lubrication Services',
    description: 'Oil changes and fluid maintenance',
    features: ['Oil change', 'Filter replacement', 'Fluid top-ups', 'Lubrication points'],
    accent: '#d97706',
    accentBg: '#fffbeb',
  },
  {
    icon: 'sparkles',
    name: 'Vehicle Detailing',
    description: 'Complete interior and exterior cleaning',
    features: ['Exterior wash & wax', 'Interior vacuuming', 'Leather treatment', 'Engine cleaning'],
    accent: '#7c3aed',
    accentBg: '#f5f3ff',
  },
  {
    icon: 'resize',
    name: 'Wheel Alignment',
    description: 'Precision alignment for optimal performance',
    features: ['4-wheel alignment', 'Tire balancing', 'Steering adjustment', 'Suspension check'],
    accent: '#16a34a',
    accentBg: '#f0fdf4',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Our Services</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Professional automotive care for your vehicle
          </ThemedText>
        </ThemedView>

        {/* Service Cards */}
        {services.map((service) => (
          <View key={service.name} style={[styles.card, { borderLeftColor: service.accent }]}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: service.accentBg }]}>
                <Ionicons name={service.icon} size={24} color={service.accent} />
              </View>
              <View style={styles.cardHeadText}>
                <ThemedText type="defaultSemiBold" style={styles.cardName}>
                  {service.name}
                </ThemedText>
                <ThemedText style={styles.cardDescription}>{service.description}</ThemedText>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featureList}>
              {service.features.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="chevron-forward" size={14} color={service.accent} />
                  <ThemedText style={styles.featureText}>{feature}</ThemedText>
                </View>
              ))}
            </View>

            {/* Book Button */}
            <Pressable
              style={({ pressed }) => [
                styles.bookBtn,
                { backgroundColor: service.accent },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push('/appointments')}>
              <Text style={styles.bookBtnText}>Book Service</Text>
            </Pressable>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeadText: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
  featureList: {
    gap: 8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
  },
  bookBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 24,
  },
});
