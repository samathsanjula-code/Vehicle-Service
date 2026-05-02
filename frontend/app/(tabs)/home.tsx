import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HelloWave } from '@/components/hello-wave';
import { heroSlides, serviceImages, galleryImages } from '@/assets/images';

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
  image: ReturnType<typeof require>;
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
  const slideshowRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll slideshow
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % heroSlides.length;
        slideshowRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
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
                  transition={600}
                />
                <View style={styles.slideOverlay} />
                <View style={styles.slideContent}>
                  <Animated.Text 
                    entering={FadeInDown.delay(100).duration(800)}
                    style={styles.slideTitle}>
                    {item.title}
                  </Animated.Text>
                  <Animated.Text 
                    entering={FadeInDown.delay(200).duration(800)}
                    style={styles.slideSubtitle}>
                    {item.subtitle}
                  </Animated.Text>
                  <Animated.Text 
                    entering={FadeInDown.delay(300).duration(800)}
                    style={styles.slideDescription}>
                    {item.description}
                  </Animated.Text>
                  
                  <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.bookButton,
                        pressed && styles.bookButtonPressed,
                      ]}
                      onPress={() => router.push('/services')}>
                      <Text style={styles.bookButtonText}>Book Appointment</Text>
                      <View style={styles.bookButtonIconBg}>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                      </View>
                    </Pressable>
                  </Animated.View>
                </View>
              </View>
            )}
          />

          <View style={styles.dotsContainer}>
            {heroSlides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeSlide && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* ── Welcome Banner ──────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.welcomeBanner}>
            <View style={styles.welcomeHeader}>
              <View>
                <View style={styles.welcomeRow}>
                  <Text style={styles.greetingText}>Hello, Welcome Back!</Text>
                  <HelloWave />
                </View>
                <Text style={styles.welcomeSubtext}>
                  Find the best services for your vehicle
                </Text>
              </View>
              <Pressable 
                style={styles.profileAvatar}
                onPress={() => router.push('/profile')}>
                <Ionicons name="person" size={20} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>

          {/* ── Emergency Contact ───────────────────────────────────────────── */}
          <Animated.View entering={FadeInLeft.delay(200).duration(600)} style={styles.emergencyContainer}>
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyIconBg}>
                <Ionicons name="alert-circle" size={32} color="#dc2626" />
              </View>
              <View style={styles.emergencyTextContent}>
                <Text style={styles.emergencyTitle}>Roadside Assistance</Text>
                <Text style={styles.emergencyDesc}>24/7 Emergency Service</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.callButton,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                ]}
                onPress={() => Linking.openURL('tel:0710851297')}>
                <Ionicons name="call" size={22} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>

          </Animated.View>

          {/* ── Core Services (Horizontal Scroll) ─────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Services</Text>
              <Pressable onPress={() => router.push('/services')}>
                <Text style={styles.viewAllText}>See All</Text>
              </Pressable>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}>
              {mainServices.map((service, index) => (
                <Pressable
                  key={service.name}
                  style={({ pressed }) => [
                    styles.modernServiceCard,
                    pressed && styles.modernServiceCardPressed
                  ]}
                  onPress={() => router.push('/services')}>
                  <Image
                    source={service.image}
                    style={styles.modernServiceImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={styles.modernServiceOverlay}>
                    <View style={styles.glassBadge}>
                      <Text style={styles.glassBadgeText}>Premium</Text>
                    </View>
                    <View style={styles.modernServiceInfo}>
                      <Text style={styles.modernServiceName}>{service.name}</Text>
                      <View style={styles.exploreRow}>
                        <Text style={styles.exploreText}>Explore</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* ── Roadside Services (Grid) ────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Assistance</Text>
            </View>
            <View style={styles.gridContainer}>
              {roadsideServices.slice(0, 4).map((service, index) => (
                <View key={service.name} style={styles.gridCard}>
                  <View style={styles.gridIconBg}>
                    <Ionicons name={service.icon} size={28} color="#dc2626" />
                  </View>
                  <Text style={styles.gridCardTitle}>{service.name}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Gallery ─────────────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Our Workshop</Text>
            <View style={styles.galleryContainer}>
              <Image
                source={galleryImages.showroom}
                style={styles.galleryMain}
                contentFit="cover"
                transition={400}
              />
              <View style={styles.gallerySide}>
                <Image
                  source={galleryImages.garage}
                  style={styles.gallerySub}
                  contentFit="cover"
                  transition={400}
                />
                <Image
                  source={serviceImages.detailing}
                  style={styles.gallerySub}
                  contentFit="cover"
                  transition={400}
                />
              </View>
            </View>
          </Animated.View>

          {/* ── CTA Banner ──────────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <View style={styles.modernCta}>
              <Image 
                source={serviceImages.mechanicalRepair} 
                style={styles.modernCtaImage}
                contentFit="cover"
              />
              <View style={styles.modernCtaOverlay} />
              <View style={styles.modernCtaContent}>
                <Text style={styles.modernCtaTitle}>Ready to fix your car?</Text>
                <Text style={styles.modernCtaSubtitle}>
                  Schedule an appointment with our expert mechanics today.
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.modernCtaBtn,
                    pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
                  ]}
                  onPress={() => router.push('/appointments')}>
                  <Text style={styles.modernCtaBtnText}>Book Now</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Black behind status bar
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 10,
  },

  // Slideshow
  slideshowContainer: {
    height: 480,
    backgroundColor: '#111',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 480,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  slideContent: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 24,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  slideSubtitle: {
    color: '#dc2626',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  slideDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 24,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 30,
    gap: 12,
  },
  bookButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  bookButtonText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 15,
  },
  bookButtonIconBg: {
    backgroundColor: '#dc2626',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#dc2626',
  },

  // Welcome banner
  welcomeBanner: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  profileAvatar: {
    backgroundColor: '#111',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Emergency section
  emergencyContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emergencyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.1)',
  },
  emergencyIconBg: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTextContent: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: {
    color: '#111',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emergencyDesc: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#dc2626',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -0.5,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  viewAllText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },

  // Horizontal Scroll Cards
  horizontalScrollContent: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 8,
  },
  modernServiceCard: {
    width: 220,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modernServiceCardPressed: {
    transform: [{ scale: 0.97 }],
  },
  modernServiceImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modernServiceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  glassBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  modernServiceInfo: {
    gap: 8,
  },
  modernServiceName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exploreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  gridCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  gridIconBg: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },

  // Gallery
  galleryContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    height: 240,
    gap: 12,
  },
  galleryMain: {
    flex: 2,
    height: '100%',
    borderRadius: 20,
  },
  gallerySide: {
    flex: 1,
    gap: 12,
  },
  gallerySub: {
    flex: 1,
    borderRadius: 16,
  },

  // CTA
  modernCta: {
    marginHorizontal: 24,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modernCtaImage: {
    ...StyleSheet.absoluteFillObject,
  },
  modernCtaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
  },
  modernCtaContent: {
    alignItems: 'center',
    padding: 24,
    zIndex: 1,
  },
  modernCtaTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  modernCtaSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modernCtaBtn: {
    backgroundColor: '#111',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  modernCtaBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
