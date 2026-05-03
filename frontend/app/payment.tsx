import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { API, BOOKINGS_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingId = typeof params.bookingId === 'string' ? params.bookingId : undefined;
  const serviceType = typeof params.serviceType === 'string' ? params.serviceType : 'Unknown';
  const scheduledDate = typeof params.scheduledDate === 'string' ? params.scheduledDate : 'Unknown';
  const scheduledTime = typeof params.scheduledTime === 'string' ? params.scheduledTime : 'Unknown';
  const totalAmount = typeof params.totalAmount === 'string' ? params.totalAmount : '0.00';

  const handlePayment = async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Invalid Booking ID');
      return;
    }

    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${BOOKINGS_URL}/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Paid' })
      });

      if (response.ok) {
        console.log("✅ Booking status updated to 'Paid' successfully");
        Alert.alert('Success', 'Payment successful! Your appointment is now confirmed.', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/appointments') }
        ]);
      } else {
        const errorData = await response.json();
        console.error("❌ Payment update failed:", errorData);
        Alert.alert('Error', errorData.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Error', 'Connection failed. Please check your network.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Confirmation</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Booking ID</Text>
        <Text style={styles.value}>{bookingId ?? 'N/A'}</Text>

        <Text style={styles.label}>Services</Text>
        <Text style={styles.value}>{serviceType}</Text>

        <Text style={styles.label}>Date & Time</Text>
        <Text style={styles.value}>{new Date(scheduledDate).toDateString()} at {scheduledTime}</Text>

        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.value}>LKR {Number(totalAmount).toLocaleString()}</Text>
      </View>

      <Text style={styles.note}>
        This is a simulated payment screen. Clicking "Confirm & Pay" will mark your booking as Confirmed.
      </Text>

      <TouchableOpacity
        style={[styles.button, isProcessing && { backgroundColor: '#95a5a6' }]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm & Pay Now</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={isProcessing}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f4f0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d0d0f',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d0d0f',
    marginTop: 4,
  },
  note: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16,
  },
});
