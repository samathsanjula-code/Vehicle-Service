import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const bookingId = typeof params.bookingId === 'string' ? params.bookingId : undefined;
  const serviceType = typeof params.serviceType === 'string' ? params.serviceType : 'Unknown';
  const scheduledDate = typeof params.scheduledDate === 'string' ? params.scheduledDate : 'Unknown';
  const scheduledTime = typeof params.scheduledTime === 'string' ? params.scheduledTime : 'Unknown';
  const totalAmount = typeof params.totalAmount === 'string' ? params.totalAmount : '0.00';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Booking ID</Text>
        <Text style={styles.value}>{bookingId ?? 'N/A'}</Text>

        <Text style={styles.label}>Services</Text>
        <Text style={styles.value}>{serviceType}</Text>

        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{new Date(scheduledDate).toDateString()}</Text>

        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{scheduledTime}</Text>

        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.value}>LKR {Number(totalAmount).toFixed(2)}</Text>
      </View>

      <Text style={styles.note}>
        This is a placeholder payment screen. Payment integration is not implemented yet.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/booking')}
      >
        <Text style={styles.buttonText}>Return to Upcoming</Text>
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
    backgroundColor: '#c0392b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
