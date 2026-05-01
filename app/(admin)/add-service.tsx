import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { API } from '../../constants/api';

// --- CUSTOM INPUT COMPONENT ---
type ModernInputProps = {
  label: string;
  icon: any;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  numberOfLines?: number;
};

const ModernInput = ({ 
  label, icon, required, value, onChangeText, placeholder, keyboardType = "default", multiline = false, numberOfLines = 1 
}: ModernInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputContainerFocused,
        multiline && styles.textAreaContainer
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? '#4F46E5' : '#9CA3AF'}
          style={styles.inputIcon} 
        />
        
        <TextInput
          style={[styles.input, multiline && styles.textArea]}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
    </View>
  );
};

// --- MAIN ADD SERVICE SCREEN ---
export default function AddServiceScreen() {
  const router = useRouter();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!serviceName || !category || !price || !description) {
      Alert.alert('Missing Fields', 'Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    try {
      setIsSaving(true);
      const newFeaturesArray = features.split(',').map(f => f.trim()).filter(f => f.length > 0);

      const response = await fetch(API.services, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: serviceName,
          category: category,
          price: parseFloat(price) || 0,
          discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
          description: description,
          features: newFeaturesArray,
          icon: 'sparkles-outline',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save service');
      }

      Alert.alert(
        'Success',
        'Service added successfully to database!',
        [{ text: 'Awesome', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add the service. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* --- HEADER NAV BAR --- */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <View style={styles.backIconWrapper}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>New Service</Text>
            <Text style={styles.headerSubtitle}>Add to catalog</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* --- FORM SECTION --- */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Basic Information</Text>
            </View>

            <ModernInput
              label="Service Name"
              icon="car-sport-outline"
              required={true}
              placeholder="e.g. Premium Wash & Wax"
              value={serviceName}
              onChangeText={setServiceName}
            />

            <ModernInput
              label="Category"
              icon="grid-outline"
              required={true}
              placeholder="e.g. Washing, Detailing"
              value={category}
              onChangeText={setCategory}
            />

            <ModernInput
              label="Price (LKR)"
              icon="cash-outline"
              required={true}
              placeholder="e.g. 3500"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <ModernInput
              label="Discount Price (LKR) - Optional"
              icon="pricetag-outline"
              required={false}
              placeholder="e.g. 2800"
              keyboardType="numeric"
              value={discountPrice}
              onChangeText={setDiscountPrice}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={24} color="#4F46E5" />
              <Text style={styles.cardTitle}>Service Details</Text>
            </View>

            <ModernInput
              label="Description"
              icon="reader-outline"
              required={true}
              placeholder="Describe what this service includes..."
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <ModernInput
              label="Features (Comma separated)"
              icon="list-outline"
              required={false}
              placeholder="e.g. Interior vacuum, Tire shine, Window clean..."
              multiline={true}
              numberOfLines={3}
              value={features}
              onChangeText={setFeatures}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* --- FOOTER BUTTON --- */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>{isSaving ? 'Publishing...' : 'Publish Service'}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#F3F4F6',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIconWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 28,
  },
  textAreaContainer: {
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    minHeight: 100,
  },
  bottomSpacer: {
    height: 40,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
