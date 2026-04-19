import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { DUMMY_SERVICES, CURRENT_CUSTOMER_ID, ServiceRecord } from '@/constants/service-data/dummyData';
import { ServiceCard } from '@/components/service-module/ServiceCard';
import { router } from 'expo-router';

export default function CustomerHistoryScreen() {
  const userServices = useMemo(() => {
    return DUMMY_SERVICES
      .filter((s) => s.customerId === CURRENT_CUSTOMER_ID)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const handlePressCard = (service: ServiceRecord) => {
    router.push({
      pathname: '/service-module/customer-detail',
      params: { id: service.id }
    });
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No service history available</Text>
      <Text style={styles.emptySubtitle}>Your future service visits will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard 
            service={item} 
            onPress={() => handlePressCard(item)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
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
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
