import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

type Vehicle = {
  _id: string;
  vehicleDetails: {
    brand: string;
    model: string;
    year: string;
    regNumber: string;
    category: string;
    fuelType?: string;
    mileage?: string;
  };
  customerDetails?: {
    fullName: string;
    contactNumber: string;
  };
  owner: {
    fullName: string;
    phone: string;
  };
  image?: string;
  status?: string;
};

export default function ManageVehiclesScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API.adminVehicles, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(data);
        setFilteredVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching admin vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to permanently remove this vehicle from the fleet?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API.vehicles}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                setVehicles(prev => prev.filter(v => v._id !== id));
                setFilteredVehicles(prev => prev.filter(v => v._id !== id));
              }
            } catch (e) {
              console.error('Delete failed:', e);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/add-vehicle',
      params: { editId: id }
    });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }
    const query = text.toLowerCase();
    const filtered = vehicles.filter(v => 
      v.vehicleDetails.regNumber.toLowerCase().includes(query) ||
      v.vehicleDetails.brand.toLowerCase().includes(query) ||
      v.vehicleDetails.model.toLowerCase().includes(query) ||
      v.vehicleDetails.category.toLowerCase().includes(query) ||
      v.owner.fullName.toLowerCase().includes(query)
    );
    setFilteredVehicles(filtered);
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.regNumber}>{item.vehicleDetails.regNumber}</Text>
          <Text style={styles.vehicleModel}>{item.vehicleDetails.brand} {item.vehicleDetails.model}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
             <Text style={styles.categoryText}>{item.vehicleDetails.category?.toUpperCase() || 'N/A'}</Text>
          </View>
          <View style={styles.statusBadge}>
             <Text style={styles.statusText}>{item.status || 'Healthy'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            {item.customerDetails?.fullName || item.owner?.fullName || 'Unknown Owner'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            {item.customerDetails?.contactNumber || item.owner?.phone || 'No Phone'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="speedometer-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{item.vehicleDetails.mileage ? `${item.vehicleDetails.mileage} km` : 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]} 
          onPress={() => handleEdit(item._id)}
        >
          <Ionicons name="create-outline" size={18} color="#2563eb" />
          <Text style={styles.editBtnText}>Edit Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]} 
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
          <Text style={styles.deleteBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Fleet Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by plate, owner, or brand..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          renderItem={renderVehicleItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={64} color="#e5e7eb" />
              <Text style={styles.emptyText}>No vehicles found</Text>
            </View>
          }
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backBtn: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
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
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  regNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 1,
    marginBottom: 2,
  },
  vehicleModel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  editBtn: {
    backgroundColor: '#eff6ff',
  },
  editBtnText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: '#fef2f2',
  },
  deleteBtnText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9ca3af',
  },
});
