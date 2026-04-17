import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EC1D23', dark: '#9b1216' }}
      headerImage={
        <View className="flex-1 justify-center items-center bg-zinc-900">
           <Image
            source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.heroImage}
            className="opacity-60"
          />
          <View className="absolute p-6 items-start">
             <View className="bg-red-600 px-3 py-1 mb-2">
                <ThemedText className="text-white text-xs font-bold uppercase tracking-widest">Premier Care</ThemedText>
             </View>
             <ThemedText type="title" className="text-white text-4xl leading-tight font-black">
                Precision Engineering For Your Masterpiece.
             </ThemedText>
             <TouchableOpacity className="mt-6 bg-red-600 px-8 py-4 flex-row items-center rounded-sm">
                <ThemedText className="text-white font-bold uppercase tracking-wider">Book Service</ThemedText>
                <Ionicons name="arrow-forward" size={18} color="white" className="ml-2" />
             </TouchableOpacity>
          </View>
        </View>
      }>
      
      <ThemedView className="p-6">
        <View className="flex-row justify-between mb-8">
           <View className="bg-zinc-50 p-6 flex-1 mr-2 rounded-lg items-center border border-zinc-100">
              <Ionicons name="checkmark-circle" size={32} color="#EC1D23" />
              <ThemedText className="text-2xl font-black mt-2">15+</ThemedText>
              <ThemedText className="text-[10px] text-zinc-500 uppercase tracking-widest">Service Centers</ThemedText>
           </View>
           <View className="bg-zinc-50 p-6 flex-1 ml-2 rounded-lg items-center border border-zinc-100">
              <Ionicons name="speedometer" size={32} color="#EC1D23" />
              <ThemedText className="text-2xl font-black mt-2">24/7</ThemedText>
              <ThemedText className="text-[10px] text-zinc-500 uppercase tracking-widest">Roadside Assist</ThemedText>
           </View>
        </View>

        <View className="mb-6">
           <ThemedText className="text-red-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Our Expertise</ThemedText>
           <View className="flex-row justify-between items-end">
              <ThemedText type="subtitle" className="text-3xl font-black">Core Services</ThemedText>
              <Link href="/services">
                 <ThemedText className="text-red-600 font-bold border-b-2 border-red-600 pb-1">View All</ThemedText>
              </Link>
           </View>
        </View>

        {[
          { title: 'Mechanical repairs', icon: 'settings-outline' },
          { title: 'Collision repairs', icon: 'car-outline' },
          { title: 'Lubrication services', icon: 'water-outline' },
          { title: 'Vehicle detailing', icon: 'color-wand-outline' },
          { title: 'Wheel alignment', icon: 'disc-outline' }
        ].map((service, idx) => (
          <TouchableOpacity key={idx} className="bg-zinc-50 p-4 rounded-xl flex-row items-center mb-4 border border-zinc-100">
             <View className="w-24 h-24 bg-zinc-200 rounded-lg mr-4 justify-center items-center">
                <Ionicons name={service.icon} size={32} color="#52525b" />
             </View>
             <View className="flex-1">
                <ThemedText className="text-lg font-bold mb-1">{service.title}</ThemedText>
                <ThemedText className="text-xs text-zinc-500 leading-5">Precision diagnostic and expert maintenance for your engine...</ThemedText>
                <View className="flex-row items-center mt-2">
                   <ThemedText className="text-red-600 text-[10px] font-bold uppercase tracking-widest mr-1">Details</ThemedText>
                   <Ionicons name="chevron-forward" size={12} color="#EC1D23" />
                </View>
             </View>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
});