import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BOOKINGS_URL } from "../../constants/api";
import { useAuth } from "../../context/AuthContext";

export default function ManageBookings() {
  const router = useRouter();
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = useCallback(
    async () => {
      try {
        setLoading(true);
        const tokenStr = token || (await AsyncStorage.getItem("token"));

        const res = await fetch(BOOKINGS_URL, {
          headers: { Authorization: `Bearer ${tokenStr}` },
        });

        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          Alert.alert("Error", "Failed to load bookings");
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Network request failed");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const filteredBookings = bookings.filter((item: any) => {
    if (!selectedDate) return true; // Show all if no date selected
    if (!item.scheduledDate) return false;
    const bookingDate = new Date(item.scheduledDate);
    
    return (
      bookingDate.getFullYear() === selectedDate.getFullYear() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getDate() === selectedDate.getDate()
    );
  });


  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      const tokenStr = token || (await AsyncStorage.getItem("token"));

      const res = await fetch(`${BOOKINGS_URL}/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStr}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        Alert.alert("Success", `Booking status updated to ${newStatus}`);
        fetchBookings(); // Refresh list
      } else {
        Alert.alert("Error", "Failed to update booking status");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Network request failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderBookingItem = ({ item }: { item: any }) => {
    const canComplete =
      item.status !== "Completed" && item.status !== "Cancelled";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bookingId}>
              #{item._id.slice(-6).toUpperCase()}
            </Text>
            <Text style={styles.timeText}>
              {item.scheduledDate
                ? new Date(item.scheduledDate).toLocaleDateString()
                : "Date TBD"}{" "}
              - {item.scheduledTime}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue}>
              {item.customerId?.fullName || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>
              {item.customerId?.phone || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="car-outline" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Vehicle:</Text>
            <Text style={styles.detailValue}>
              {item.vehicleId &&
              typeof item.vehicleId === "object" &&
              item.vehicleId.make
                ? `${item.vehicleId.make} ${item.vehicleId.model} (${item.vehicleId.licensePlate})`
                : item.vehicleId
                  ? `ID: ...${String(item.vehicleId).slice(-6)}`
                  : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Services:</Text>
            <Text style={styles.detailValue}>
              {Array.isArray(item.serviceType)
                ? item.serviceType.join(", ")
                : item.serviceType}
            </Text>
          </View>
          {item.notes && (
            <View style={[styles.detailRow, { alignItems: "flex-start" }]}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#6b7280"
                style={{ marginTop: 2 }}
              />
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={[styles.detailValue, { flex: 1 }]}>
                {item.notes}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#6b7280" />
            <Text style={styles.detailLabel}>Total:</Text>
            <Text
              style={[
                styles.detailValue,
                { fontWeight: "bold", color: "#111827" },
              ]}
            >
              LKR {item.price}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewBtn]}
            onPress={() => setSelectedBooking(item)}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>

          {canComplete ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.completeBtn,
                updatingId === item._id && { opacity: 0.5 },
              ]}
              onPress={() => updateBookingStatus(item._id, "Completed")}
              disabled={updatingId === item._id}
            >
              <Text style={styles.actionButtonText}>Service Done</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.noActionText}>
                {item.status === "Completed"
                  ? "Service Completed"
                  : "Cancelled"}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#fef3c7";
      case "Pending Payment":
        return "#fff7ed";
      case "Confirmed":
        return "#dcfce7";
      case "Assigned":
        return "#e0e7ff";
      case "Completed":
        return "#f3f4f6";
      case "Cancelled":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  };

  if (selectedBooking) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedBooking(null)}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Summary</Text>
        </View>
        <View style={{ padding: 20 }}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Booking ID</Text>
            <Text style={styles.summaryValue}>#{selectedBooking._id.slice(-6).toUpperCase()}</Text>

            <Text style={styles.summaryLabel}>Customer</Text>
            <Text style={styles.summaryValue}>{selectedBooking.customerId?.fullName || "N/A"}</Text>
            
            <Text style={styles.summaryLabel}>Phone</Text>
            <Text style={styles.summaryValue}>{selectedBooking.customerId?.phone || "N/A"}</Text>
            
            <Text style={styles.summaryLabel}>Vehicle</Text>
            <Text style={styles.summaryValue}>
              {selectedBooking.vehicleId && typeof selectedBooking.vehicleId === "object" && selectedBooking.vehicleId.make
                ? `${selectedBooking.vehicleId.make} ${selectedBooking.vehicleId.model} (${selectedBooking.vehicleId.licensePlate})`
                : selectedBooking.vehicleId
                  ? `ID: ...${String(selectedBooking.vehicleId).slice(-6)}`
                  : "N/A"}
            </Text>

            <Text style={styles.summaryLabel}>Services</Text>
            <Text style={styles.summaryValue}>
              {Array.isArray(selectedBooking.serviceType)
                ? selectedBooking.serviceType.join(", ")
                : selectedBooking.serviceType}
            </Text>

            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>
              {selectedBooking.scheduledDate
                ? new Date(selectedBooking.scheduledDate).toDateString()
                : "Date TBD"}{" "}
              - {selectedBooking.scheduledTime}
            </Text>

            {selectedBooking.notes && (
              <>
                <Text style={styles.summaryLabel}>Notes</Text>
                <Text style={styles.summaryValue}>{selectedBooking.notes}</Text>
              </>
            )}

            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={[styles.summaryValue, { color: '#c0392b' }]}>
              LKR {selectedBooking.price}
            </Text>
            
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={styles.summaryValue}>
              {selectedBooking.status}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Appointments</Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Viewing for:</Text>
        <TouchableOpacity
          style={styles.datePickerBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#dc2626" />
          <Text style={styles.dateText}>
            {selectedDate ? selectedDate.toDateString() : "All Appointments"}
          </Text>
          {selectedDate ? (
            <TouchableOpacity onPress={() => setSelectedDate(null)} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          )}
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Fetching appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#e5e7eb" />
              <Text style={styles.emptyText}>
                No appointments found for this date.
              </Text>
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
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  filterSection: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  filterLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 12,
  },
  datePickerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  timeText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "bold",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    width: 70,
    marginLeft: 6,
  },
  detailValue: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  paymentBtn: {
    backgroundColor: "#16a34a",
  },
  completeBtn: {
    backgroundColor: "#4f46e5",
  },
  viewBtn: {
    backgroundColor: "#4b5563",
  },
  summaryCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: { 
    fontSize: 14, 
    color: '#7f8c8d', 
    marginBottom: 4, 
    marginTop: 12 
  },
  summaryValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0d0d0f' 
  },
  noActionText: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: "#9ca3af",
    fontSize: 16,
  },
});
