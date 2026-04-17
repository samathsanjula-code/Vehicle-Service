import { Image } from 'expo-image';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { vehicleImages } from '@/assets/images';

// ─── Data ────────────────────────────────────────────────────────────────────

type Vehicle = {
  id: number;
  name: string;
  plate: string;
  image: ReturnType<typeof require>;
  status: string;
  statusColor: string;
  statusDot: string;
  healthy: boolean;
};

type ServiceRecord = {
  id: number;
  service: string;
  date: string;
  vehicle: string;
  cost: string;
  status: string;
};

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: 'BMW 5 Series',
    plate: 'WP CAR-8672 • 2019',
    image: vehicleImages.bmw,
    status: 'HEALTHY',
    statusColor: '#16a34a',
    statusDot: '#22c55e',
    healthy: true,
  },
  {
    id: 2,
    name: 'Porsche 911',
    plate: 'WP CAR-9110 • 2021',
    image: vehicleImages.porsche,
    status: 'SERVICE DUE: 5 DAYS',
    statusColor: '#dc2626',
    statusDot: '#ef4444',
    healthy: false,
  },
];

const serviceHistory: ServiceRecord[] = [
  {
    id: 1,
    service: 'Full Engine Service',
    date: 'March 15, 2026',
    vehicle: 'BMW 5 Series',
    cost: 'LKR 45,000',
    status: 'Completed',
  },
  {
    id: 2,
    service: 'Oil Change & Filter',
    date: 'February 20, 2026',
    vehicle: 'Porsche 911',
    cost: 'LKR 18,500',
    status: 'Completed',
  },
  {
    id: 3,
    service: 'Brake Pad Replacement',
    date: 'January 10, 2026',
    vehicle: 'BMW 5 Series',
    cost: 'LKR 32,000',
    status: 'Completed',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const handleAddCar = () => {
    Alert.alert('Add Vehicle', 'This feature is coming soon!');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>KP</Text>
            </View>
            <Pressable style={styles.editAvatarBtn} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </Pressable>
          </View>
          <ThemedText type="subtitle" style={styles.profileName}>Kavindu Perera</ThemedText>
          <ThemedText style={styles.profileMeta}>PREMIUM MEMBER SINCE 2021</ThemedText>
        </View>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="time" size={20} color="#dc2626" />
            </View>
            <ThemedText style={styles.statLabel}>Service History</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>12 Records</ThemedText>
            <Pressable>
              <Text style={styles.statLink}>View All →</Text>
            </Pressable>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="star" size={20} color="#2563eb" />
            </View>
            <ThemedText style={styles.statLabel}>Loyalty Points</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>2,450 pts</ThemedText>
            <Text style={[styles.statLink, { color: '#2563eb' }]}>Gold Tier</Text>
          </View>
        </View>

        {/* ── My Vehicles ────────────────────────────────────────────────── */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>My Vehicles</ThemedText>
            <Pressable
              style={({ pressed }) => [styles.addCarBtn, pressed && { opacity: 0.85 }]}
              onPress={handleAddCar}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addCarBtnText}>Add Car</Text>
            </Pressable>
          </View>
          <ThemedText style={styles.sectionSubtitle}>Registered for precision service</ThemedText>

          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              <Image
                source={vehicle.image}
                style={styles.vehicleImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.vehicleInfo}>
                <View style={styles.vehicleTopRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold" style={styles.vehicleName}>
                      {vehicle.name}
                    </ThemedText>
                    <ThemedText style={styles.vehiclePlate}>{vehicle.plate}</ThemedText>
                  </View>
                  <Pressable onPress={() => Alert.alert('Options', `Manage ${vehicle.name}`)}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#9ca3af" />
                  </Pressable>
                </View>
                <View style={styles.vehicleStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: vehicle.statusDot }]} />
                  <Text style={[styles.vehicleStatus, { color: vehicle.statusColor }]}>
                    {vehicle.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ThemedView>

        {/* ── Recent Services ────────────────────────────────────────────── */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Services</ThemedText>
            <Pressable>
              <Text style={styles.statLink}>View All</Text>
            </Pressable>
          </View>

          {serviceHistory.map((record) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.historyName}>
                  {record.service}
                </ThemedText>
                <ThemedText style={styles.historyVehicle}>{record.vehicle}</ThemedText>
                <View style={styles.historyDateRow}>
                  <Ionicons name="time-outline" size={12} color="#9ca3af" />
                  <ThemedText style={styles.historyDate}>{record.date}</ThemedText>
                </View>
              </View>
              <View style={styles.historyRight}>
                <ThemedText type="defaultSemiBold" style={styles.historyCost}>
                  {record.cost}
                </ThemedText>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>{record.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </ThemedView>

        {/* ── Loyalty Card ───────────────────────────────────────────────── */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <View style={styles.loyaltyIconBg}>
              <Ionicons name="trophy" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.loyaltyTitle}>Gold Tier Member</Text>
              <Text style={styles.loyaltySubtitle}>Exclusive benefits & rewards</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Points Progress</Text>
              <Text style={styles.progressValue}>2,450 / 5,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '49%' }]} />
            </View>
            <Text style={styles.progressNote}>550 points to Platinum tier</Text>
          </View>
        </View>

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

  // Profile header
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#dc2626',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    color: '#111827',
    fontSize: 22,
    marginBottom: 4,
  },
  profileMeta: {
    color: '#9ca3af',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    color: '#111827',
  },
  statLink: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#111827',
  },
  sectionSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: -8,
  },
  addCarBtn: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addCarBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Vehicle cards
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleImage: {
    width: 100,
    height: 96,
  },
  vehicleInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  vehicleName: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  vehicleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vehicleStatus: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Service history
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyName: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  historyVehicle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  historyCost: {
    fontSize: 13,
    color: '#111827',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  completedBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '700',
  },

  // Loyalty card
  loyaltyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 22,
    gap: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  loyaltyIconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loyaltyTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  loyaltySubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 13,
  },
  progressValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  bottomSpacer: {
    height: 24,
  },
});
