import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssignMechanics() {
  const router = useRouter();
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      const res = await fetch(BOOKINGS_URL, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter only pending bookings
        const pendingBookings = data.filter((b: any) => b.status === 'Pending');
        setBookings(pendingBookings);
      } else {
        Alert.alert('Error', 'Failed to load bookings');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (bookingId: string) => {
    Alert.alert('Assign Feature', 'This will open a modal fetching available mechanics to assign to Booking: ' + bookingId);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Bookings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {bookings.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 }}>No pending bookings found.</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingId}>Booking #{booking._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.customer}>{booking.customerId?.fullName || 'Unknown Customer'}</Text>
                </View>
                <View style={styles.iconBg}>
                  <Ionicons name="calendar" size={20} color="#dc2626" />
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.serviceText}>
                  {Array.isArray(booking.serviceType) ? booking.serviceType.join(', ') : booking.serviceType}
                </Text>
                <Text style={styles.dateText}>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionRow}>
                <Text style={styles.statusText}>Status: <Text style={{color: '#d97706'}}>{booking.status}</Text></Text>
                <TouchableOpacity style={styles.assignBtn} onPress={() => handleAssignClick(booking._id)}>
                  <Text style={styles.assignBtnText}>Assign Mechanic</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
