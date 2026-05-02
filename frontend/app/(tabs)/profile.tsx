import { Image } from 'expo-image';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { API } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loyaltyPoints, setLoyaltyPoints] = useState(user?.loyaltyPoints || 0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUser();
      }
    }, [user])
  );

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch(API.auth + '/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLoyaltyPoints(data.user.loyaltyPoints || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authRequiredContainer}>
          <View style={styles.lockIconCircle}>
            <Ionicons name="lock-closed" size={40} color="#dc2626" />
          </View>
          <Text style={styles.authTitle}>Authentication Required</Text>
          <Text style={styles.authSubtitle}>Please log in to access your personal garage and profile details.</Text>
          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBtnText}>Log In to Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* --- PROFILE HEADER --- */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </Text>
              </View>
            </View>
            <Pressable style={styles.editBadge} onPress={handleEditProfile}>
              <Ionicons name="camera" size={14} color="#fff" />
            </Pressable>
          </View>
          
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email.toLowerCase()}</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.membershipBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#dc2626" />
              <Text style={styles.membershipText}>
                {loyaltyPoints >= 1000 ? 'GOLD MEMBER' : 'PREMIUM USER'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* --- QUICK ACTIONS / GARAGE --- */}
        <View style={styles.contentPadding}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Text style={styles.sectionTitle}>My Garage</Text>
            <View style={styles.garageRow}>
              <Pressable 
                style={({ pressed }) => [styles.garageCard, pressed && styles.cardPressed]}
                onPress={() => router.push('/add-vehicle')}>
                <View style={[styles.iconBg, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="add-circle" size={28} color="#2563eb" />
                </View>
                <Text style={styles.cardTitle}>Add Vehicle</Text>
                <Text style={styles.cardSub}>New registration</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.garageCard, pressed && styles.cardPressed]}
                onPress={() => router.push('/service-history')}>
                <View style={[styles.iconBg, { backgroundColor: '#f0fdf4' }]}>
                  <Ionicons name="car-sport" size={28} color="#16a34a" />
                </View>
                <Text style={styles.cardTitle}>My Fleet</Text>
                <Text style={styles.cardSub}>Manage cars</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* --- LOYALTY CARD --- */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.loyaltySection}>
            <View style={styles.loyaltyCard}>
              <View style={styles.loyaltyHeader}>
                <Ionicons name="trophy" size={24} color="#fff" />
                <View>
                  <Text style={styles.loyaltyTitle}>Loyalty Rewards</Text>
                  <Text style={styles.loyaltyPoints}>{loyaltyPoints} Points Collected</Text>
                </View>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min((loyaltyPoints / 1000) * 100, 100)}%` }]} />
              </View>
              <Text style={styles.loyaltyNote}>
                {loyaltyPoints >= 1000 ? "You're a top-tier member!" : `${1000 - loyaltyPoints} more points to Gold status`}
              </Text>
            </View>
          </Animated.View>

          {/* --- SETTINGS LIST --- */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <Pressable style={styles.settingsItem}>
              <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                <Ionicons name="person-outline" size={20} color="#374151" />
              </View>
              <Text style={styles.settingText}>Personal Information</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable style={styles.settingsItem}>
              <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                <Ionicons name="notifications-outline" size={20} color="#374151" />
              </View>
              <Text style={styles.settingText}>Notification Preferences</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable style={styles.settingsItem} onPress={() => router.push('/appointments')}>
              <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                <Ionicons name="calendar-outline" size={20} color="#374151" />
              </View>
              <Text style={styles.settingText}>My Appointments</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable style={[styles.settingsItem, { borderBottomWidth: 0 }]} onPress={logout}>
              <View style={[styles.settingIcon, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              </View>
              <Text style={[styles.settingText, { color: '#dc2626' }]}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={18} color="#dc2626" />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  authRequiredContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lockIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#dc2626',
    borderStyle: 'dashed',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#dc2626',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.1)',
  },
  membershipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 1,
  },

  // Content
  contentPadding: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  garageRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  garageCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },

  // Loyalty
  loyaltySection: {
    marginBottom: 32,
  },
  loyaltyCard: {
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  loyaltyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  loyaltyPoints: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#dc2626',
    borderRadius: 5,
  },
  loyaltyNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
  },

  // Settings
  settingsSection: {
    gap: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  bottomSpacer: {
    height: 40,
  },
});
