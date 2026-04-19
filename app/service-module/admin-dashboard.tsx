import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { DUMMY_SERVICES, ServiceRecord } from '@/constants/service-data/dummyData';
import { ServiceCard } from '@/components/service-module/ServiceCard';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen() {
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      // Reload on focus in case of updates
      const sorted = [...DUMMY_SERVICES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setServices(sorted);
    }, [])
  );

  const handlePressCard = (service: ServiceRecord) => {
    router.push({
      pathname: '/service-module/admin-update',
      params: { id: service.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Records</Text>
        <TouchableOpacity 
          style={styles.analyticsButton}
          onPress={() => router.push('/service-module/admin-analytics')}
        >
          <Ionicons name="bar-chart" size={20} color="#fff" />
          <Text style={styles.analyticsButtonText}>Analytics</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard 
            service={item} 
            onPress={() => handlePressCard(item)} 
            isAdmin={true}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  analyticsButton: {
    backgroundColor: '#1A73E8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  analyticsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
});
