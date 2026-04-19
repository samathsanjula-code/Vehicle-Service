import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DUMMY_SERVICES } from '@/constants/service-data/dummyData';
import { DetailCard } from '@/components/service-module/DetailCard';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const service = useMemo(() => {
    return DUMMY_SERVICES.find(s => s.id === id);
  }, [id]);

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service record not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <DetailCard service={service} />
      
      <View style={styles.supportWarning}>
        <Text style={styles.supportText}>
          If you have questions about this service, please contact your mechanic or the service center.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  supportWarning: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
  },
  supportText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});
