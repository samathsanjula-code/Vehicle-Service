import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, busy: 0 });

  useFocusEffect(
    useCallback(() => {
      // Fetch mechanics for stats
      const fetchMechanics = async () => {
        try {
          const res = await fetch('http://192.168.2.96:5000/api/mechanics', { // UPDATE IP TO YOURS
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStats({
              total: data.length,
              available: data.filter((m: any) => m.availability === 'Available').length,
              busy: data.filter((m: any) => m.availability === 'Busy').length,
            });
          }
        } catch (e) {
          console.log(e);
        }
      };
      fetchMechanics();
    }, [token])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage mechanics and optimize operations</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={{ color: '#dc2626', fontWeight: 'bold', marginRight: 4 }}>Logout</Text>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="people" size={24} color="#dc2626" />
            </View>
            <Text style={styles.statLabel}>Total Mechanics</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            </View>
            <Text style={styles.statLabel}>Available Now</Text>
            <Text style={styles.statValue}>{stats.available}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="time" size={24} color="#d97706" />
            </View>
            <Text style={styles.statLabel}>Busy</Text>
            <Text style={styles.statValue}>{stats.busy}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="cash" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.statLabel}>Revenue Today</Text>
            <Text style={styles.statValue}>LKR 125K</Text>
          </View>
        </View>

        {/* Navigation Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(admin)/manage-mechanics')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="build" size={28} color="#dc2626" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Manage Mechanics</Text>
              <Text style={styles.actionDesc}>View, edit, and remove mechanics</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(admin)/add-mechanic')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#ffedd5' }]}>
              <Ionicons name="person-add" size={28} color="#ea580c" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Add Mechanic</Text>
              <Text style={styles.actionDesc}>Register a new mechanic profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(admin)/assign-mechanics')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="calendar" size={28} color="#4f46e5" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Assign Mechanics</Text>
              <Text style={styles.actionDesc}>Link available mechanics to bookings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          {/* Quick Actions athule anthimata meka add karanna */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(admin)/manage-approvals' as any)}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#f5f3ff' }]}>
              <Ionicons name="checkmark-done-circle" size={28} color="#7c3aed" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Service Approvals</Text>
              <Text style={styles.actionDesc}>Approve or reject user service bills</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#dc2626',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  actionsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 13,
    color: '#6b7280',
  },
});
