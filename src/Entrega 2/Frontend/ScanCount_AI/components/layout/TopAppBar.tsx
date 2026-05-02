import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import { Icon } from '../ui/Icon';

const StyledView = styled(View);
const StyledText = styled(Text);

export const TopAppBar = () => {
  return (
    <StyledView className="bg-slate-950/80 backdrop-blur-md flex-row justify-between items-center h-16 px-6 w-full fixed top-0 z-50 border-b border-white/10 shadow-lg">
      <StyledView className="flex-row items-center gap-4">
        <StyledText className="text-xl font-black tracking-tighter text-purple-500 shadow-neon-primary">
          ScanCount AI
        </StyledText>
      </StyledView>
      
      <StyledView className="flex-row items-center gap-6">
        <Pressable className="active:scale-95">
          <Icon name="dark-mode" size={20} color="#94a3b8" />
        </Pressable>
        <Pressable className="active:scale-95 relative">
          <Icon name="notifications" size={20} color="#94a3b8" />
          <StyledView className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full" />
        </Pressable>
        <Pressable className="active:scale-95">
          <Icon name="apps" size={20} color="#94a3b8" />
        </Pressable>
        <StyledView className="h-8 w-8 rounded-full overflow-hidden border border-purple-500/50">
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VKY80CIekS3frp0JLmk9zt3o0AIsiu1y0fKMRV69tDytJ0zPApwB0IRCjrWUadBaV5tk_gKPm-uPBsz8jDP-kDCjfVlEPreB_i8Wed-mZJpvUn_bJNKsAZyz-wk_0tvIlpqgE_f-yWPop8AwMiEN5eD_m9e2VN1wlq-YBUDi91aDzRQWCAiLhmzsyEdf6wemhRx_4gzKz7ydpoOmSZWWWKnIZSn2DB1xm_Db5XT4r1oxnd74yd0s5DTWDi8uowTvUGbJjW09HCc' }} 
            className="w-full h-full"
          />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};
