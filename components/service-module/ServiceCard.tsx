import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ServiceRecord } from '@/constants/service-data/dummyData';
import { Ionicons } from '@expo/vector-icons';

interface ServiceCardProps {
  service: ServiceRecord;
  onPress: () => void;
  isAdmin?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress, isAdmin = false }) => {
  const isCompleted = service.status === 'Completed';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons 
            name={service.serviceType.toLowerCase().includes('oil') ? 'water-outline' : 'settings-outline'} 
            size={20} 
            color="#333" 
          />
          <Text style={styles.serviceType}>{service.serviceType}</Text>
        </View>
        <Text style={[styles.statusTag, isCompleted ? styles.statusCompleted : styles.statusPending]}>
          {service.status}
        </Text>
      </View>

      {isAdmin && (
        <View style={styles.adminInfo}>
          <Text style={styles.customerName}>{service.customerName}</Text>
          <Text style={styles.vehicleInfo}>{service.vehicle}</Text>
        </View>
      )}

      <Text style={styles.dateText}>{new Date(service.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</Text>
      
      <Text style={styles.notePreview} numberOfLines={2}>
        {service.notes || 'No notes provided.'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusTag: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusCompleted: {
    backgroundColor: '#E6F4EA',
    color: '#137333',
  },
  statusPending: {
    backgroundColor: '#FEF7E0',
    color: '#B06000',
  },
  adminInfo: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    fontWeight: '500',
  },
  notePreview: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
