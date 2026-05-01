import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddMechanic() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    availability: 'Available',
    level: 'Junior',
    experience: ''
  });

  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, phone: cleaned.slice(0, 10) }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.specialization || !formData.experience) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    if (formData.phone.length !== 10 || !formData.phone.startsWith('0')) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone starting with 0.');
      return;
    }

    setLoading(true);
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      const res = await fetch(API.mechanics, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenStr}` 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Mechanic added successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to add mechanic');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Network Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (label: string, value: string, options: string[], field: keyof typeof formData) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonRow}>
        {options.map(opt => (
          <TouchableOpacity 
            key={opt}
            style={[styles.radioBtn, formData[field] === opt && styles.radioBtnActive]}
            onPress={() => setFormData(prev => ({...prev, [field]: opt}))}
          >
            <Text style={[styles.radioText, formData[field] === opt && styles.radioTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Mechanic</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
            />
          </View>

          {/* Specialization */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialization</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Engine Specialist"
              value={formData.specialization}
              onChangeText={(text) => setFormData(prev => ({...prev, specialization: text}))}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0712345678"
              keyboardType="number-pad"
              value={formData.phone}
              onChangeText={handlePhoneChange}
            />
          </View>

          {/* Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Experience</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 5 Years"
              value={formData.experience}
              onChangeText={(text) => setFormData(prev => ({...prev, experience: text}))}
            />
          </View>

          {/* Selection Fields built natively */}
          {renderDropdown('Availability', formData.availability, ['Available', 'Busy', 'Offline'], 'availability')}
          {renderDropdown('Level', formData.level, ['Junior', 'Senior', 'Expert'], 'level')}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Mechanic'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    padding: 24,
    paddingBottom: 60,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 16,
    color: '#1f2937',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioBtnActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
  },
  radioText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  radioTextActive: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
