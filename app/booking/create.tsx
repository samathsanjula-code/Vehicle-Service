import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookings } from '../../hooks/useBookings';
import { ServiceChip } from '../../components/booking/ServiceChip';
import { TimeSlotPicker } from '../../components/booking/TimeSlotPicker';

const SERVICES = ['Oil Change', 'Full Service', 'Brake Check', 'Tire Rotation', 'AC Repair', 'Other'];
const TIME_SLOTS = ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM'];

// Mock vehicles until API is ready
const MOCK_VEHICLES = [
  { id: '65f3a0921c1f5b0012345678', name: 'Toyota Corolla — ABC-1234' },
  { id: '65f3a0921c1f5b0012345679', name: 'Honda Civic — DEF-5678' }
];

export default function BookingFormScreen() {
  const params = useLocalSearchParams();
  const { createBooking, loading } = useBookings();
  
  const [step, setStep] = useState(1);
  const [vehicleId, setVehicleId] = useState(''); 
  const [serviceTypes, setServiceTypes] = useState<string[]>(
    typeof params.serviceType === 'string' ? [params.serviceType] : []
  );
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledDate, setScheduledDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const toggleService = (s: string) => {
    if (serviceTypes.includes(s)) {
      setServiceTypes(serviceTypes.filter(type => type !== s));
    } else {
      setServiceTypes([...serviceTypes, s]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!vehicleId) return Alert.alert('Error', 'Please select a vehicle.');
      if (serviceTypes.length === 0) return Alert.alert('Error', 'Please select at least one service type.');
      setStep(2);
    } else if (step === 2) {
      if (!scheduledTime) return Alert.alert('Error', 'Please select a time slot.');
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!vehicleId || serviceTypes.length === 0 || !scheduledDate || !scheduledTime) return;
    try {
      const newBooking = await createBooking({
        vehicleId,
        serviceType: serviceTypes,
        scheduledDate,
        scheduledTime,
        notes
      });
      Alert.alert('Success', 'Booking created successfully!');
      router.push({
        pathname: '/payment',
        params: {
          bookingId: newBooking._id,
          serviceType: serviceTypes.join(', '),
          scheduledDate: newBooking.scheduledDate,
          scheduledTime: newBooking.scheduledTime
        }
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
        <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
        <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
        <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Vehicle & Service</Text>
            
            <Text style={styles.label}>Select Vehicle</Text>
            {MOCK_VEHICLES.map(v => (
              <TouchableOpacity 
                key={v.id} 
                style={[styles.vehicleOption, vehicleId === v.id && styles.vehicleOptionSelected]}
                onPress={() => setVehicleId(v.id)}
              >
                <Text style={[styles.vehicleText, vehicleId === v.id && styles.vehicleTextSelected]}>{v.name}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.label, { marginTop: 24 }]}>Select Services</Text>
            <View style={styles.grid}>
              {SERVICES.map((s) => (
                <ServiceChip
                  key={s}
                  label={s}
                  selected={serviceTypes.includes(s)}
                  onSelect={() => toggleService(s)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Date & Time</Text>
            
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>{new Date(scheduledDate).toDateString()}</Text>
            </View>
            
            <Text style={styles.label}>Available Time Slots</Text>
            <TimeSlotPicker
              slots={TIME_SLOTS}
              selectedSlot={scheduledTime}
              onSelectSlot={setScheduledTime}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review Summary</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>
                {MOCK_VEHICLES.find(v => v.id === vehicleId)?.name}
              </Text>

              <Text style={styles.summaryLabel}>Services</Text>
              <Text style={styles.summaryValue}>{serviceTypes.join(', ')}</Text>
              
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{new Date(scheduledDate).toDateString()}</Text>
              
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{scheduledTime}</Text>
            </View>

            <Text style={[styles.label, { marginTop: 24 }]}>Additional Notes (Optional)</Text>
            <TextInput 
              style={styles.textArea}
              placeholder="Describe your issue or any specific requests..."
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnOutline} onPress={handleBack}>
          <Text style={styles.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        
        {step < 3 ? (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
            <Text style={styles.btnPrimaryText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btnPrimary, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.btnPrimaryText}>{loading ? 'Saving...' : 'Confirm & Pay'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f4f0', padding: 16 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e0e0e0' },
  progressDotActive: { backgroundColor: '#c0392b' },
  progressLine: { width: 40, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 4 },
  progressLineActive: { backgroundColor: '#c0392b' },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', color: '#0d0d0f', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 },
  vehicleOption: { padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 8 },
  vehicleOptionSelected: { borderColor: '#c0392b', backgroundColor: '#fff0f0' },
  vehicleText: { fontSize: 16, color: '#333' },
  vehicleTextSelected: { color: '#c0392b', fontWeight: 'bold' },
  dateDisplay: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  dateText: { fontSize: 16, color: '#333' },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  summaryLabel: { fontSize: 14, color: '#7f8c8d', marginBottom: 4, marginTop: 12 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: '#0d0d0f' },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 16, fontSize: 16, minHeight: 100 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16 },
  btnPrimary: { flex: 2, backgroundColor: '#c0392b', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnOutlineText: { color: '#0d0d0f', fontWeight: 'bold', fontSize: 16 },
});
