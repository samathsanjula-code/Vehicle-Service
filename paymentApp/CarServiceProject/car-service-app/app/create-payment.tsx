import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { createPayment } from "./services/paymentsService";

type PaymentStatus = "Paid" | "Pending";

// Validation rules
const BOOKING_ID_REGEX = /^[A-Za-z0-9]{5}$/;
const NOTES_REGEX = /^[A-Za-z\s]*$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

export default function CreatePaymentScreen() {
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("Pending");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Inline error states
  const [bookingIdError, setBookingIdError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [notesError, setNotesError] = useState("");

  // --- Validators ---
  const validateBookingId = (value: string) => {
    if (!value.trim()) {
      setBookingIdError("Booking ID is required.");
      return false;
    }
    if (!BOOKING_ID_REGEX.test(value.trim())) {
      setBookingIdError("Must be exactly 5 letters/numbers (e.g. CAD56).");
      return false;
    }
    setBookingIdError("");
    return true;
  };

  const validateAmount = (value: string) => {
    if (!value.trim()) {
      setAmountError("Amount is required.");
      return false;
    }
    if (!AMOUNT_REGEX.test(value.trim()) || Number(value) <= 0) {
      setAmountError("Enter a valid amount (e.g. 5000.00).");
      return false;
    }
    setAmountError("");
    return true;
  };

  const validateNotes = (value: string) => {
    if (value.trim() && !NOTES_REGEX.test(value)) {
      setNotesError("Notes must contain letters only.");
      return false;
    }
    setNotesError("");
    return true;
  };

  const handleCreatePayment = async () => {
    const isBookingIdValid = validateBookingId(bookingId);
    const isAmountValid = validateAmount(amount);
    const isNotesValid = validateNotes(notes);

    if (!isBookingIdValid || !isAmountValid || !isNotesValid) return;

    try {
      setSubmitting(true);

      await createPayment({
        bookingId: bookingId.trim().toUpperCase(),
        amount: Number(amount),
        status,
        notes: notes.trim(),
      });

      Alert.alert("Success", "Payment created successfully");
      router.replace("/(tabs)/payments");
    } catch (error: any) {
      const errorMsg =
        (error as any).friendlyMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Network Error: Cannot reach server";
      Alert.alert("Error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-[28px] bg-slate-900 p-6">
            <Text className="text-sm font-medium text-slate-300">Payment Form</Text>
          </View>

          <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">

            {/* Booking ID */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">Booking ID</Text>
            <TextInput
              placeholder="e.g. CAD56"
              placeholderTextColor="#94a3b8"
              value={bookingId}
              autoCapitalize="characters"
              maxLength={5}
              onChangeText={(text) => {
                setBookingId(text);
                if (bookingIdError) validateBookingId(text);
              }}
              onBlur={() => validateBookingId(bookingId)}
              className={`rounded-2xl border bg-slate-50 px-4 py-4 text-slate-900 ${
                bookingIdError ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {!!bookingIdError && (
              <Text className="mb-3 mt-1 text-xs text-rose-500">{bookingIdError}</Text>
            )}
            {!bookingIdError && <View className="mb-4" />}

            {/* Amount */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">Amount (LKR)</Text>
            <TextInput
              placeholder="e.g. 5000.00"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (amountError) validateAmount(text);
              }}
              onBlur={() => validateAmount(amount)}
              className={`rounded-2xl border bg-slate-50 px-4 py-4 text-slate-900 ${
                amountError ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {!!amountError && (
              <Text className="mb-3 mt-1 text-xs text-rose-500">{amountError}</Text>
            )}
            {!amountError && <View className="mb-4" />}

            {/* Status */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">Status</Text>
            <View className="mb-4 flex-row gap-3">
              {(["Pending", "Paid"] as PaymentStatus[]).map((item) => {
                const active = item === status;
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStatus(item)}
                    className={`flex-1 rounded-2xl px-4 py-4 ${
                      active ? "bg-slate-900" : "bg-slate-100"
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        active ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notes */}
            <Text className="mb-2 text-sm font-semibold text-slate-700">Notes (Optional)</Text>
            <TextInput
              placeholder="Optional notes"
              placeholderTextColor="#94a3b8"
              value={notes}
              onChangeText={(text) => {
                setNotes(text);
                if (notesError) validateNotes(text);
              }}
              onBlur={() => validateNotes(notes)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`mb-1 min-h-[110px] rounded-2xl border bg-slate-50 px-4 py-4 text-slate-900 ${
                notesError ? "border-rose-400" : "border-slate-200"
              }`}
            />
            {!!notesError && (
              <Text className="mb-4 mt-1 text-xs text-rose-500">{notesError}</Text>
            )}
            {!notesError && <View className="mb-4" />}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleCreatePayment}
              disabled={submitting}
              className={`rounded-2xl px-4 py-4 ${
                submitting ? "bg-slate-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-center text-base font-bold text-white">
                {submitting ? "Creating..." : "Create Payment"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}