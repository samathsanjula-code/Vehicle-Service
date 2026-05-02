import { Image } from 'expo-image';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loyaltyPoints, setLoyaltyPoints] = useState(user?.loyaltyPoints || 0);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchUser();
    }, [user])
  );

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch(API.auth + '/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLoyaltyPoints(data.user.loyaltyPoints || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="person-circle-outline" size={80} color="#e5e7eb" />
        <Text style={styles.authTitle}>Guest Mode</Text>
        <Pressable style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Profile Info --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.fullName[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email.toLowerCase()}</Text>
          <Pressable style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* --- Garage Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>My Garage</Text>
          <View style={styles.row}>
            <Pressable style={styles.actionCard} onPress={() => router.push('/add-vehicle')}>
              <View style={[styles.iconBox, { backgroundColor: '#f0f7ff' }]}>
                <Ionicons name="add" size={24} color="#007bff" />
              </View>
              <Text style={styles.actionLabel}>Add Vehicle</Text>
            </Pressable>
            <Pressable style={styles.actionCard} onPress={() => router.push('/service-history')}>
              <View style={[styles.iconBox, { backgroundColor: '#f0fff4' }]}>
                <Ionicons name="car" size={24} color="#28a745" />
              </View>
              <Text style={styles.actionLabel}>My Fleet</Text>
            </Pressable>
          </View>
        </View>

        {/* --- Loyalty --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Rewards</Text>
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyTop}>
              <Ionicons name="ribbon" size={20} color="#ffc107" />
              <Text style={styles.loyaltyText}>Loyalty Points</Text>
              <Text style={styles.pointsValue}>{loyaltyPoints}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min((loyaltyPoints/1000)*100, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* --- Settings --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Settings</Text>
          <View style={styles.settingsGroup}>
            <SettingItem icon="calendar-outline" label="My Appointments" onPress={() => router.push('/appointments')} />
            <SettingItem icon="notifications-outline" label="Notifications" />
            <SettingItem icon="help-circle-outline" label="Help & Support" />
            <SettingItem icon="log-out-outline" label="Logout" color="#dc3545" onPress={logout} isLast />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({ icon, label, color = "#4b5563", onPress, isLast }: any) {
  return (
    <Pressable style={[styles.settingItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  profileSection: { alignItems: 'center', paddingVertical: 40 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#111827' },
  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  editBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  editBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },

  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 16 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },

  loyaltyCard: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  loyaltyTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  loyaltyText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827', marginLeft: 8 },
  pointsValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  progressTrack: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#ffc107', borderRadius: 3 },

  settingsGroup: { backgroundColor: '#fff', borderRadius: 16, borderWeight: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', marginLeft: 16 },

  authTitle: { fontSize: 18, fontWeight: '600', color: '#4b5563', marginBottom: 24 },
  loginBtn: { backgroundColor: '#111827', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
