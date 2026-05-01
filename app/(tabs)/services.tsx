import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { API } from '../../constants/api';

// --- DATA TYPE ---
type ServiceItem = {
  _id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  name: string;
  description: string;
  price: number;
  features: string[];
  category: string;
};

// --- MAIN SERVICES SCREEN ---
export default function ServicesScreen() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [localServices, setLocalServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API.services);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setLocalServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
    }, [])
  );

  const isLargeScreen = width > 768;

  const filteredServices = localServices.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Our Services</Text>
          <Text style={styles.heroSubtitle}>
            Professional automotive care tailored for your vehicle. Explore our comprehensive service catalog.
          </Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search services or categories..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* --- SERVICES GRID --- */}
        <View style={[styles.gridContainer, isLargeScreen && styles.gridContainerLarge]}>
          {filteredServices.map((service) => (
            <View key={service._id} style={[styles.card, isLargeScreen && styles.cardLarge]}>
              
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={service.icon} size={28} color="#4F46E5" />
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{service.category}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.cardDescription}>{service.description}</Text>

              <View style={styles.divider} />

              <View style={styles.featuresContainer}>
                {service.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>Starting at LKR {service.price}</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.primaryButtonPressed,
                  ]}
                  onPress={() => router.push('/appointments')}>
                  <Text style={styles.primaryButtonText}>Book Now</Text>
                </Pressable>
              </View>
              
            </View>
          ))}
          
          {filteredServices.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No services found matching your search.</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 600,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  gridContainer: {
    padding: 16,
    gap: 20,
    alignItems: 'center',
  },
  gridContainerLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardLarge: {
    width: 400,
    margin: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryButtonPressed: {
    backgroundColor: '#4338CA',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
