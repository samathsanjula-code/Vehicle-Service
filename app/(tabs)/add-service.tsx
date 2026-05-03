import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddServiceScreen() {
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const isEditMode = !!params.id;

  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: (params.vehicleNumber as string) || '',
    serviceType: (params.serviceType as string) || '',
    mileage: (params.mileage as string) || '',
    cost: (params.cost as string) || '',
    description: (params.description as string) || ''
  });

  
  useEffect(() => {
    if (params.billImage) {
      setImage(`${BASE_URL}${params.billImage}`);
    }
  }, [params.billImage]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.vehicleNumber || !form.serviceType || !form.cost) {
      Alert.alert("Required Fields", "Please fill in all mandatory fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('vehicleNumber', form.vehicleNumber);
      formData.append('serviceType', form.serviceType);
      formData.append('mileage', form.mileage);
      formData.append('cost', form.cost);
      formData.append('description', form.description);

      if (image && !image.startsWith('http')) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const fileName = image.split('/').pop();

        // @ts-ignore
        formData.append('billImage', {
          uri: image,
          name: fileName || `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      if (isEditMode) {
        await axios.put(`${BASE_URL}/api/services/${params.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${BASE_URL}/api/services/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      Alert.alert(
        "Success",
        isEditMode
          ? "Record updated and sent for re-approval!"
          : "Service record added successfully!"
      );

      router.replace('/services' as any);

    } catch (error: any) {
      Alert.alert("Error", "Failed to save record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.navHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{isEditMode ? 'Edit Record' : 'Add Record'}</Text>
      </View>

      <Text style={styles.label}>Service Bill Photo</Text>
      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={styles.editOverlay}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.editText}>Change Photo</Text>
            </View>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cloud-upload-outline" size={48} color="#dc2626" />
            <Text style={styles.placeholderText}>Tap to upload bill photo</Text>
            <Text style={styles.placeholderSubText}>Supported: JPG, PNG (Max 5MB)</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Vehicle Number *</Text>
        <TextInput
          placeholder="e.g. CAS-5566"
          style={styles.input}
          value={form.vehicleNumber}
          placeholderTextColor="#9ca3af"
          onChangeText={(text) => setForm({ ...form, vehicleNumber: text })}
        />

        <Text style={styles.label}>Service Type *</Text>
        <TextInput
          placeholder="e.g. Full Service / Oil Change"
          style={styles.input}
          value={form.serviceType}
          placeholderTextColor="#9ca3af"
          onChangeText={(text) => setForm({ ...form, serviceType: text })}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Mileage (km)</Text>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              style={styles.input}
              value={form.mileage}
              placeholderTextColor="#9ca3af"
              onChangeText={(text) => setForm({ ...form, mileage: text })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Cost (Rs.) *</Text>
            <TextInput
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.input}
              value={form.cost}
              placeholderTextColor="#9ca3af"
              onChangeText={(text) => setForm({ ...form, cost: text })}
            />
          </View>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Notes about the service..."
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={form.description}
          placeholderTextColor="#9ca3af"
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
      </View>

      <Pressable
        style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{isEditMode ? 'Update Service Record' : 'Save Service Record'}</Text>
        )}
      </Pressable>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  navHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 25 },
  backBtn: { padding: 8, marginLeft: -8 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginLeft: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginLeft: 2 },
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden'
  },
  imageContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%' },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 5
  },
  editText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  imagePlaceholder: { alignItems: 'center' },
  placeholderText: { color: '#4b5563', fontWeight: '600', marginTop: 10 },
  placeholderSubText: { color: '#9ca3af', fontSize: 11, marginTop: 4 },
  formGroup: { gap: 4 },
  row: { flexDirection: 'row' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15,
    color: '#111827'
  },
  submitBtn: {
    backgroundColor: '#dc2626',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 }
});