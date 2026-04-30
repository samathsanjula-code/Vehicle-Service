import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AppointmentCardProps {
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  onViewDetails: () => void;
  onReschedule: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return { bg: '#e6f4ea', text: '#1e8e3e' };
    case 'Pending': return { bg: '#fef7e0', text: '#f9ab00' };
    case 'Completed': return { bg: '#e8f0fe', text: '#1a73e8' };
    case 'Cancelled': return { bg: '#fce8e6', text: '#d93025' };
    default: return { bg: '#f1f3f4', text: '#5f6368' };
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  serviceType,
  scheduledDate,
  scheduledTime,
  status,
  onViewDetails,
  onReschedule,
}) => {
  const statusColor = getStatusColor(status);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceTitle}>{serviceType}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.badgeText, { color: statusColor.text }]}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>📅 {new Date(scheduledDate).toLocaleDateString()}</Text>
        <Text style={styles.detailText}>⏰ {scheduledTime}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onViewDetails}>
          <Text style={styles.btnPrimaryText}>View Details</Text>
        </TouchableOpacity>
        
        {status === 'Pending' || status === 'Confirmed' ? (
          <TouchableOpacity style={styles.btnOutline} onPress={onReschedule}>
            <Text style={styles.btnOutlineText}>Reschedule</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d0d0f',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#0d0d0f',
    fontWeight: '600',
    fontSize: 14,
  },
});
