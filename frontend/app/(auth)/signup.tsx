import { useState } from "react";
import { API } from "../../constants/api";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (formData.phone.length !== 10 || !formData.phone.startsWith("0")) {
      Alert.alert("Invalid input", "Please enter a valid phone number (e.g., 0712345678)");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    
    try {
      const response = await fetch(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ API Register success!");
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.push("/(auth)/login") }
        ]);
      } else {
        Alert.alert("Registration Failed", data.message || "An error occurred");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ── Header Area ────────────────────────────────────────────────── */}
          <View style={styles.headerContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="car" size={38} color="#dc2626" />
            </View>
            <Text style={styles.brandName}>MOTOHUB</Text>
            <Text style={styles.welcomeText}>Create your account</Text>
          </View>

          {/* ── Signup Card ────────────────────────────────────────────────── */}
          <View style={styles.signupCard}>
            <Text style={styles.cardTitle}>Sign Up</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({...formData, fullName: text})}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="0712345678"
                  placeholderTextColor="#9ca3af"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text.replace(/\D/g, "").slice(0, 10)})}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeToggle}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeToggle}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
              <Text style={styles.signupBtnText}>Create Account</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dc2626',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : 'serif',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.9,
  },
  signupCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeToggle: {
    padding: 8,
  },
  signupBtn: {
    backgroundColor: '#dc2626',
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  signupBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '800',
  },
});
