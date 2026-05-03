import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { BillImageModal } from '../../components/BillImageModal';

interface ServiceRecord {
  _id: string;
  vehicleNumber: string;
  serviceType: string;
  cost: number;
  status: string;
  billImage: string;
  userId: {
    fullName: string;
    email: string;
  };
}

export default function ManageApprovals() {
  const router = useRouter();
  const { token } = useAuth();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRecords();
  }, []);

  const fetchPendingRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/services/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pending = res.data.filter((r: ServiceRecord) => r.status === 'Pending');
      setRecords(pending);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await axios.patch(`${BASE_URL}/api/services/admin/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", `Record ${status} successfully!`);
      fetchPendingRecords(); // List එක refresh කරන්න
    } catch (e) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const openImage = (url: string) => {
    setSelectedImage(`${BASE_URL}${url}`);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: ServiceRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.userName}>{item.userId?.fullName || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{item.userId?.email}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Vehicle:</Text>
        <Text style={styles.infoValue}>{item.vehicleNumber}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Service:</Text>
        <Text style={styles.infoValue}>{item.serviceType}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Cost:</Text>
        <Text style={styles.costValue}>Rs. {item.cost.toLocaleString()}</Text>
      </View>

      {item.billImage && (
        <Pressable onPress={() => openImage(item.billImage)}>
          <Image
            source={{ uri: `${BASE_URL}${item.billImage}` }}
            style={styles.billPreview}
          />
        </Pressable>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rejectBtn]}
          onPress={() => updateStatus(item._id, 'Rejected')}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.approveBtn]}
          onPress={() => updateStatus(item._id, 'Approved')}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Service Approvals</Text>
      </View>

      <BillImageModal 
        visible={modalVisible} 
        imageUrl={selectedImage} 
        onClose={() => setModalVisible(false)} 
      />

      {loading ? (
        <ActivityIndicator size="large" color="#dc2626" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cafe-outline" size={60} color="#9ca3af" />
              <Text style={styles.emptyText}>All caught up! No pending records.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 10 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  userEmail: { fontSize: 12, color: '#6b7280' },
  statusBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#d97706' },
  infoRow: { flexDirection: 'row', marginBottom: 5 },
  infoLabel: { width: 80, fontSize: 14, color: '#6b7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#374151' },
  costValue: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
  billPreview: { width: '100%', height: 150, borderRadius: 10, marginTop: 10, backgroundColor: '#f3f4f6' },
  buttonGroup: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1, flexDirection: 'row', height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 5 },
  approveBtn: { backgroundColor: '#16a34a' },
  rejectBtn: { backgroundColor: '#dc2626' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#9ca3af', marginTop: 10, fontSize: 16 }
});