import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API } from '@/constants/api';
import { useAuth } from '../context/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_CATEGORIES = [
  { label: 'Car', value: 'car' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
];

const FUEL_TYPES = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
];

const TRANSMISSION_TYPES = [
  { label: 'Manual', value: 'manual' },
  { label: 'Automatic', value: 'automatic' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AddVehicleScreen() {
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;

  // Form State
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  const [category, setCategory] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [fuelType, setFuelType] = useState<string | null>(null);
  const [transmission, setTransmission] = useState<string | null>(null);
  
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && token) {
      const fetchRecord = async () => {
        setLoading(true);
        try {
          // Use API.vehicles endpoint which matches where service-history fetches from
          const response = await fetch(`${API.vehicles}/${editId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const record = await response.json();
          
          if (response.ok && record) {
            setFullName(record.customerDetails?.fullName || '');
            setContactNumber(record.customerDetails?.contactNumber || '');
            setCategory(record.vehicleDetails?.category || null);
            setBrand(record.vehicleDetails?.brand || '');
            setModel(record.vehicleDetails?.model || '');
            setYear(record.vehicleDetails?.year || '');
            setRegNumber(record.vehicleDetails?.regNumber || '');
            setFuelType(record.vehicleDetails?.fuelType || null);
            setTransmission(record.vehicleDetails?.transmission || null);
            setImages(record.image ? [record.image] : []);
          } else {
            console.error('Failed to fetch vehicle:', record.message);
            Alert.alert('Error', 'Could not load vehicle details.');
          }
        } catch (error) {
          console.error('Error fetching record for edit:', error);
          Alert.alert('Error', 'An error occurred while loading vehicle details.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    }
  }, [editId, token]);

  // Handlers

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages([...images, ...selectedUris]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!contactNumber.trim()) {
      Alert.alert('Validation Error', 'Contact Number is required.');
      return false;
    }
    if (!/^\d{10,}$/.test(contactNumber.replace(/[\s\-\(\)]/g, ''))) {
      Alert.alert('Validation Error', 'Please enter a valid contact number.');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a Vehicle Category.');
      return false;
    }
    if (!brand.trim()) {
      Alert.alert('Validation Error', 'Vehicle Brand is required.');
      return false;
    }
    if (!model.trim()) {
      Alert.alert('Validation Error', 'Vehicle Model is required.');
      return false;
    }
    if (!regNumber.trim()) {
      Alert.alert('Validation Error', 'Vehicle Registration Number is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!token) {
      Alert.alert('Error', 'Please log in to proceed.');
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        customerDetails: {
          fullName,
          contactNumber,
        },
        vehicleDetails: {
          category,
          brand,
          model,
          year,
          regNumber,
          fuelType,
          transmission,
        },
        image: images.length > 0 ? images[0] : null,
      };

      const url = isEditing ? `${API.vehicles}/${editId}` : API.vehicles;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          isEditing ? 'Vehicle updated successfully!' : 'Vehicle added to your fleet!',
          [{ text: 'View Fleet', onPress: () => router.replace('/service-history') }]
        );
      } else {
        // This will show the actual message from the backend
        throw new Error(data.message || (isEditing ? 'Failed to update vehicle' : 'Failed to save vehicle'));
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {loading && isEditing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={{ marginTop: 10, color: '#dc2626', fontWeight: '700' }}>Loading vehicle details...</Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </Pressable>
            <View>
              <ThemedText type="title" style={styles.title}>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</ThemedText>
              <Text style={styles.subtitle}>{isEditing ? 'Modify your vehicle details' : 'Register a new vehicle to your profile'}</Text>
            </View>
          </View>

          {/* Section: Customer Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#dc2626" />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Customer Details</ThemedText>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 0712345678"
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
            </View>
          </View>

          {/* Section: Vehicle Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car-outline" size={20} color="#dc2626" />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Vehicle Information</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Category</Text>
              <Dropdown
                style={styles.dropdown}
                data={VEHICLE_CATEGORIES}
                labelField="label"
                valueField="value"
                placeholder="Select Category"
                value={category}
                onChange={item => setCategory(item.value)}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Brand *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Toyota"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Model *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Corolla"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2022"
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Reg Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. WP-ABC-1234"
                  autoCapitalize="characters"
                  value={regNumber}
                  onChangeText={setRegNumber}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fuel Type</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={FUEL_TYPES}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={fuelType}
                  onChange={item => setFuelType(item.value)}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Transmission</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={TRANSMISSION_TYPES}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={transmission}
                  onChange={item => setTransmission(item.value)}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
            </View>
          </View>

          {/* Section: Image Upload */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="camera-outline" size={20} color="#dc2626" />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Vehicle Photos</ThemedText>
            </View>
            <View style={styles.imagePickerRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <Pressable style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={20} color="#dc2626" />
                  </Pressable>
                </View>
              ))}
              <Pressable style={styles.addImageBtn} onPress={pickImage}>
                <Ionicons name="camera-outline" size={24} color="#dc2626" />
                <Text style={styles.addImageText}>Add</Text>
              </Pressable>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.85 },
              loading && { backgroundColor: '#9ca3af' }
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? 'SAVING...' : isEditing ? 'UPDATE REQUEST' : 'SUBMIT REQUEST'}
            </Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  dropdown: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 48,
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#9ca3af',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#111827',
  },
  datePickerBtn: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#111827',
  },
  imagePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  addImageBtn: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderStyle: 'dashed',
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '700',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  bottomSpacer: {
    height: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
