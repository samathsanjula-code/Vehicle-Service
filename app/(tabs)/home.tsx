import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSource } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { heroSlides, serviceImages, galleryImages, HeroSlide } from '@/assets/images';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

type RoadsideService = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  name: string;
  description: string;
};

const roadsideServices: RoadsideService[] = [
  {
    icon: 'car-outline',
    name: 'Vehicle Breakdown Service',
    description: '24/7 emergency breakdown assistance',
  },
  {
    icon: 'alert-circle-outline',
    name: 'Flat Tires (Tire Punctures)',
    description: 'Quick tire repair and replacement',
  },
  {
    icon: 'battery-charging-outline',
    name: 'Battery Jump Start',
    description: 'Fast battery boost service',
  },
  {
    icon: 'build-outline',
    name: 'Roadside Repair Assistance',
    description: 'On-site mechanical repairs',
  },
  {
    icon: 'bus-outline',
    name: 'Towing Services',
    description: 'Safe vehicle towing and recovery',
  },
];

type MainService = {
  image: ImageSource;
  name: string;
  description: string;
};

const mainServices: MainService[] = [
  {
    image: serviceImages.mechanicalRepair,
    name: 'Mechanical Repairs',
    description: 'Precision diagnostic and engine restoration services...',
  },
  {
    image: serviceImages.collisionRepair,
    name: 'Collision Repairs',
    description: 'Advanced bodywork and paint matching using robotic...',
  },
  {
    image: serviceImages.lubrication,
    name: 'Lubrication Services',
    description: 'Premium synthetic oils and filter changes to maximize...',
  },
  {
    image: serviceImages.detailing,
    name: 'Vehicle Detailing',
    description: 'Exquisite interior and exterior rejuvenation showroom...',
  },
  {
    image: serviceImages.wheelAlignment,
    name: 'Wheel Alignment',
    description: 'Computerized 3D alignment for optimal handling...',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideshowRef = useRef<FlatList<HeroSlide>>(null);
  const timerRef = useRef<any>(null);

  // Auto-scroll slideshow
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % heroSlides.length;
        slideshowRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveSlide(viewableItems[0].index);
      }
    },
  ).current;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        {/* ── Hero Slideshow ─────────────────────────────────────────────── */}
        <View style={styles.slideshowContainer}>
          <FlatList
            ref={slideshowRef}
            data={heroSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image
                  source={item.image}
                  style={styles.slideImage}
                  contentFit="cover"
                  transition={400}
                />
                {/* Red gradient overlay */}
                <View style={styles.slideOverlay} />
                {/* Slide content */}
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.slideDescription}>{item.description}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.bookButton,
                      pressed && styles.bookButtonPressed,
                    ]}
                    onPress={() => router.push('/services')}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#dc2626" />
                  </Pressable>
                </View>
              </View>
            )}
          />

          {/* Pagination dots */}
          <View style={styles.dotsContainer}>
            {heroSlides.map((_: HeroSlide, i: number) => (
              <View
                key={i}
                style={[styles.dot, i === activeSlide && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* ── Welcome Banner ──────────────────────────────────────────────── */}
        <ThemedView style={styles.welcomeBanner}>
          <ThemedView style={styles.welcomeRow}>
            <ThemedText type="title">Welcome!</ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedText style={styles.welcomeSubtext}>
            Professional auto care at your fingertips
          </ThemedText>
        </ThemedView>

        {/* ── Emergency Contact ───────────────────────────────────────────── */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyTextBlock}>
              <Text style={styles.emergencyLabel}>ROADSIDE</Text>
              <Text style={styles.emergencyLabel}>ASSISTANCE</Text>
            </View>
            <Pressable
              style={styles.phoneBox}
              onPress={() => Linking.openURL('tel:0710851297')}>
              <Text style={styles.phoneNumber}>0710 851 297</Text>
            </Pressable>
            <View style={styles.emergencyFooter}>
              <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.emergencyFooterText}>24/7 Emergency Service</Text>
            </View>
          </View>
        </View>

        {/* ── Roadside Services ───────────────────────────────────────────── */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ROADSIDE SERVICES
          </ThemedText>
          {roadsideServices.map((service) => (
            <View key={service.name} style={styles.roadsideCard}>
              <View style={styles.roadsideIconBg}>
                <Ionicons name={service.icon} size={22} color="#fff" />
              </View>
              <View style={styles.roadsideInfo}>
                <ThemedText type="defaultSemiBold" style={styles.roadsideCardTitle}>
                  {service.name}
                </ThemedText>
                <ThemedText style={styles.roadsideCardDesc}>
                  {service.description}
                </ThemedText>
              </View>
            </View>

          ))}
        </ThemedView>

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        <ThemedView style={styles.gallerySection}>
          <Image
            source={galleryImages.showroom}
            style={styles.galleryLarge}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.galleryRow}>
            <Image
              source={galleryImages.garage}
              style={styles.gallerySmall}
              contentFit="cover"
              transition={300}
            />
            <Image
              source={serviceImages.detailing}
              style={styles.gallerySmall}
              contentFit="cover"
              transition={300}
            />
          </View>
        </ThemedView>

        {/* ── Core Services ───────────────────────────────────────────────── */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>OUR EXPERTISE</Text>
              <ThemedText type="subtitle">Core Services</ThemedText>
            </View>
            <Pressable onPress={() => router.push('/services')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </Pressable>
          </View>

          {mainServices.map((service) => (
            <Pressable
              key={service.name}
              style={({ pressed }) => [styles.serviceCard, pressed && styles.serviceCardPressed]}
              onPress={() => router.push('/services')}>
              <Image
                source={service.image}
                style={styles.serviceCardImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.serviceCardInfo}>
                <ThemedText type="defaultSemiBold" style={styles.serviceCardName}>
                  {service.name}
                </ThemedText>
                <ThemedText style={styles.serviceCardDesc} numberOfLines={2}>
                  {service.description}
                </ThemedText>
                <Text style={styles.detailsText}>
                  DETAILS <Ionicons name="chevron-forward" size={11} color="#dc2626" />
                </Text>
              </View>
            </Pressable>
          ))}
        </ThemedView>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <ThemedText type="subtitle" style={styles.ctaTitle}>
              NEED SERVICE TODAY?
            </ThemedText>
            <ThemedText style={styles.ctaSubtitle}>
              Professional auto care at your fingertips
            </ThemedText>
            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.85 }]}
              onPress={() => router.push('/appointments')}>
              <Text style={styles.ctaButtonText}>BOOK APPOINTMENT</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dc2626',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Slideshow
  slideshowContainer: {
    height: 400,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 400,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 38, 38, 0.5)',
  },
  slideContent: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    lineHeight: 52,
  },
  slideSubtitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    marginBottom: 4,
  },
  slideDescription: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 16,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bookButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  bookButtonPressed: {
    opacity: 0.85,
  },
  bookButtonText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#fff',
  },

  // Welcome banner
  welcomeBanner: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeSubtext: {
    color: '#6b7280',
    marginTop: 4,
  },

  // Emergency section
  emergencySection: {
    backgroundColor: '#dc2626',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emergencyCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emergencyTextBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  phoneBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 12,
    transform: [{ rotate: '-2deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  phoneNumber: {
    color: '#dc2626',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  emergencyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emergencyFooterText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  sectionEyebrow: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 2,
  },
  viewAllText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 13,
  },

  // Roadside cards
  roadsideCard: {
    backgroundColor: '#dc2626',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  roadsideIconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadsideInfo: {
    flex: 1,
  },
  roadsideCardTitle: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 2,
  },
  roadsideCardDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },

  // Gallery
  gallerySection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 10,
  },
  galleryLarge: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gallerySmall: {
    flex: 1,
    height: 130,
    borderRadius: 14,
  },

  // Service cards
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  serviceCardImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  serviceCardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  serviceCardName: {
    fontSize: 15,
    color: '#111827',
  },
  serviceCardDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  detailsText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // CTA
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ctaCard: {
    backgroundColor: '#dc2626',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: {
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  bottomSpacer: {
    height: 24,
  },
});
