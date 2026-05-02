import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Icon } from '../ui/Icon';
import { Link } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const NavItem = ({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) => (
  <Link href={href} asChild>
    <Pressable>
      <StyledView className={`flex-row items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-purple-500/10 border-r-2 border-purple-500 shadow-inner' : 'hover:bg-white/5'}`}>
        <Icon name={icon} size={18} color={active ? '#c084fc' : '#64748b'} />
        <StyledText className={`font-h3 text-[10px] uppercase tracking-widest ${active ? 'text-purple-400 font-bold' : 'text-slate-500'}`}>
          {label}
        </StyledText>
      </StyledView>
    </Pressable>
  </Link>
);

export const SideNavBar = () => {
  return (
    <StyledView className="fixed left-0 top-0 h-screen flex flex-col pt-20 pb-6 z-40 bg-slate-950/90 backdrop-blur-xl w-64 border-r border-white/10 shadow-2xl hidden md:flex">
      <StyledView className="px-6 mb-8 flex-row items-center gap-3">
        <StyledView className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary items-center justify-center shadow-neon-primary">
          <Icon name="token" size={14} color="#490080" />
        </StyledView>
        <StyledView>
          <StyledText className="text-lg font-bold text-white leading-none">Acme Corp</StyledText>
          <StyledText className="text-[10px] uppercase tracking-widest text-slate-500 font-h3">Plano Enterprise</StyledText>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1 px-4">
        <StyledText className="text-slate-500 text-[10px] uppercase tracking-widest px-2 mb-2 font-bold">Principal</StyledText>
        <NavItem icon="dashboard" label="Home" href="/dashboard" />
        <NavItem icon="repeat" label="Cycles" href="/novo-desafio" />
        <NavItem icon="school" label="Classes" href="/classes" />
        <NavItem icon="group" label="Groups" href="/equipe" />
        <NavItem icon="inventory" label="Catalog" href="/catalogo" />
        <NavItem icon="photo-camera" label="AI Checkout" href="/checkout" />
        <NavItem icon="leaderboard" label="Ranking" href="/ranking" />
        <NavItem icon="payments" label="Finance" href="/financeiro" />
        <NavItem icon="person" label="Alunos" href="/alunos" />
      </StyledScrollView>

      <StyledView className="px-4 mt-auto gap-4">
        <Pressable className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg items-center shadow-neon-primary active:scale-95 transition-all">
          <StyledText className="text-white text-[10px] uppercase font-bold tracking-widest">
            Upgrade Power
          </StyledText>
        </Pressable>
        
        <StyledView className="gap-1">
          <NavItem icon="settings" label="Settings" href="/settings" />
          <NavItem icon="help" label="Support" href="/support" />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};
