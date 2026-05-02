import React from 'react';
import { View, ScrollView, Image, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import { H1, H2, H3, BodyMD, LabelSM, Code } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);

const StatCard = ({ icon, label, value, subvalue, colorClass }: any) => (
  <GlassCard className="p-6 flex-row items-center gap-4">
    <StyledView className={`p-3 rounded-lg ${colorClass} border`}>
      <Icon name={icon} size={24} color="currentColor" />
    </StyledView>
    <StyledView>
      <LabelSM className="text-slate-500 uppercase font-black text-[10px]">{label}</LabelSM>
      <StyledView className="flex-row items-baseline gap-2">
        <H3 className="text-2xl text-white">{value}</H3>
        {subvalue && <StyledText className="text-xs text-green-400">{subvalue}</StyledText>}
      </StyledView>
    </StyledView>
  </GlassCard>
);

const LeaderItem = ({ rank, name, stats, accuracy, active = false }: any) => (
  <StyledView className={`p-4 rounded-xl bg-white/5 border ${active ? 'border-purple-500/30' : 'border-white/5'} flex-row items-center gap-4 relative overflow-hidden`}>
    {active && <StyledView className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600" />}
    <StyledView className={`w-10 h-10 rounded-lg ${active ? 'bg-pink-500/20 border-pink-500/50' : 'bg-purple-500/20 border-purple-500/50'} items-center justify-center border`}>
      <StyledText className={`${active ? 'text-pink-500' : 'text-purple-500'} font-black`}>#{rank}</StyledText>
    </StyledView>
    <StyledView className="flex-1">
      <StyledText className="text-sm font-bold text-white">{name}</StyledText>
      <StyledText className="text-[10px] text-slate-500">{stats}</StyledText>
    </StyledView>
    <StyledView className="items-end">
      <StyledText className={`text-sm font-black ${active ? 'text-pink-500' : 'text-purple-400'}`}>{accuracy}%</StyledText>
      <StyledText className="text-[10px] text-slate-500">Acurácia</StyledText>
    </StyledView>
  </StyledView>
);

export default function DashboardPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-[1400px] mx-auto">
          {/* Header */}
          <StyledView className="flex-row justify-between items-end mb-8">
            <StyledView>
              <H1 className="mb-2">
                Visão Geral <StyledText className="text-primary">AI Intelligence</StyledText>
              </H1>
              <BodyMD>Bem-vindo de volta, Carlos. Monitorando 12 fluxos ativos em Acme Corp.</BodyMD>
            </StyledView>
            <Button 
              title="REGISTRAR COLEÇÃO" 
              icon={<Icon name="add-a-photo" size={18} color="#490080" />}
              className="hidden md:flex"
            />
          </StyledView>

          {/* Bento Grid */}
          <StyledView className="flex-row flex-wrap -m-3">
            {/* Expansion Goal */}
            <StyledView className="w-full lg:w-2/3 p-3">
              <GlassCard className="p-8 relative overflow-hidden">
                <StyledView className="absolute top-0 right-0 p-8 opacity-10">
                  <Icon name="trending-up" size={120} color="#a855f7" />
                </StyledView>
                <StyledView className="relative z-10">
                  <StyledView className="flex-row items-center gap-2 mb-6">
                    <StyledView className="w-3 h-3 rounded-full bg-secondary" />
                    <LabelSM className="text-secondary tracking-widest uppercase">Global Crowdfunding Live</LabelSM>
                  </StyledView>
                  <H2 className="text-white mb-8">Meta de Expansão de Inventário</H2>
                  
                  <StyledView className="mb-8">
                    <StyledView className="flex-row justify-between mb-2">
                      <LabelSM className="text-slate-300">Progresso de Arrecadação (BRL)</LabelSM>
                      <LabelSM className="text-white font-black">R$ 842.000 / R$ 1.000.000</LabelSM>
                    </StyledView>
                    <StyledView className="w-full h-4 bg-white/5 rounded-full p-[2px] border border-white/10">
                      <StyledView className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full w-[84%] relative" />
                    </StyledView>
                  </StyledView>

                  <StyledView className="flex-row justify-between pt-4 border-t border-white/10">
                    <StyledView>
                      <LabelSM className="text-slate-500 uppercase tracking-widest mb-1">Apoiadores</LabelSM>
                      <H3 className="text-xl">1,284</H3>
                    </StyledView>
                    <StyledView>
                      <LabelSM className="text-slate-500 uppercase tracking-widest mb-1">Dias Restantes</LabelSM>
                      <H3 className="text-xl">14</H3>
                    </StyledView>
                    <StyledView>
                      <LabelSM className="text-slate-500 uppercase tracking-widest mb-1">Eficiência AI</LabelSM>
                      <H3 className="text-xl text-purple-400">+18.4%</H3>
                    </StyledView>
                  </StyledView>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Leaders */}
            <StyledView className="w-full lg:w-1/3 p-3">
              <GlassCard className="p-6 h-full">
                <StyledView className="flex-row justify-between items-center mb-6">
                  <H3 className="text-lg">Líderes de Operação</H3>
                  <Icon name="more-vert" color="#64748b" />
                </StyledView>
                <StyledView className="gap-4">
                  <LeaderItem rank="1" name="Filial Noroeste" stats="9,240 scans hoje" accuracy="98.2" active />
                  <LeaderItem rank="2" name="Centro de Distribuição A" stats="8,102 scans hoje" accuracy="97.5" />
                  <LeaderItem rank="3" name="Unidade Sul" stats="7,550 scans hoje" accuracy="94.1" />
                </StyledView>
                <Pressable className="mt-6 items-center">
                  <LabelSM className="text-purple-400 uppercase tracking-widest">Ver Ranking Completo</LabelSM>
                </Pressable>
              </GlassCard>
            </StyledView>

            {/* Recent Collections Table Placeholder */}
            <StyledView className="w-full p-3">
              <GlassCard className="overflow-hidden">
                <StyledView className="p-6 border-b border-white/10 flex-row justify-between items-center">
                  <StyledView>
                    <H3 className="text-lg">Coleções Recentes</H3>
                    <BodyMD className="text-xs">Sincronização em tempo real via AI Checkout</BodyMD>
                  </StyledView>
                  <StyledView className="flex-row gap-2">
                    <Button title="FILTRAR" variant="glass" className="py-1 px-3" />
                    <Button title="EXPORTAR" variant="glass" className="py-1 px-3" />
                  </StyledView>
                </StyledView>
                
                {/* Simplified Table for Mobile/Web */}
                <StyledView className="p-6">
                   <StyledView className="flex-row border-b border-white/5 pb-2 mb-2">
                     <StyledView className="flex-1"><LabelSM className="text-[10px] text-slate-500 uppercase">ID</LabelSM></StyledView>
                     <StyledView className="flex-2"><LabelSM className="text-[10px] text-slate-500 uppercase">Operador</LabelSM></StyledView>
                     <StyledView className="flex-1"><LabelSM className="text-[10px] text-slate-500 uppercase">Status</LabelSM></StyledView>
                     <StyledView className="flex-1 text-right"><LabelSM className="text-[10px] text-slate-500 uppercase">Ações</LabelSM></StyledView>
                   </StyledView>
                   <StyledView className="flex-row py-3 border-b border-white/5 items-center">
                     <StyledView className="flex-1"><Code className="text-purple-400">#SCN-72819</Code></StyledView>
                     <StyledView className="flex-2 flex-row items-center gap-2">
                       <StyledView className="w-6 h-6 rounded-full bg-slate-700" />
                       <StyledText className="text-sm text-white">Marcus Lima</StyledText>
                     </StyledView>
                     <StyledView className="flex-1">
                       <StyledView className="bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded items-center">
                         <StyledText className="text-green-400 text-[10px] font-bold">CONCLUÍDO</StyledText>
                       </StyledView>
                     </StyledView>
                     <StyledView className="flex-1 items-end"><Icon name="visibility" size={18} color="#64748b" /></StyledView>
                   </StyledView>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Bottom Stats */}
            <StyledView className="w-full md:w-1/3 p-3">
              <StatCard icon="cloud-sync" label="Tempo Médio AI" value="0.42s" subvalue="(-0.05s)" colorClass="bg-blue-500/10 border-blue-500/20" />
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <StatCard icon="warning" label="Anomalias Hoje" value="03" subvalue="ver alertas" colorClass="bg-orange-500/10 border-orange-500/20" />
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <StatCard icon="payments" label="ROI Estimado" value="+R$ 12.4k" subvalue="este mês" colorClass="bg-green-500/10 border-green-500/20" />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Floating Action Button */}
      <StyledView className="fixed bottom-8 right-8 z-50">
        <Pressable className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-lg items-center justify-center active:scale-95">
          <Icon name="psychology" size={32} color="white" />
        </Pressable>
      </StyledView>

      <MobileBottomNav />
    </StyledView>
  );
}
