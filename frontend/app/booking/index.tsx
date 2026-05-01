import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useBookings, Booking } from '../../hooks/useBookings';
import { AppointmentCard } from '../../components/booking/AppointmentCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppointmentsScreen() {
  const { fetchUserBookings, loading, error } = useBookings();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        
        const data = await fetchUserBookings(decoded.id);
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = () => {
    router.push('/booking/create');
  };

  const handleViewDetails = (id: string) => {
    router.push(`/booking/${id}`);
  };

  const handleReschedule = (id: string) => {
    router.push(`/booking/reschedule/${id}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Book New Appointment</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>UPCOMING</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#c0392b" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <AppointmentCard
              serviceType={item.serviceType}
              scheduledDate={item.scheduledDate}
              scheduledTime={item.scheduledTime}
              status={item.status}
              onViewDetails={() => handleViewDetails(item._id)}
              onReschedule={() => handleReschedule(item._id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No appointments found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f4f0',
    padding: 16,
  },
  createButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 12,
    letterSpacing: 1,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 20,
    fontSize: 16,
  },
});
