import React from 'react';
import { View, ScrollView, TextInput, Image, Pressable, Text } from 'react-native';
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
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

const DetectionItem = ({ title, id, count, icon, type }: any) => (
  <GlassCard className={`p-4 rounded-lg group mb-4 ${type === 'warning' ? 'border-orange-500/30 bg-orange-500/5' : 'hover:border-purple-500/50'}`}>
    <StyledView className="flex-row justify-between items-start mb-3">
      <StyledView className="flex-row items-center gap-3">
        <StyledView className={`w-10 h-10 rounded items-center justify-center ${type === 'warning' ? 'bg-orange-500/20' : 'bg-white/5'}`}>
          <Icon name={icon} size={20} color={type === 'warning' ? '#fb923c' : '#ddb7ff'} />
        </StyledView>
        <StyledView>
          <StyledText className={`text-sm font-bold ${type === 'warning' ? 'text-orange-200' : 'text-white'}`}>{title}</StyledText>
          <StyledText className={`text-xs ${type === 'warning' ? 'text-orange-500/70' : 'text-slate-500'}`}>{id}</StyledText>
        </StyledView>
      </StyledView>
      <Pressable>
        <Icon name={type === 'warning' ? 'close' : 'delete'} size={18} color={type === 'warning' ? '#fb923c' : '#64748b'} />
      </Pressable>
    </StyledView>
    <StyledView className="flex-row justify-between items-center bg-black/40 p-2 rounded">
      <LabelSM className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">{type === 'warning' ? 'Confirmar Quantidade?' : 'Quantidade'}</LabelSM>
      <StyledView className="flex-row items-center gap-4">
        <Pressable className="w-8 h-8 items-center justify-center rounded border border-white/10"><StyledText className="text-slate-300">-</StyledText></Pressable>
        <StyledText className={`text-lg font-black ${type === 'warning' ? 'text-white' : 'text-purple-400'}`}>{count}</StyledText>
        <Pressable className="w-8 h-8 items-center justify-center rounded border border-white/10"><StyledText className="text-slate-300">+</StyledText></Pressable>
      </StyledView>
    </StyledView>
  </GlassCard>
);

