import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useBookings } from '../../hooks/useBookings';
import { ServiceChip } from '../../components/booking/ServiceChip';
import { TimeSlotPicker } from '../../components/booking/TimeSlotPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const SERVICES = ['Oil Change', 'Full Service', 'Brake Check', 'Tire Rotation', 'AC Repair', 'Other'];
const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:30 PM', '4:30 PM'];

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
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  const [serviceTypes, setServiceTypes] = useState<string[]>(
    typeof params.serviceType === 'string' ? [params.serviceType] : []
  );
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledDate, setScheduledDate] = useState(tomorrow);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const toggleService = (s: string) => {
    if (serviceTypes.includes(s)) {
      setServiceTypes(serviceTypes.filter(type => type !== s));
    } else {
      setServiceTypes([...serviceTypes, s]);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduledDate;
    setShowDatePicker(Platform.OS === 'ios');
    setScheduledDate(currentDate);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!vehicleId) return Alert.alert('Error', 'Please select a vehicle.');
      if (serviceTypes.length === 0) return Alert.alert('Error', 'Please select at least one service type.');
      if (!scheduledTime) return Alert.alert('Error', 'Please select a time slot.');
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!vehicleId || serviceTypes.length === 0 || !scheduledDate || !scheduledTime) return;
    try {
      const dateString = scheduledDate.toISOString().split('T')[0];
      const newBooking = await createBooking({
        vehicleId,
        serviceType: serviceTypes,
        scheduledDate: dateString,
        scheduledTime,
        notes
      });
      Alert.alert('Success', 'Booking created successfully!');
      router.push({
        pathname: '/payment',
        params: {
          bookingId: newBooking._id,
          serviceType: serviceTypes.join(', '),
          scheduledDate: dateString,
          scheduledTime: newBooking.scheduledTime
        }
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  const selectedVehicleName = MOCK_VEHICLES.find(v => v.id === vehicleId)?.name || 'Select Vehicle';

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
        <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Fill in your service details</Text>
            
            {/* Vehicle Selection */}
            <Text style={styles.label}>YOUR VEHICLE</Text>
            <TouchableOpacity 
              style={styles.dropdownButton} 
              onPress={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownButtonText}>{selectedVehicleName}</Text>
              <Ionicons name={isVehicleDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
            </TouchableOpacity>

            {isVehicleDropdownOpen && (
              <View style={styles.dropdownList}>
                {MOCK_VEHICLES.map(v => (
                  <TouchableOpacity 
                    key={v.id} 
                    style={[styles.dropdownItem, vehicleId === v.id && styles.dropdownItemSelected]}
                    onPress={() => {
                      setVehicleId(v.id);
                      setIsVehicleDropdownOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, vehicleId === v.id && styles.dropdownItemTextSelected]}>{v.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Service Selection */}
            <Text style={[styles.label, { marginTop: 24 }]}>SERVICE TYPE</Text>
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

            {/* Date & Time */}
            <Text style={[styles.label, { marginTop: 24 }]}>DATE & TIME</Text>
            <Text style={styles.subLabel}>Preferred Date</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{scheduledDate.toDateString()}</Text>
              <Ionicons name="calendar-outline" size={20} color="#c0392b" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={scheduledDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
            
            <Text style={styles.subLabel}>Available Time Slots</Text>
            <TimeSlotPicker
              slots={TIME_SLOTS}
              selectedSlot={scheduledTime}
              onSelectSlot={setScheduledTime}
            />

            {/* Additional Notes */}
            <Text style={[styles.label, { marginTop: 24 }]}>ADDITIONAL NOTES</Text>
            <TextInput 
              style={styles.textArea}
              placeholder="Describe your issue (optional)..."
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review Summary</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>
                {selectedVehicleName}
              </Text>

              <Text style={styles.summaryLabel}>Services</Text>
              <Text style={styles.summaryValue}>{serviceTypes.join(', ')}</Text>
              
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{scheduledDate.toDateString()}</Text>
              
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{scheduledTime}</Text>

              {notes ? (
                <>
                  <Text style={styles.summaryLabel}>Additional Notes</Text>
                  <Text style={styles.summaryValue}>{notes}</Text>
                </>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnOutline} onPress={handleBack}>
          <Text style={styles.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        
        {step < 2 ? (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
            <Text style={styles.btnPrimaryText}>Continue to Payment</Text>
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
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e0e0e0' },
  progressDotActive: { backgroundColor: '#c0392b' },
  progressLine: { width: 60, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 4 },
  progressLineActive: { backgroundColor: '#c0392b' },
  stepContainer: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#0d0d0f', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#c0392b', marginBottom: 10, letterSpacing: 1 },
  subLabel: { fontSize: 14, color: '#7f8c8d', marginBottom: 8, marginTop: 12 },
  
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  dropdownButtonText: { fontSize: 16, color: '#333' },
  dropdownList: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', marginTop: 4, overflow: 'hidden' },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemSelected: { backgroundColor: '#fff0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },
  dropdownItemTextSelected: { color: '#c0392b', fontWeight: 'bold' },

  dateButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  dateText: { fontSize: 16, color: '#333' },
  
  summaryCard: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  summaryLabel: { fontSize: 14, color: '#7f8c8d', marginBottom: 4, marginTop: 12 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: '#0d0d0f' },
  
  textArea: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 16, fontSize: 16, minHeight: 100 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16 },
  btnPrimary: { flex: 2, backgroundColor: '#c0392b', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnOutlineText: { color: '#0d0d0f', fontWeight: 'bold', fontSize: 16 },
});
