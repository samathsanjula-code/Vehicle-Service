import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ModalScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo / Brand */}
        <View style={styles.brand}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>M</Text>
          </View>
          <ThemedText type="title" style={styles.brandName}>
            MOTOHUB
          </ThemedText>
          <ThemedText style={styles.brandTagline}>
            Sri Lanka's #1 Car Service Chain
          </ThemedText>
        </View>

        {/* Info Cards */}
        <View style={styles.cardsRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardEmoji}>🏆</Text>
            <ThemedText type="defaultSemiBold" style={styles.infoCardValue}>
              15+
            </ThemedText>
            <ThemedText style={styles.infoCardLabel}>Years in Business</ThemedText>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardEmoji}>🛠️</Text>
            <ThemedText type="defaultSemiBold" style={styles.infoCardValue}>
              50k+
            </ThemedText>
            <ThemedText style={styles.infoCardLabel}>Cars Serviced</ThemedText>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardEmoji}>⭐</Text>
            <ThemedText type="defaultSemiBold" style={styles.infoCardValue}>
              4.9
            </ThemedText>
            <ThemedText style={styles.infoCardLabel}>Customer Rating</ThemedText>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            About Us
          </ThemedText>
          <ThemedText style={styles.sectionBody}>
            MotoHub is Sri Lanka's leading automotive service chain, providing world-class
            vehicle maintenance, repairs, and detailing services across the island. Our
            expert technicians use cutting-edge diagnostics to keep your vehicle at peak
            performance.
          </ThemedText>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Contact
          </ThemedText>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('tel:0755004004')}>
            <Text style={styles.contactEmoji}>📞</Text>
            <ThemedText style={styles.contactText}>0755 004 004</ThemedText>
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <Text style={styles.contactEmoji}>📍</Text>
            <ThemedText style={styles.contactText}>
              MotoHub Service Center, Colombo, Sri Lanka
            </ThemedText>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactEmoji}>🕐</Text>
            <ThemedText style={styles.contactText}>Mon – Sat: 8:00 AM – 6:00 PM</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandBadgeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  brandName: {
    color: '#dc2626',
    letterSpacing: 4,
    marginBottom: 4,
  },
  brandTagline: {
    color: '#6b7280',
    fontSize: 14,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  infoCardEmoji: {
    fontSize: 24,
  },
  infoCardValue: {
    fontSize: 18,
    color: '#dc2626',
  },
  infoCardLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    color: '#111827',
  },
  sectionBody: {
    color: '#4b5563',
    lineHeight: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  contactEmoji: {
    fontSize: 18,
    marginTop: 2,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 16,
  },
});
