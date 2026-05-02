import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { API, BOOKINGS_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout, token } = useAuth();
  const [stats, setStats] = useState({ totalMechs: 0, revenueToday: 0, totalVehicles: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      
      // Fetch mechanics for stats
      const mechRes = await fetch(API.mechanics, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
      const mechanicsData = mechRes.ok ? await mechRes.json() : [];

      // Fetch bookings for revenue
      const bookRes = await fetch(BOOKINGS_URL, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
      const bookingsData = bookRes.ok ? await bookRes.json() : [];

      // Fetch all vehicles
      const vehicleRes = await fetch(API.adminAllVehicles, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
      const vehiclesData = vehicleRes.ok ? await vehicleRes.json() : [];

      // Calculate today's revenue
      const today = new Date().toISOString().split('T')[0];
      const todaysBookings = bookingsData.filter((b: any) => 
        b.scheduledDate && b.scheduledDate.startsWith(today) && b.status !== 'Cancelled'
      );
      const revenueToday = todaysBookings.reduce((sum: number, b: any) => sum + (b.price || 0), 0);

      setStats({
        totalMechs: mechanicsData.length,
        revenueToday,
        totalVehicles: vehiclesData.length
      });
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Fleet & Service Management</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalVehicles}</Text>
            <Text style={styles.statLabel}>Total Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalMechs}</Text>
            <Text style={styles.statLabel}>Mechanics</Text>
          </View>
          <View style={[styles.statCard, { width: '100%', marginTop: 12, backgroundColor: '#1e293b' }]}>
            <Text style={[styles.statValue, { color: '#fff' }]}>LKR {stats.revenueToday}</Text>
            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.6)' }]}>Revenue Today</Text>
          </View>
        </View>

        {/* Navigation Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Management</Text>
          
          <ActionCard 
            icon="car" 
            title="Manage Vehicles" 
            desc="View all registered user vehicles" 
            color="#2563eb" 
            onPress={() => router.push('/(admin)/manage-vehicles')} 
          />

          <ActionCard 
            icon="people" 
            title="Manage Mechanics" 
            desc="Control mechanic availability" 
            color="#dc2626" 
            onPress={() => router.push('/(admin)/manage-mechanics')} 
          />

          <ActionCard 
            icon="construct" 
            title="Manage Services" 
            desc="Edit service pricing and features" 
            color="#16a34a" 
            onPress={() => router.push('/(admin)/manage-services')} 
          />

          <ActionCard 
            icon="calendar" 
            title="Assign Tasks" 
            desc="Link mechanics to bookings" 
            color="#4f46e5" 
            onPress={() => router.push('/(admin)/assign-mechanics')} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, title, desc, color, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIconBg, { backgroundColor: `${color}10` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b' },
  logoutBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: '600' },

  actionsContainer: { gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  actionIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  actionDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
