import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock Appointments
const mockBookings = [
  { id: "B001", customer: "John Silva", service: "Engine Repair", date: "2026-04-08", status: "Pending" },
  { id: "B002", customer: "Mary Fernando", service: "Oil Change", date: "2026-04-08", status: "Pending" },
  { id: "B003", customer: "David Perera", service: "Brake Service", date: "2026-04-09", status: "Pending" },
];

export default function AssignMechanics() {
  const router = useRouter();

  const handleAssignClick = (bookingId: string) => {
    Alert.alert('Assign Feature', 'This will open a modal fetching available mechanics to assign to Booking: ' + bookingId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Bookings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {mockBookings.map((booking) => (
          <View key={booking.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.bookingId}>Booking #{booking.id}</Text>
                <Text style={styles.customer}>{booking.customer}</Text>
              </View>
              <View style={styles.iconBg}>
                <Ionicons name="calendar" size={20} color="#dc2626" />
              </View>
            </View>

            <View style={styles.detailsRow}>
              <Text style={styles.serviceText}>{booking.service}</Text>
              <Text style={styles.dateText}>{booking.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionRow}>
              <Text style={styles.statusText}>Status: <Text style={{color: '#d97706'}}>{booking.status}</Text></Text>
              <TouchableOpacity style={styles.assignBtn} onPress={() => handleAssignClick(booking.id)}>
                <Text style={styles.assignBtnText}>Assign Mechanic</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  customer: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
  },
  assignBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
