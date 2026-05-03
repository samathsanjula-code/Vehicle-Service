import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isSharedPage = segments[0] === 'add-vehicle' || segments[0] === 'booking' || segments[0] === 'payment' || segments[0] === 'service-history'; 

    if (!user && !inAuthGroup) {
      // Redirect to login if not logged in and not in auth group
      router.replace('/(auth)/login');
    } else if (user) {
      if (user.isAdmin && !inAdminGroup && !isSharedPage) {
        // Admins should be in admin group unless on a shared page
        router.replace('/(admin)');
      } else if (!user.isAdmin && !inTabsGroup && !inAuthGroup && !isSharedPage) {
        // Regular users should be in tabs group unless on a shared page
        router.replace('/(tabs)/home');
      } else if (inAuthGroup) {
        // If logged in but somehow on login page, redirect to appropriate home
        router.replace(user.isAdmin ? '/(admin)' : '/(tabs)/home');
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
