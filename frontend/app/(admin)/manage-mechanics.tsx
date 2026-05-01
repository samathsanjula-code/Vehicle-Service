import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManageMechanics() {
  const router = useRouter();
  const { token } = useAuth();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingMechanic, setEditingMechanic] = useState<any>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const fetchMechanics = async () => {
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      const res = await fetch(API.mechanics, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMechanics(data);
      } else {
        console.error('Failed to load mechanics:', await res.text());
        Alert.alert('Error', 'Could not load mechanics');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not load mechanics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this mechanic?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const tokenStr = token || await AsyncStorage.getItem('token');
            const res = await fetch(`${API.mechanics}/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${tokenStr}` }
            });
            if (res.ok) {
              setMechanics(prev => prev.filter(m => m._id !== id));
            } else {
              Alert.alert('Error', 'Failed to delete mechanic');
            }
          } catch (e) {
            Alert.alert('Error', 'Network request failed');
          }
        }
      }
    ]);
  };

  const handleEditSave = async () => {
    if (!editingMechanic) return;
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      const res = await fetch(`${API.mechanics}/${editingMechanic._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenStr}` 
        },
        body: JSON.stringify(editingMechanic)
      });
      if (res.ok) {
        const updated = await res.json();
        setMechanics(prev => prev.map(m => m._id === updated._id ? updated : m));
        setEditingMechanic(null);
        Alert.alert('Success', 'Mechanic updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update mechanic');
      }
    } catch (e) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const tokenStr = token || await AsyncStorage.getItem('token');
      const res = await fetch(`${API.mechanics}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenStr}` 
        },
        body: JSON.stringify({ availability: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setMechanics(prev => prev.map(m => m._id === id ? updated : m));
        setStatusDropdownOpen(null);
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (e) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return { bg: '#dcfce7', text: '#16a34a' };
      case "Busy": return { bg: '#fef3c7', text: '#d97706' };
      case "Offline": return { bg: '#f3f4f6', text: '#6b7280' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Mechanics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {mechanics.length === 0 ? (
          <Text style={styles.emptyText}>No mechanics registered yet.</Text>
        ) : (
          mechanics.map((mechanic) => {
            const statusConfig = getStatusColor(mechanic.availability);
            return (
              <View key={mechanic._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.name}>{mechanic.name}</Text>
                    <Text style={styles.specialization}>{mechanic.specialization}</Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setEditingMechanic({...mechanic})}>
                      <Ionicons name="pencil" size={18} color="#2563eb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#fee2e2'}]} onPress={() => handleDelete(mechanic._id)}>
                      <Ionicons name="trash" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{mechanic.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="star-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{mechanic.level} • {mechanic.experience}</Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={[styles.statusText, { color: statusConfig.text }]}>{mechanic.availability}</Text>
                  </View>

                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity 
                      style={styles.changeStatusBtn}
                      onPress={() => setStatusDropdownOpen(statusDropdownOpen === mechanic._id ? null : mechanic._id)}
                    >
                      <Text style={styles.changeStatusText}>Change Status</Text>
                      <Ionicons name="chevron-down" size={14} color="#6b7280" />
                    </TouchableOpacity>

                    {statusDropdownOpen === mechanic._id && (
                      <View style={styles.statusDropdown}>
                        {['Available', 'Busy', 'Offline'].map(s => (
                          <TouchableOpacity 
                            key={s} 
                            style={styles.statusOption}
                            onPress={() => updateStatus(mechanic._id, s)}
                          >
                            <Text style={{ color: '#1f2937', fontSize: 13 }}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editingMechanic} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Mechanic</Text>
              <TouchableOpacity onPress={() => setEditingMechanic(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {editingMechanic && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                  style={styles.input} 
                  value={editingMechanic.name} 
                  onChangeText={(t) => setEditingMechanic({...editingMechanic, name: t})} 
                />

                <Text style={styles.label}>Specialization</Text>
                <TextInput 
                  style={styles.input} 
                  value={editingMechanic.specialization} 
                  onChangeText={(t) => setEditingMechanic({...editingMechanic, specialization: t})} 
                />

                <Text style={styles.label}>Phone</Text>
                <TextInput 
                  style={styles.input} 
                  value={editingMechanic.phone} 
                  onChangeText={(t) => setEditingMechanic({...editingMechanic, phone: t})} 
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Experience</Text>
                <TextInput 
                  style={styles.input} 
                  value={editingMechanic.experience} 
                  onChangeText={(t) => setEditingMechanic({...editingMechanic, experience: t})} 
                />

                <Text style={styles.label}>Level</Text>
                <View style={styles.buttonRow}>
                  {['Junior', 'Senior', 'Expert'].map(lvl => (
                    <TouchableOpacity 
                      key={lvl}
                      style={[styles.radioBtn, editingMechanic.level === lvl && styles.radioBtnActive]}
                      onPress={() => setEditingMechanic({...editingMechanic, level: lvl})}
                    >
                      <Text style={[styles.radioText, editingMechanic.level === lvl && styles.radioTextActive]}>{lvl}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleEditSave}>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  changeStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    gap: 4,
  },
  changeStatusText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusDropdown: {
    position: 'absolute',
    bottom: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    minWidth: 100,
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  radioBtnActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
  },
  radioText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  radioTextActive: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
