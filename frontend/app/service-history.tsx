import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from '@/constants/api';
import { useAuth } from '../context/AuthContext';
import { ThemedText } from '@/components/themed-text';

type Vehicle = {
  _id: string;
  customerDetails?: {
    fullName: string;
    contactNumber: string;
  };
  vehicleDetails: {
    brand: string;
    model: string;
    year?: string;
    regNumber: string;
  };
  serviceDetails?: {
    serviceType: string;
    preferredDate: string;
    preferredTimeSlot: string;
    issueDescription: string;
  };
  status?: string;
  image?: string;
  createdAt: string;
};

export default function ServiceHistoryScreen() {
  const [records, setRecords] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  const fetchRecords = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(API.vehicles, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [token]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remove Vehicle',
      'Are you sure you want to remove this vehicle from your fleet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API.vehicles}/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              if (response.ok) {
                setRecords(records.filter((r) => r._id !== id));
                Alert.alert('Success', 'Vehicle removed successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove vehicle');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Vehicle }) => {
    // Safety check for old records that might not have the nested structure
    const vDetails = item.vehicleDetails || (item as any);
    const cDetails = item.customerDetails || (item as any);
    const sDetails = item.serviceDetails || (item as any);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="car" size={24} color="#dc2626" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.serviceName}>{vDetails.brand || 'Unknown'} {vDetails.model || 'Vehicle'}</Text>
            <Text style={styles.vehicleName}>{vDetails.regNumber || 'No Reg'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statusText, { color: '#166534' }]}>{item.status || 'Healthy'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>Customer: {cDetails.fullName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="build-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>Service: {sDetails.serviceType || 'Not Scheduled'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>Date: {sDetails.preferredDate ? new Date(sDetails.preferredDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>Slot: {sDetails.preferredTimeSlot || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Pressable
            style={styles.editBtn}
            onPress={() => router.push({ pathname: '/add-vehicle', params: { editId: item._id } })}
          >
            <Ionicons name="pencil" size={18} color="#2563eb" />
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={18} color="#dc2626" />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Vehicle Fleet</Text>
        <Pressable 
          onPress={() => router.push('/add-vehicle')}
          style={styles.addIconBtn}>
          <Ionicons name="add-circle" size={28} color="#dc2626" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#dc2626" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="car-sport-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No Vehicles Found</Text>
              <Text style={styles.emptySubtitle}>You haven't registered any vehicles in your fleet yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#111',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleName: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4b5563',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
