import { View, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface Props {
  video: any;
  fallback?: any;
  size?: number;
  width?: number;
  height?: number;
  loop?: boolean;
  style?: ViewStyle;
  bgColor?: string; // match the surrounding background to hide video bg
}

export default function MascotVideo({ video, fallback, size = 180, width, height, loop = true, style, bgColor = 'transparent' }: Props) {
  const w = width ?? size;
  const h = height ?? size;

  const player = useVideoPlayer(video, (p: any) => {
    p.loop = loop;
    p.muted = true;
    p.play();
  });

  return (
    <View style={[{ width: w, height: h, backgroundColor: bgColor, overflow: 'hidden' }, style]}>
      <VideoView
        player={player}
        style={{ width: w, height: h, backgroundColor: bgColor }}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}
