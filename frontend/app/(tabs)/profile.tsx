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
import Animated, { FadeInDown } from 'react-native-reanimated';
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
        <View style={styles.lockIconBox}>
          <Ionicons name="lock-closed" size={40} color="#dc2626" />
        </View>
        <Text style={styles.authTitle}>Sign in to your profile</Text>
        <Pressable style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>Log In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Profile Header --- */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.fullName[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email.toLowerCase()}</Text>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={12} color="#dc2626" />
            <Text style={styles.badgeText}>VERIFIED OWNER</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* --- Garage Section --- */}
          <Text style={styles.sectionLabel}>My Garage</Text>
          <View style={styles.garageGrid}>
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]} 
              onPress={() => router.push('/add-vehicle')}>
              <View style={[styles.iconBox, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="add-circle" size={26} color="#dc2626" />
              </View>
              <Text style={styles.actionLabel}>Add Vehicle</Text>
              <Text style={styles.actionSub}>Register new</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]} 
              onPress={() => router.push('/service-history')}>
              <View style={[styles.iconBox, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="car-sport" size={26} color="#dc2626" />
              </View>
              <Text style={styles.actionLabel}>My Fleet</Text>
              <Text style={styles.actionSub}>Manage cars</Text>
            </Pressable>
          </View>

          {/* --- Loyalty Progress --- */}
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyHeader}>
              <View style={styles.trophyIcon}>
                <Ionicons name="trophy" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.loyaltyTitle}>Loyalty Program</Text>
                <Text style={styles.loyaltyPoints}>{loyaltyPoints} Points</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: `${Math.min((loyaltyPoints/1000)*100, 100)}%` }]} />
            </View>
            <Text style={styles.progressNote}>{1000 - loyaltyPoints} more points to Silver status</Text>
          </View>

          {/* --- Settings List --- */}
          <Text style={styles.sectionLabel}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem icon="person-outline" label="Account Details" />
            <SettingItem icon="calendar-outline" label="My Appointments" onPress={() => router.push('/appointments')} />
            <SettingItem icon="notifications-outline" label="Notifications" />
            <SettingItem icon="log-out-outline" label="Logout" color="#dc2626" onPress={logout} isLast />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({ icon, label, color = "#1f2937", onPress, isLast }: any) {
  return (
    <Pressable style={[styles.settingItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
      <View style={styles.settingIconBg}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 40 },
  
  headerCard: { 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: { 
    width: 88, 
    height: 88, 
    borderRadius: 44, 
    backgroundColor: '#dc2626', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  name: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#fef2f2', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#dc2626', letterSpacing: 0.5 },

  mainContent: { padding: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 },
  
  garageGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  actionCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  actionSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  loyaltyCard: { 
    backgroundColor: '#1e293b', 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  loyaltyHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  trophyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center' },
  loyaltyTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  loyaltyPoints: { color: '#fff', fontSize: 22, fontWeight: '900' },
  progressContainer: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#dc2626' },
  progressNote: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10, fontWeight: '500' },

  settingsContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#f1f5f9' },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  settingIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600' },

  lockIconBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  authTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 24 },
  loginBtn: { backgroundColor: '#dc2626', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 16 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