export default function CorrecaoPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <StyledView>
              <H1>Fluxo de Correção</H1>
              <BodyMD>Ajuste as detecções da IA antes da finalização do inventário.</BodyMD>
            </StyledView>
            <StyledView className="flex-row gap-4">
              <GlassCard className="px-4 py-2 rounded-lg flex-row items-center gap-3 border-purple-500/30 h-auto">
                <Icon name="check-circle" size={18} color="#ddb7ff" />
                <StyledView>
                  <LabelSM className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Confiança</LabelSM>
                  <StyledText className="text-sm font-bold text-purple-300">98.4%</StyledText>
                </StyledView>
              </GlassCard>
              <GlassCard className="px-4 py-2 rounded-lg flex-row items-center gap-3 border-orange-500/30 h-auto">
                <Icon name="warning" size={18} color="#fb923c" />
                <StyledView>
                  <LabelSM className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pendentes</LabelSM>
                  <StyledText className="text-sm font-bold text-orange-300">03 Itens</StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>
          </StyledView>

          {/* Main Grid */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            {/* Visual Feed */}
            <StyledView className="w-full lg:w-7/12 p-3">
              <GlassCard className="rounded-xl overflow-hidden relative h-[500px]">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGbD4CACUp63Yg8jDihhjRjcwJ_5xswbmiy1ZfX8Jpb0ia77XmsGl9FUcZWz-dgoihO9z2dj4EV8S5V0oVLYdDGjhljQ669pKHkbJXEcL5q0UsNQYYQ4pW5dEBr1GptUb27EDUW_GJNevuVD1Izj_1MfmgWyexhhG_rUKWIo6pXhkwjJN87-Zxlg8UjDMuSJMc1zWMc3UAd1d5660zz4Go0SBsPJZ6tBWdGUFqJ239zXc-_Do80wM1Yn9NFP2yrg6eBTHD8eWVkfE' }} 
                  className="w-full h-full object-cover opacity-60"
                />
                <StyledView className="absolute inset-0 bg-black/20" />
                
                {/* Bounding Boxes */}
                <StyledView className="absolute border-2 border-primary" style={{ top: '20%', left: '15%', width: 120, height: 120 }}>
                  <StyledView className="absolute -top-7 left-0 bg-primary px-2 py-0.5 rounded-full"><StyledText className="text-[10px] font-bold text-white">Caixa_A (12)</StyledText></StyledView>
                </StyledView>
                <StyledView className="absolute border-2 border-secondary" style={{ top: '30%', left: '65%', width: 100, height: 140 }}>
                  <StyledView className="absolute -top-7 left-0 bg-secondary px-2 py-0.5 rounded-full"><StyledText className="text-[10px] font-bold text-white">Dúvida_AI</StyledText></StyledView>
                </StyledView>

                {/* Indicators */}
                <StyledView className="absolute bottom-6 left-6 flex-row gap-4">
                  <StyledView className="flex-row items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full border border-white/10">
                    <StyledView className="w-2 h-2 rounded-full bg-green-500" />
                    <LabelSM className="text-[10px] font-bold text-slate-300">LIVE FEED ACTIVE</LabelSM>
                  </StyledView>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Correction Panel */}
            <StyledView className="w-full lg:w-5/12 p-3">
              <GlassCard className="p-6 h-full">
                <StyledView className="flex-row justify-between items-center mb-6">
                  <H3>Lista de Detecção</H3>
                  <LabelSM className="text-slate-500 font-bold uppercase tracking-widest">Total: 48 Itens</LabelSM>
                </StyledView>
                
                <StyledScrollView className="flex-1 pr-2 max-h-[350px]">
                  <DetectionItem title="Lote #882 - Componentes G" id="ID: CN-8820-X" count={12} icon="inventory" />
                  <DetectionItem title="Possível Falso Positivo" id="Confiança Baixa (64%)" count={1} icon="help-outline" type="warning" />
                  <DetectionItem title="Unidade de Carga V4" id="ID: UV-441-A" count={35} icon="package" />
                </StyledScrollView>

                <StyledView className="mt-6 pt-6 border-t border-white/10">
                  <Button title="Confirmar Checkout AI" className="py-4" />
                  <StyledText className="text-center text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-tighter">
                    Sincronizar com o ERP global
                  </StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>
          </StyledView>

          {/* Metrics */}
          <StyledView className="flex-row flex-wrap -m-3">
            <StyledView className="w-full md:w-1/4 p-3">
              <GlassCard className="p-4">
                <LabelSM className="text-slate-500 font-bold uppercase tracking-widest mb-1">Tempo de Scan</LabelSM>
                <StyledView className="flex-row items-end gap-2">
                  <StyledText className="text-2xl font-black text-white">1.4s</StyledText>
                  <StyledText className="text-[10px] text-green-400 mb-1">(-0.2s)</StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>
            <StyledView className="w-full md:w-1/4 p-3">
              <GlassCard className="p-4">
                <LabelSM className="text-slate-500 font-bold uppercase tracking-widest mb-1">Identificados</LabelSM>
                <StyledView className="flex-row items-end gap-2">
                  <StyledText className="text-2xl font-black text-white">4,812</StyledText>
                  <StyledText className="text-[10px] text-purple-400 mb-1">HOJE</StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>
            <StyledView className="w-full md:w-1/4 p-3">
              <GlassCard className="p-4 border-l-4 border-primary">
                <LabelSM className="text-slate-500 font-bold uppercase tracking-widest mb-1">Performance AI</LabelSM>
                <StyledView className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <StyledView className="h-full bg-primary" style={{ width: '88%' }} />
                </StyledView>
                <StyledText className="text-right text-[10px] font-bold mt-1 text-primary">88% Eficiência</StyledText>
              </GlassCard>
            </StyledView>
            <StyledView className="w-full md:w-1/4 p-3">
              <GlassCard className="p-4 border-l-4 border-secondary">
                <LabelSM className="text-slate-500 font-bold uppercase tracking-widest mb-1">Ranking Turno</LabelSM>
                <StyledView className="flex-row items-center gap-2 mt-1">
                  <Icon name="military-tech" size={18} color="#fbabff" />
                  <StyledText className="text-sm font-bold text-white">#2 Global</StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <MobileBottomNav />
    </StyledView>
  );
}
