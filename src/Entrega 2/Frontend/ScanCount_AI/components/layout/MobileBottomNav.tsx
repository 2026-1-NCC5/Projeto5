import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Icon } from '../ui/Icon';
import { Link } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);

const MobileNavItem = ({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) => (
  <Link href={href} asChild>
    <Pressable className="flex-1 items-center justify-center gap-1">
      <Icon name={icon} size={24} color={active ? '#c084fc' : '#64748b'} />
      <StyledText className={`text-[9px] uppercase font-bold ${active ? 'text-purple-400' : 'text-slate-500'}`}>
        {label}
      </StyledText>
    </Pressable>
  </Link>
);

export const MobileBottomNav = () => {
  return (
    <StyledView className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md h-16 flex-row items-center justify-around z-50 shadow-2xl px-4 border-t border-white/10">
      <MobileNavItem icon="dashboard" label="Home" href="/dashboard" />
      <MobileNavItem icon="school" label="Classes" href="/classes" />
      <MobileNavItem icon="group" label="Equipe" href="/equipe" />
      <MobileNavItem icon="photo-camera" label="Scan" href="/checkout" />
      <MobileNavItem icon="payments" label="Saldo" href="/financeiro" />
    </StyledView>
  );
};
