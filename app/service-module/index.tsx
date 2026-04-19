import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="car-sport" size={48} color="#1A1A1A" />
        </View>
        <Text style={styles.title}>Vehicle Service Center</Text>
        <Text style={styles.subtitle}>Select your role to continue to the module</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.roleCard}
          activeOpacity={0.8}
          onPress={() => router.push('/service-module/customer-history')}
        >
          <View style={[styles.roleIcon, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="person" size={24} color="#1A73E8" />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>Customer</Text>
            <Text style={styles.roleDesc}>View your service history and details</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleCard}
          activeOpacity={0.8}
          onPress={() => router.push('/service-module/admin-dashboard')}
        >
          <View style={[styles.roleIcon, { backgroundColor: '#FCE8E6' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#D93025" />
          </View>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>Admin</Text>
            <Text style={styles.roleDesc}>Manage records and view analytics</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 14,
    color: '#666',
  },
});
