import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBookings, Booking } from '../../hooks/useBookings';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { fetchBookingById, deleteBooking, loading } = useBookings();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    try {
      const data = await fetchBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load booking details');
      router.back();
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            if (typeof id === 'string') {
              try {
                await deleteBooking(id);
                Alert.alert('Success', 'Appointment cancelled successfully');
                router.replace('/booking');
              } catch (err) {
                // Handled in hook
              }
            }
          }
        }
      ]
    );
  };

  if (loading || !booking) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#c0392b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{Array.isArray(booking.serviceType) ? booking.serviceType.join(', ') : booking.serviceType}</Text>
        <Text style={styles.status}>Status: {booking.status}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{new Date(booking.scheduledDate).toDateString()}</Text>
        
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{booking.scheduledTime}</Text>

        <Text style={styles.label}>Booking ID</Text>
        <Text style={styles.value}>{booking._id}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.back()}>
          <Text style={styles.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        
        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
          <TouchableOpacity style={styles.btnDanger} onPress={handleCancel}>
            <Text style={styles.btnDangerText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f4f0', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#e0e0e0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0d0d0f', marginBottom: 8 },
  status: { fontSize: 16, color: '#c0392b', fontWeight: '600', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 16 },
  label: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  value: { fontSize: 18, color: '#0d0d0f', fontWeight: '500', marginBottom: 16 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnOutlineText: { color: '#0d0d0f', fontWeight: 'bold', fontSize: 16 },
  btnDanger: { flex: 2, backgroundColor: '#c0392b', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnDangerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
