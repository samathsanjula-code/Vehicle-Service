import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// ─── Data ────────────────────────────────────────────────────────────────────

type Vehicle = {
  _id: string;
  vehicleDetails?: {
    brand?: string;
    model?: string;
    year?: string;
    regNumber?: string;
    fuelType?: string;
    mileage?: string;
  };
  image?: string;
  status?: string;
};



// ─── Component ───────────────────────────────────────────────────────────────

import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useState, useCallback } from 'react';
import { API } from '@/constants/api';
import { ActivityIndicator } from 'react-native';

export default function ProfileScreen() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(API.vehicles, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleAddCar = () => {
    router.push('/add-vehicle');
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="lock-closed" size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <ThemedText type="subtitle" style={{ marginBottom: 8, color: '#1f2937' }}>Authentication Required</ThemedText>
        <ThemedText style={{ marginBottom: 24, color: '#6b7280' }}>Please log in to view your profile.</ThemedText>
        <Pressable
          style={({ pressed }) => [styles.addCarBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.addCarBtnText}>Log In Now</Text>
        </Pressable>
      </SafeAreaView>
    );
  }



  return (
    <View style={styles.container}>
      {/* ── Custom Header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable style={styles.menuBtn}>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>MOTOHUB</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* ── Stats Row ─────────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#fff1f2' }]}>
              <Ionicons name="time" size={18} color="#dc2626" />
            </View>
            <Text style={styles.statLabel}>MY RECORDS</Text>
            <Text style={styles.statValue}>{vehicles.length} RECORD</Text>
            <Pressable onPress={() => router.push('/service-history')}>
              <Text style={styles.statLink}>View All  <Ionicons name="chevron-forward" size={10} /></Text>
            </Pressable>
          </View>
        </View>

        {/* ── My Vehicles Section ────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Vehicles</Text>
              
              <Text style={styles.sectionSubtitle}>Registered for precision service</Text>
            </View>
            <Pressable style={styles.addCarBtn} onPress={handleAddCar}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addCarBtnText}>Add Vehicles</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator color="#dc2626" style={{ marginVertical: 20 }} />
          ) : vehicles.length === 0 ? (
            <View style={styles.emptyVehicles}>
              <Text style={styles.emptyText}>No vehicles registered yet.</Text>
            </View>
          ) : (
            vehicles.map(vehicle => (
              <View key={vehicle._id} style={styles.vehicleCard}>
                <Image 
                  source={{ uri: vehicle.image}} 
                  style={styles.vehicleImg}
                  contentFit="cover"
                />
                <View style={styles.vehicleDetails}>
                  <View style={styles.vehicleHeaderRow}>
                    <Text style={styles.vehicleName}>
                      {vehicle.vehicleDetails?.brand} {vehicle.vehicleDetails?.model}
                    </Text>
                    <Ionicons name="ellipsis-vertical" size={18} color="#9ca3af" />
                  </View>
                  <Text style={styles.vehicleSubText}>
                    {vehicle.vehicleDetails?.regNumber || 'No Plate'} • {vehicle.vehicleDetails?.year || ''}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                       <Ionicons name="water-outline" size={14} color="#6b7280" />
                       <Text style={{ fontSize: 12, color: '#6b7280', textTransform: 'capitalize' }}>
                         {vehicle.vehicleDetails?.fuelType || 'N/A'}
                       </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                       <Ionicons name="speedometer-outline" size={14} color="#6b7280" />
                       <Text style={{ fontSize: 12, color: '#6b7280' }}>
                         {vehicle.vehicleDetails?.mileage ? `${vehicle.vehicleDetails.mileage} km` : 'N/A'}
                       </Text>
                    </View>
                  </View>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                    <Text style={[styles.statusText, { color: '#10b981' }]}>{vehicle.status || 'HEALTHY'}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>



        {/* ── Bottom Buttons ────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <Pressable onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  statLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  addCarBtn: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addCarBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  vehicleImg: {
    width: 100,
    height: 90,
    borderRadius: 18,
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleSubText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  viewAllLink: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  serviceVehicle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  completedBadgeText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 15,
  },
  addCarBtnTextReversed: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyVehicles: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
});
