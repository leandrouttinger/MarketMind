import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface Props {
  video: any;       // require('../assets/videos/xxx.mp4')
  fallback: any;    // require('../assets/mascots/xxx.png')
  size?: number;
  style?: ViewStyle | ImageStyle | any;
  loop?: boolean;
}

export default function MascotVideo({ video, fallback, size = 180, style, loop = true }: Props) {
  return (
    <Video
      source={video}
      style={[{ width: size, height: size }, style]}
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay
      isLooping={loop}
      isMuted
      useNativeControls={false}
    />
  );
}
