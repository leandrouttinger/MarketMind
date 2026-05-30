import React from 'react';
import { View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface Props {
  video: any;
  fallback?: any;
  size?: number;
  loop?: boolean;
}

export default function MascotVideo({ video, size = 180, loop = true }: Props) {
  return (
    <View style={{ width: size, height: size, backgroundColor: '#0F0F0F' }}>
      <Video
        source={video}
        style={{ width: size, height: size }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={loop}
        isMuted
        useNativeControls={false}
      />
    </View>
  );
}
