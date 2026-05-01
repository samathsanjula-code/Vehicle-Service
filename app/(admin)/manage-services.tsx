import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { API } from '../../constants/api';

// --- MAIN COMPONENT ---
export default function ManageServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API.services);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      Alert.alert("Error", "Could not fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await fetch(`${API.services}/${id}`, { method: 'DELETE' });
              if (res.ok) {
                Alert.alert("Success", "Service deleted successfully");
                fetchServices();
              }
            } catch (e) {
              Alert.alert("Error", "Could not delete service");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backIconWrapper}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Manage Services</Text>
          <Text style={styles.headerSubtitle}>Edit or delete services</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* --- CONTENT SECTION --- */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {services.map((service) => (
            <View key={service._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={service.icon} size={28} color="#4F46E5" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceCategory}>{service.category}</Text>
                </View>
                <Text style={styles.servicePrice}>LKR {service.price}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.editBtn]} 
                  onPress={() => router.push(`/(admin)/edit-service?id=${service._id}`)}
                >
                  <Ionicons name="pencil" size={18} color="#4F46E5" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, styles.deleteBtn]} 
                  onPress={() => handleDelete(service._id, service.name)}
                >
                  <Ionicons name="trash" size={18} color="#EF4444" />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {services.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="construct-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIconWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  serviceCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  editBtnText: {
    color: '#4F46E5',
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
});
