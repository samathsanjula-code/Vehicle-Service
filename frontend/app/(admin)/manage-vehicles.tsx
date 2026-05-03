import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../constants/api';

export default function ManageVehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllVehicles = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        router.replace('/(auth)/login');
        return;
      }

      const res = await fetch(API.adminAllVehicles, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Admin fleet data fetched:", data.length, "vehicles found.");
        setVehicles(data);
      } else {
        const err = await res.json();
        console.error("❌ Admin fleet fetch failed:", err);
        Alert.alert("Error", err.message || "Could not fetch vehicles");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Network error while fetching vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllVehicles();
    }, [])
  );

  const handleDelete = (id: string, regNo: string) => {
    Alert.alert(
      "Delete Vehicle",
      `Are you sure you want to remove vehicle ${regNo}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`${API.vehicles}/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                Alert.alert("Success", "Vehicle removed successfully");
                fetchAllVehicles();
              }
            } catch (e) {
              Alert.alert("Error", "Could not delete vehicle");
            }
          } 
        }
      ]
    );
  };

  const handleCall = (phone: string) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backIconWrapper}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Manage Fleet</Text>
          <Text style={styles.headerSubtitle}>All registered vehicles</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* --- CONTENT --- */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {vehicles.map((v) => (
            <View key={v._id} style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.vehicleImageWrapper}>
                  {v.image ? (
                    <Image source={{ uri: v.image }} style={styles.vehicleImage} contentFit="cover" />
                  ) : (
                    <View style={styles.placeholderIcon}>
                      <Ionicons name="car" size={32} color="#dc2626" />
                    </View>
                  )}
                </View>
                
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{v.vehicleDetails.brand} {v.vehicleDetails.model}</Text>
                  <View style={styles.regBadge}>
                    <Text style={styles.regText}>{v.vehicleDetails.regNumber}</Text>
                  </View>
                  <Text style={styles.categoryText}>{v.vehicleDetails.category}</Text>
                </View>
              </View>

              {/* Owner Details */}
              <View style={styles.ownerSection}>
                <View style={styles.ownerHeader}>
                  <Ionicons name="person" size={14} color="#6B7280" />
                  <Text style={styles.ownerLabel}>Registered Owner</Text>
                </View>
                <View style={styles.ownerContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ownerName}>{v.owner?.fullName || "Unknown"}</Text>
                    <Text style={styles.ownerEmail}>{v.owner?.email || "No email"}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.callBtn} 
                    onPress={() => handleCall(v.owner?.phone)}>
                    <Ionicons name="call" size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.editBtn]} 
                  onPress={() => router.push({ pathname: '/add-vehicle', params: { editId: v._id } })}
                >
                  <Ionicons name="create-outline" size={18} color="#2563eb" />
                  <Text style={styles.editBtnText}>Edit Vehicle</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, styles.deleteBtn]} 
                  onPress={() => handleDelete(v._id, v.vehicleDetails.regNumber)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={styles.deleteBtnText}>Remove Vehicle</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {vehicles.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No vehicles registered yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: { width: 44, height: 44, justifyContent: 'center' },
  backIconWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardMain: { flexDirection: 'row', marginBottom: 16 },
  vehicleImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  vehicleImage: { width: '100%', height: '100%' },
  placeholderIcon: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2' },
  vehicleInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  vehicleName: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  regBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  regText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  categoryText: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  ownerSection: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 16,
  },
  ownerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  ownerLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  ownerContent: { flexDirection: 'row', alignItems: 'center' },
  ownerName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  ownerEmail: { fontSize: 12, color: '#64748B' },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEF2F2',
  },

  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  deleteBtn: { backgroundColor: '#FEF2F2' },
  deleteBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  editBtn: { backgroundColor: '#EFF6FF', marginBottom: 8 },
  editBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 14, marginLeft: 8 },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#94A3B8', marginTop: 16, fontSize: 16, fontWeight: '600' },
});
