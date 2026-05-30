import React from 'react';
import { Image } from 'react-native';

interface Props {
  video: any;
  fallback: any;
  size?: number;
  loop?: boolean;
}

export default function MascotVideo({ fallback, size = 180 }: Props) {
  return (
    <Image
      source={fallback}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
