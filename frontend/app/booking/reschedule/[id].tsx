import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookings, Booking } from '../../../hooks/useBookings';
import { TimeSlotPicker } from '../../../components/booking/TimeSlotPicker';

const TIME_SLOTS = ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM'];

export default function RescheduleScreen() {
  const { id } = useLocalSearchParams();
  const { fetchBookingById, updateBooking, loading } = useBookings();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    try {
      const data = await fetchBookingById(bookingId);
      setBooking(data);
      // For simplicity, move to next day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime(data.scheduledTime);
    } catch (err) {
      Alert.alert('Error', 'Failed to load booking');
      router.back();
    }
  };

  const handleUpdate = async () => {
    if (!scheduledTime) return Alert.alert('Error', 'Please select a time slot.');
    if (typeof id === 'string') {
      try {
        await updateBooking(id, { scheduledDate, scheduledTime });
        Alert.alert('Success', 'Appointment rescheduled successfully');
        router.back();
      } catch (err) {
        // Handled in hook
      }
    }
  };

  if (!booking) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#c0392b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reschedule {Array.isArray(booking.serviceType) ? booking.serviceType.join(', ') : booking.serviceType}</Text>
        <Text style={styles.subtitle}>Current Appointment: {booking.scheduledTime}</Text>

        <Text style={styles.label}>New Date (Tomorrow)</Text>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{new Date(scheduledDate).toDateString()}</Text>
        </View>

        <Text style={styles.label}>Select New Time</Text>
        <TimeSlotPicker
          slots={TIME_SLOTS}
          selectedSlot={scheduledTime}
          onSelectSlot={setScheduledTime}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.back()}>
          <Text style={styles.btnOutlineText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.btnPrimaryText}>{loading ? 'Updating...' : 'Confirm Changes'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f4f0', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#e0e0e0' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0d0d0f', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 },
  dateDisplay: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 16 },
  dateText: { fontSize: 16, color: '#333' },
  footer: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnOutlineText: { color: '#0d0d0f', fontWeight: 'bold', fontSize: 16 },
  btnPrimary: { flex: 2, backgroundColor: '#c0392b', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
