import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import {
  deletePayment,
  getAllPayments,
  updatePaymentStatus,
} from "../services/paymentsService";

type Payment = {
  _id: string;
  bookingId: string;
  amount: number;
  status: "Paid" | "Pending";
  paymentDate: string;
  notes?: string;
};

const statusOptions: Array<"All" | "Paid" | "Pending"> = ["All", "Paid", "Pending"];

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Paid" | "Pending">("All");

  const fetchPayments = async (showLoader = true, nextStatus?: "All" | "Paid" | "Pending") => {
    try {
      if (showLoader) setLoading(true);
      setFetchError("");

      const statusToUse = nextStatus ?? selectedStatus;
      const params: Record<string, string> = {};

      if (statusToUse !== "All") params.status = statusToUse;
      if (search.trim()) params.search = search.trim();

      const res = await getAllPayments(params);
      setPayments(res?.data?.data || []);
    } catch (error: any) {
      const msg =
        (error as any).friendlyMessage ||
        error?.response?.data?.message ||
        "Failed to fetch payments.";
      setFetchError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [selectedStatus])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPayments(false);
  };

  const handleClearFilters = async () => {
    setSearch("");
    setSelectedStatus("All");
    await fetchPayments(false, "All");
  };

  const changeStatus = async (id: string, status: "Paid" | "Pending") => {
    try {
      await updatePaymentStatus(id, status);
      Alert.alert("Success", `Payment marked as ${status}`);
      await fetchPayments(false);
    } catch (error: any) {
      const msg =
        (error as any).friendlyMessage ||
        error?.response?.data?.message ||
        "Failed to update payment.";
      Alert.alert("Error", msg);
    }
  };

  const removePayment = async (id: string) => {
    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((p) => p._id !== id));
      Alert.alert("Success", "Payment deleted successfully");
    } catch (error: any) {
      const msg =
        (error as any).friendlyMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Network Error: Cannot reach server";
      Alert.alert("Error", msg);
    }
  };

  const summary = useMemo(() => {
    const totalPayments = payments.length;
    const paidCount = payments.filter((item) => item.status === "Paid").length;
    const pendingCount = payments.filter((item) => item.status === "Pending").length;
    const totalRevenue = payments
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return { totalPayments, paidCount, pendingCount, totalRevenue };
  }, [payments]);

  const renderPaymentCard = ({ item }: { item: Payment }) => {
    const isPaid = item.status === "Paid";

    return (
      <View className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">Booking ID</Text>
            <Text className="mt-1 text-base font-bold text-slate-900">{item.bookingId}</Text>
          </View>

          <View className={`rounded-full px-3 py-1 ${isPaid ? "bg-emerald-100" : "bg-amber-100"}`}>
            <Text className={`text-xs font-bold ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
              {item.status}
            </Text>
          </View>
        </View>

        <View className="mb-3 rounded-2xl bg-slate-50 p-3">
          <Text className="text-xs text-slate-500">Amount</Text>
          <Text className="mt-1 text-2xl font-extrabold text-slate-900">
            Rs. {Number(item.amount).toFixed(2)}
          </Text>
        </View>

        <View className="gap-1">
          <Text className="text-sm text-slate-600">
            Payment Date:{" "}
            <Text className="font-semibold text-slate-800">
              {new Date(item.paymentDate).toLocaleDateString()}
            </Text>
          </Text>

          {!!item.notes && (
            <Text className="text-sm text-slate-600">
              Notes: <Text className="font-semibold text-slate-800">{item.notes}</Text>
            </Text>
          )}
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() => changeStatus(item._id, isPaid ? "Pending" : "Paid")}
            className={`rounded-2xl px-4 py-3 ${isPaid ? "bg-amber-500" : "bg-emerald-600"}`}
          >
            <Text className="font-semibold text-white">
              {isPaid ? "Mark Pending" : "Mark as Paid"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => removePayment(item._id)}
            className="rounded-2xl bg-rose-600 px-4 py-3"
          >
            <Text className="font-semibold text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={renderPaymentCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            <View className="mb-5 rounded-[28px] bg-slate-900 p-5">
              <Text className="text-sm font-medium text-slate-300">Payment Management</Text>

              <TouchableOpacity
                onPress={() => router.push("/create-payment")}
                className="mt-5 rounded-2xl bg-blue-600 px-4 py-4"
              >
                <Text className="text-center text-base font-bold text-white">
                  + Create New Payment
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-5 flex-row flex-wrap justify-between gap-y-3">
              <View className="w-[48.5%] rounded-3xl bg-white p-4 shadow-sm">
                <Text className="text-xs uppercase tracking-wide text-slate-500">
                  Total Payments
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-slate-900">
                  {summary.totalPayments}
                </Text>
              </View>

              <View className="w-[48.5%] rounded-3xl bg-white p-4 shadow-sm">
                <Text className="text-xs uppercase tracking-wide text-slate-500">
                  Paid Count
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-emerald-600">
                  {summary.paidCount}
                </Text>
              </View>

              <View className="w-[48.5%] rounded-3xl bg-white p-4 shadow-sm">
                <Text className="text-xs uppercase tracking-wide text-slate-500">
                  Pending Count
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-amber-500">
                  {summary.pendingCount}
                </Text>
              </View>

              <View className="w-[48.5%] rounded-3xl bg-white p-4 shadow-sm">
                <Text className="text-xs uppercase tracking-wide text-slate-500">
                  Paid Revenue
                </Text>
                <Text className="mt-2 text-xl font-extrabold text-slate-900">
                  Rs. {summary.totalRevenue.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-3 text-lg font-bold text-slate-900">Search & Filter</Text>

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by Booking ID"
                placeholderTextColor="#94a3b8"
                className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
              />

              <View className="mb-3 flex-row flex-wrap gap-2">
                {statusOptions.map((status) => {
                  const isActive = selectedStatus === status;

                  return (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setSelectedStatus(status)}
                      className={`rounded-full px-4 py-2 ${
                        isActive ? "bg-slate-900" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          isActive ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => fetchPayments(false)}
                  className="flex-1 rounded-2xl bg-blue-600 py-4"
                >
                  <Text className="text-center font-bold text-white">Apply</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClearFilters}
                  className="flex-1 rounded-2xl bg-slate-200 py-4"
                >
                  <Text className="text-center font-bold text-slate-800">Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="mb-3 text-lg font-bold text-slate-900">Payment Records</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="mt-12 items-center">
              <ActivityIndicator size="large" color="#2563eb" />
              <Text className="mt-3 text-slate-500">Loading payments...</Text>
            </View>
          ) : fetchError ? (
            <View className="mt-10 rounded-3xl bg-white p-6">
              <Text className="text-center text-xl font-bold text-rose-600">
                Connection Error
              </Text>
              <Text className="mt-2 text-center leading-6 text-slate-500">
                {fetchError}
              </Text>
              <TouchableOpacity
                onPress={() => fetchPayments(true)}
                className="mt-5 rounded-2xl bg-blue-600 py-4"
              >
                <Text className="text-center font-bold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-10 rounded-3xl bg-white p-6">
              <Text className="text-center text-xl font-bold text-slate-900">
                No payments found
              </Text>
              <Text className="mt-2 text-center leading-6 text-slate-500">
                Create a payment or change your search and filter options.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}