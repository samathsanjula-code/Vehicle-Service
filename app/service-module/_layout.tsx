import { Stack } from 'expo-router';

export default function ServiceModuleLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1A1A1A',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#FAFAFA',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Service Center',
        }} 
      />
      <Stack.Screen 
        name="customer-history" 
        options={{ 
          title: 'My Service History',
        }} 
      />
      <Stack.Screen 
        name="customer-detail" 
        options={{ 
          title: 'Service Details',
        }} 
      />
      <Stack.Screen 
        name="admin-dashboard" 
        options={{ 
          title: 'Admin Dashboard',
        }} 
      />
      <Stack.Screen 
        name="admin-update" 
        options={{ 
          title: 'Update Record',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="admin-analytics" 
        options={{ 
          title: 'Service Analytics',
        }} 
      />
    </Stack>
  );
}
