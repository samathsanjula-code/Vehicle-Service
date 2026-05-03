import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../context/AuthContext';

import { BillImageModal } from '../components/BillImageModal';

// ─── Data Types ──────────────────────────────────────────────────────────────

type ServiceItem = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  name: string;
  description: string;
  features: string[];
  accent: string;
  accentBg: string;
};

type HistoryRecord = {
  _id: string;
  vehicleNumber: string;
  serviceType: string;
  serviceDate: string;
  cost: number;
  mileage: number;
  billImage?: string;
  status: string;
  description?: string;
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
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      setLoading(false);
      setHistory([]);
    }
  }, [token]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/services/my-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const approvedOnly = response.data.filter((item: any) => item.status === 'Approved');
      setHistory(approvedOnly);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const groupedHistory = history.reduce((acc: { [key: string]: HistoryRecord[] }, item) => {
    const vehicle = item.vehicleNumber;
    if (!acc[vehicle]) {
      acc[vehicle] = [];
    }
    acc[vehicle].push(item);
    return acc;
  }, {});

  const openImage = (url: string | undefined) => {
    if (!url) return;
    setSelectedImage(`${BASE_URL}${url}`);
    setModalVisible(true);
  };

  const handleLongPress = (item: HistoryRecord) => {
    Alert.alert(
      "Manage Record",
      `Vehicle: ${item.vehicleNumber}\nService: ${item.serviceType}`,
      [
        {
          text: "Edit Record",
          onPress: () => {
            router.push({
              pathname: '/add-service' as any,
              params: {
                id: item._id,
                vehicleNumber: item.vehicleNumber,
                serviceType: item.serviceType,
                mileage: item.mileage.toString(),
                cost: item.cost.toString(),
                description: item.description || '',
                billImage: item.billImage || ''
              }
            });
          }
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(item._id)
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const confirmDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this record permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/services/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchHistory();
          } catch (err) {
            Alert.alert("Error", "Could not delete record");
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BillImageModal
        visible={modalVisible}
        imageUrl={selectedImage}
        onClose={() => setModalVisible(false)}
      />

      <View style={styles.navHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <ThemedText style={styles.headerTitleText}>Services</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerSubtitle}>
            Professional automotive care for your vehicle
          </ThemedText>
        </ThemedView>

        {services.map((service) => (
          <View key={service.name} style={[styles.card, { borderLeftColor: service.accent }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: service.accentBg }]}>
                <Ionicons name={service.icon} size={24} color={service.accent} />
              </View>
              <View style={styles.cardHeadText}>
                <ThemedText type="defaultSemiBold" style={styles.cardName}>{service.name}</ThemedText>
                <ThemedText style={styles.cardDescription}>{service.description}</ThemedText>
              </View>
            </View>

            <View style={styles.featureList}>
              {service.features.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="chevron-forward" size={14} color={service.accent} />
                  <ThemedText style={styles.featureText}>{feature}</ThemedText>
                </View>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.bookBtn,
                { backgroundColor: service.accent },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => {
                if (!token) {
                  Alert.alert(
                    "Login Required",
                    "Please login to add a service record.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Login", onPress: () => router.push('/(auth)/login') }
                    ]
                  );
                } else {
                  router.push('/add-service');
                }
              }}>
              <Text style={styles.bookBtnText}>Add Service Record</Text>
            </Pressable>
          </View>
        ))}

        {/* ─── Service History Section ─── */}
        <ThemedView style={styles.historySection}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="subtitle" style={styles.historyTitle}>My Service History</ThemedText>
            <Pressable onPress={fetchHistory} disabled={!token}>
              <Ionicons name="refresh" size={20} color={token ? "#dc2626" : "#ccc"} />
            </Pressable>
          </View>

          {!token ? (
            <View style={styles.loginPrompt}>
              <View style={styles.lockIconCircle}>
                <Ionicons name="lock-closed" size={32} color="#dc2626" />
              </View>
              <Text style={styles.loginPromptTitle}>Sign in Required</Text>
              <Text style={styles.loginPromptSub}>Please login to view and manage your service history.</Text>
              <Pressable onPress={() => router.push('/(auth)/login')} style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>Login Now</Text>
              </Pressable>
            </View>
          ) : loading ? (
            <ActivityIndicator color="#dc2626" style={{ marginTop: 20 }} />
          ) : Object.keys(groupedHistory).length > 0 ? (
          
            Object.keys(groupedHistory).map((vehicleNumber) => (
              <View key={vehicleNumber} style={styles.vehicleGroup}>
                <View style={styles.vehicleBadge}>
                  <Ionicons name="car-sport" size={16} color="#dc2626" />
                  <Text style={styles.vehicleBadgeText}>{vehicleNumber}</Text>
                </View>

                {groupedHistory[vehicleNumber].map((item) => (
                  <Pressable
                    key={item._id}
                    onLongPress={() => handleLongPress(item)}
                    delayLongPress={500}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View style={styles.historyCard}>
                      <View style={styles.historyIconBox}>
                        <Ionicons name="document-text" size={20} color="#dc2626" />
                      </View>
                      <View style={styles.historyInfo}>
                        <ThemedText type="defaultSemiBold" style={styles.historyServiceName}>{item.serviceType}</ThemedText>
                        <Text style={styles.historySubText}>
                          {new Date(item.serviceDate).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.historyPriceBox}>
                        <Text style={styles.historyPrice}>Rs. {item.cost.toLocaleString()}</Text>
                        {item.billImage && (
                          <Pressable onPress={() => openImage(item.billImage)} style={{ marginTop: 4 }}>
                            <Ionicons name="image-outline" size={22} color="#dc2626" />
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No service history found.</Text>
            </View>
          )}
        </ThemedView>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  vehicleGroup: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  vehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    marginLeft: 5,
    gap: 6,
  },
  vehicleBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 0.5,
  },

  backBtn: { padding: 5, marginRight: 15 },
  headerTitleText: { fontSize: 22, fontWeight: '800', color: '#111827' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  header: { paddingHorizontal: 8, paddingVertical: 20, backgroundColor: 'transparent' },
  headerSubtitle: { color: '#6b7280' },
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
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardHeadText: { flex: 1 },
  cardName: { fontSize: 17, color: '#111827', marginBottom: 4 },
  cardDescription: { color: '#6b7280', fontSize: 13, lineHeight: 18 },
  featureList: { gap: 8, marginBottom: 16, paddingLeft: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 13, color: '#374151' },
  bookBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  historySection: { marginTop: 10, paddingHorizontal: 8, backgroundColor: 'transparent' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontSize: 20, color: '#111827', fontWeight: 'bold' },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  historyIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  historyInfo: { flex: 1 },
  historyServiceName: { fontSize: 15, color: '#111827' },
  historySubText: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  historyPriceBox: { alignItems: 'flex-end' },
  historyPrice: { fontSize: 15, fontWeight: '700', color: '#dc2626' },
  historyMileage: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 10, fontStyle: 'italic' },

  // Login Prompt Styles
  loginPrompt: {
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  loginPromptTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  loginPromptSub: { textAlign: 'center', color: '#6b7280', marginBottom: 20, lineHeight: 20 },
  loginBtn: { backgroundColor: '#dc2626', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  bottomSpacer: { height: 40 },
});