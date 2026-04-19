import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ServiceRecord } from '@/constants/service-data/dummyData';
import { Ionicons } from '@expo/vector-icons';

interface DetailCardProps {
  service: ServiceRecord;
}

export const DetailCard: React.FC<DetailCardProps> = ({ service }) => {
  const isCompleted = service.status === 'Completed';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.serviceType}>{service.serviceType}</Text>
          <Text style={styles.dateText}>
            {new Date(service.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <Text style={[styles.statusTag, isCompleted ? styles.statusCompleted : styles.statusPending]}>
          {service.status}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.sectionText}>{service.notes || 'No notes available.'}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Ionicons name="person-outline" size={18} color="#666" style={styles.icon} />
          <View>
            <Text style={styles.label}>Mechanic</Text>
            <Text style={styles.value}>{service.mechanicName || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.gridItem}>
          <Ionicons name="calendar-outline" size={18} color="#666" style={styles.icon} />
          <View>
            <Text style={styles.label}>Next Service</Text>
            <Text style={styles.value}>
              {service.nextServiceDate 
                ? new Date(service.nextServiceDate).toLocaleDateString() 
                : 'Not scheduled'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parts Used</Text>
        {service.partsUsed && service.partsUsed.length > 0 ? (
          service.partsUsed.map((part, index) => (
            <View key={index} style={styles.partItem}>
              <View style={styles.bullet} />
              <Text style={styles.partText}>{part}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionText}>No parts recorded.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  serviceType: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  statusTag: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A1A1A',
    marginRight: 12,
  },
  partText: {
    fontSize: 15,
    color: '#444',
  },
});
