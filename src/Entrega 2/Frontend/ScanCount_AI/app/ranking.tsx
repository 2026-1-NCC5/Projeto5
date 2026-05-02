import React from 'react';
import { View, ScrollView, TextInput, Image, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import { H1, H3, BodyMD, LabelSM, Code } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

const PodiumCard = ({ rank, name, dept, accuracy, image, color, heightClass, isFirst }: any) => (
  <StyledView className={`flex-1 items-center group ${isFirst ? 'order-1 md:order-2' : rank === 2 ? 'order-2 md:order-1' : 'order-3'}`}>
    <StyledView className="relative mb-6">
      {isFirst && (
        <StyledView className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Icon name="workspace-premium" size={40} color="#fabc4e" className="shadow-neon-secondary" />
        </StyledView>
      )}
      <StyledView className={`w-${isFirst ? '32' : '24'} h-${isFirst ? '32' : '24'} rounded-full border-4 p-1 overflow-hidden shadow-lg`} style={{ borderColor: color }}>
        <Image source={{ uri: image }} className="w-full h-full rounded-full" />
      </StyledView>
      <StyledView 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-lg"
        style={{ backgroundColor: color }}
      >
        <StyledText className="text-on-primary font-black text-sm">#{rank}</StyledText>
      </StyledView>
    </StyledView>
    <GlassCard className={`w-full rounded-t-3xl p-6 items-center ${heightClass} justify-between relative overflow-hidden`} style={{ borderTopWidth: 4, borderTopColor: color }}>
      <StyledView className="items-center">
        <H3 className="text-white mb-1">{name}</H3>
        <LabelSM className="text-slate-500 uppercase tracking-widest font-bold">{dept}</LabelSM>
      </StyledView>
      <StyledView className="w-full gap-2">
        <StyledView className="flex-row justify-between">
          <LabelSM className="text-slate-400">Precisão</LabelSM>
          <LabelSM className="text-white font-bold">{accuracy}%</LabelSM>
        </StyledView>
        <StyledView className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <StyledView className="h-full rounded-full" style={{ width: `${accuracy}%`, backgroundColor: color }} />
        </StyledView>
      </StyledView>
    </GlassCard>
  </StyledView>
);

const RankRow = ({ rank, name, dept, scans, accuracy, status, avatar }: any) => (
  <StyledView className="flex-row items-center py-5 px-8 border-b border-white/5 hover:bg-white/5">
    <StyledView className="w-16">
      <Code className="text-slate-400">{rank}</Code>
    </StyledView>
    <StyledView className="flex-1 flex-row items-center gap-3">
      <StyledView className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
        <Image source={{ uri: avatar }} className="w-full h-full" />
      </StyledView>
      <StyledText className="text-sm font-bold text-white">{name}</StyledText>
    </StyledView>
    <StyledView className="flex-1">
      <StyledText className="text-xs text-slate-400">{dept}</StyledText>
    </StyledView>
    <StyledView className="flex-1">
      <Code className="text-xs text-slate-200">{scans}</Code>
    </StyledView>
    <StyledView className="flex-1 flex-row items-center gap-3">
      <StyledView className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <StyledView className="h-full bg-primary-container" style={{ width: `${accuracy}%` }} />
      </StyledView>
      <Code className="text-xs text-primary-container">{accuracy}%</Code>
    </StyledView>
    <StyledView className="w-24 items-end">
       <StyledView className={`px-2 py-1 rounded-full border ${status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-white/10'} flex-row items-center gap-1`}>
         <StyledView className={`w-1.5 h-1.5 rounded-full ${status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
         <LabelSM className={`text-[10px] font-bold uppercase ${status === 'Ativo' ? 'text-emerald-400' : 'text-slate-500'}`}>{status}</LabelSM>
       </StyledView>
    </StyledView>
  </StyledView>
);

export default function RankingPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <StyledView>
              <H1>Ranking Global</H1>
              <BodyMD>Desempenho de detecção e precisão em tempo real.</BodyMD>
            </StyledView>
            <StyledView className="flex-row p-1 glass-card rounded-xl border-white/5">
              <Button title="Geral" variant="primary" className="py-2 px-6 h-auto" />
              <Button title="Por Classe" variant="glass" className="py-2 px-6 h-auto" />
            </StyledView>
          </StyledView>

          {/* Podium */}
          <StyledView className="flex-row flex-wrap items-end gap-8 mb-16 px-4">
            <PodiumCard 
              rank={2} name="Ricardo S." dept="Logística Norte" accuracy={94.2} color="#94a3b8" heightClass="h-48"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCb2CKX5yQJEWvom3iaBfBgTZr8MFrHcUzRbCWtDtoCmmhZnv2U1Fv7TrSRzNjY4bDtzJH1W0kNLbuIhxirG40ahPZs8dIJTQHAHRqbZeOQcrMIX5RAnn5jMukzNs3vAAAFQsEbBga-HAgrE72KdTZBSKsYTdsFoBduxEH26sDPwWTLEH7oWkqrAAH960LV6HPVQ5MHBOcuBubRhDDal-GuO5e6uADDmSTFuxMduIkchHkmMe5UE1q5yq2fzA6ObMel51fVb73tQW8"
            />
            <PodiumCard 
              rank={1} name="Beatriz L." dept="Centro de Distribuição HQ" accuracy={99.8} color="#ddb7ff" heightClass="h-64" isFirst
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDG4XQaQauIw05gddWUKaTQ6WaZzNiPrc_AGzeI3drLFmQPhzaxRlSyEBXac-xEB_PLWi_1SPdcIV1J5ykL1bg2GgdGTpuolFg1yTkAfVoBF8tDvrU_-igBYTbliJ5o-kUXA1kF-jWqaFIKKrS1QwoSDsQaKgNlt12fQBpuMq1sMMvHdzi13cLr1UimInOr3XhDY-f6ppIhvGOChOQ467AL9wjSzJe4Kr8rK27IaW7VJd2E_UtC8cWjFnuGJ5c58sRpUcZHrCWTLR0"
            />
            <PodiumCard 
              rank={3} name="Carlos M." dept="Unidade Industrial B" accuracy={91.5} color="#fabc4e" heightClass="h-40"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAYGW3COwI38p04SwniO7w7evlqvVR68SGzIUEpaLWsrCzA-EdXSsoR-MPPuZi-7GimVRQKWcwp32hEFEqZvA8RujDYwxhbk475FrU08nifPWNkjLl2Vzg2Meu2HHrC0_bbMRcies39zf_Ia5hRiOvlRx9_RF1vodofRO_RBkppJAaNsnHx7ul79APXO4-Xi2ZqbahabiCUFY5ZMAGxPGCMeBW5NISBa2JdCTzPmyD3wOnG9hlVFK_T7hhnhdmhW4oRKYAwqyZKhok"
            />
          </StyledView>

          {/* Leaderboard Table */}
          <GlassCard className="rounded-2xl overflow-hidden shadow-2xl">
            <StyledView className="px-8 py-6 border-b border-white/5 flex-row justify-between items-center bg-white/5">
              <H3 className="text-lg">Classificação Geral</H3>
              <StyledView className="flex-row items-center gap-4">
                <StyledView className="relative w-64">
                  <StyledView className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Icon name="search" size={14} color="#64748b" />
                  </StyledView>
                  <StyledTextInput className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white" placeholder="Buscar operador..." placeholderTextColor="#64748b" />
                </StyledView>
                <Icon name="filter-list" size={20} color="#64748b" />
              </StyledView>
            </StyledView>

            <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StyledView className="min-w-[900px]">
                <StyledView className="flex-row border-b border-white/5 px-8 py-4">
                  <StyledView className="w-16"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Posição</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Operador</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Departamento</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Escaneamentos</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Precisão IA</LabelSM></StyledView>
                  <StyledView className="w-24 items-end"><LabelSM className="uppercase text-[10px] text-slate-500 font-black">Status</LabelSM></StyledView>
                </StyledView>
                
                <RankRow rank="04" name="Marcos Vinícius" dept="Armazém Sul" scans="12.450" accuracy={89.4} status="Ativo" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCseyNGk3Mqb9Ngr_0hnx3Vt61JyWVFtA_nwAutzBCACuFl1qVUaHia_3giEsaU2rkCU-29mZhr1sHtWJhjVgC8HVI898aAAfC86PMwD1-sU7Ia5f9Kec7WutCgqxsbXgTbBYb17aowJ3NvEqJsBGXi5Wtm3OwnRQCjZtlCkQnZARaQ4fu9S423DMlsQx8j8GcpGVUJ9mqXNPHd_CQnxbGBrq7QhK94-fe8DFKz4DjcnhcX88TDZBUvAxx03tnCBJpgQ2_mFKZedmI" />
                <RankRow rank="05" name="Ana Cláudia" dept="Logística Centro" scans="11.902" accuracy={87.1} status="Ativo" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBclzoI1F8-O2EGYtKgAtdGi4sJ1aMY3-w2M1h7JAqoGf2a5ly9DU0Q-5Zlw1ZlCu9kEWi5F06wkQ6PuNmfIFVPQfN0BzMCAeudOwuLlTwVstKUT0uB0L_0Vol41dvvh71Pnk902ldxHWhazWDXFI95662GOVYuSOeb0xm2N--8oPejbvTiFuZrCh_jZMAmqK8RuGYLOEtrxGQ1EYiEYMJRrsYrdt5ep9OILqX9SSxP2fhVwhbUHmJZvL5DIEQn64yt-i2vR02IoA" />
              </StyledView>
            </StyledScrollView>

            <StyledView className="px-8 py-4 bg-white/5 border-t border-white/10 flex-row justify-between items-center">
              <StyledText className="text-xs text-slate-500">Exibindo 6 de 142 operadores</StyledText>
              <StyledView className="flex-row gap-2">
                <Button title="<" variant="glass" className="w-10 h-10 p-0" />
                <Button title=">" variant="glass" className="w-10 h-10 p-0" />
              </StyledView>
            </StyledView>
          </GlassCard>
        </StyledView>
      </StyledScrollView>

      <MobileBottomNav />
    </StyledView>
  );
}
