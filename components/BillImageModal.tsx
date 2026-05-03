import React from 'react';
import { Modal, View, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export const BillImageModal = ({ visible, imageUrl, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle" size={40} color="#fff" />
        </Pressable>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.fullImage} 
            resizeMode="contain" 
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 1 },
  fullImage: { width: '95%', height: '80%' },
});