import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="manage-mechanics" options={{ headerShown: false }} />
      <Stack.Screen name="add-mechanic" options={{ headerShown: false }} />
      <Stack.Screen name="assign-mechanics" options={{ headerShown: false }} />
      <Stack.Screen name="add-service" options={{ headerShown: false }} />
      <Stack.Screen name="manage-services" options={{ headerShown: false }} />
      <Stack.Screen name="edit-service" options={{ headerShown: false }} />
    </Stack>
  );
}
