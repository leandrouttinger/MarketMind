import React, { useRef } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface Props {
  video: any;
  fallback: any;
  size?: number;
  width?: number;
  height?: number;
  loop?: boolean;
  style?: ViewStyle;
}

export default function MascotVideo({ video, fallback, size = 180, width, height, loop = true, style }: Props) {
  const w = width ?? size;
  const h = height ?? size;

  const player = useVideoPlayer(video, p => {
    p.loop = loop;
    p.muted = true;
    p.play();
  });

  return (
    <View style={[{ width: w, height: h }, style]}>
      <VideoView
        player={player}
        style={{ width: w, height: h }}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}
