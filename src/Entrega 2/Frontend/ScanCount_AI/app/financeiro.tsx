import React from 'react';
import { View, ScrollView, TextInput, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import { H1, H2, H3, BodyMD, LabelSM } from '@/components/ui/Typography';
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

const TransactionRow = ({ name, id, date, amount, status }: any) => (
  <StyledView className="flex-row items-center py-4 px-6 border-b border-white/5 hover:bg-white/5">
    <StyledView className="flex-1 flex-row items-center gap-3">
      <StyledView className="w-8 h-8 rounded-lg bg-green-500/20 items-center justify-center">
        <Icon name="qr-code-2" size={16} color="#4ade80" />
      </StyledView>
      <StyledView>
        <StyledText className="font-bold text-sm text-white">{name}</StyledText>
        <StyledText className="text-[10px] text-slate-500">{id}</StyledText>
      </StyledView>
    </StyledView>
    <StyledView className="flex-1">
      <StyledText className="text-sm text-slate-400">{date}</StyledText>
    </StyledView>
    <StyledView className="flex-1 items-end">
      <StyledText className="text-sm font-bold text-white">R$ {amount}</StyledText>
    </StyledView>
    <StyledView className="flex-1 items-center">
      <StyledView className={`px-2 py-1 rounded-full border ${status === 'CONFIRMADO' ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
        <StyledText className={`text-[10px] font-black ${status === 'CONFIRMADO' ? 'text-green-400' : 'text-yellow-400'}`}>{status}</StyledText>
      </StyledView>
    </StyledView>
  </StyledView>
);

export default function FinanceiroPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="mb-8">
            <H1 className="mb-2">Módulo Financeiro</H1>
            <BodyMD>Gerencie seus depósitos via PIX e converta saldo para doações físicas.</BodyMD>
          </StyledView>

          {/* Top Stats Grid */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            {/* Balance Card */}
            <StyledView className="w-full lg:w-1/3 p-3">
              <GlassCard className="p-6 h-full relative overflow-hidden">
                <StyledView className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full" style={{ filter: 'blur(40px)' }} />
                <StyledView>
                  <LabelSM className="text-purple-400 uppercase tracking-widest">Saldo Atual</LabelSM>
                  <StyledView className="mt-2 flex-row items-baseline gap-2">
                    <H2 className="text-3xl">R$ 12.450,00</H2>
                    <StyledView className="flex-row items-center gap-1">
                      <Icon name="trending-up" size={14} color="#fabc4e" />
                      <StyledText className="text-sm text-tertiary font-bold">+12%</StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
                <StyledView className="mt-6 flex-row gap-3">
                  <Button title="Depositar PIX" className="flex-1" />
                  <Button title="Extrato" variant="glass" className="flex-1" />
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Conversion Progress */}
            <StyledView className="w-full lg:w-5/12 p-3">
              <GlassCard className="p-6 h-full">
                <StyledView className="flex-row justify-between items-start mb-6">
                  <StyledView>
                    <LabelSM className="text-secondary uppercase tracking-widest">Meta de Doação Física</LabelSM>
                    <H3 className="mt-1">840/1.000 Itens</H3>
                  </StyledView>
                  <Icon name="volunteer-activism" size={30} color="#fbabff" />
                </StyledView>
                <StyledView className="w-full bg-white/5 rounded-full h-3 mb-2 relative overflow-hidden border border-white/10">
                  <StyledView className="bg-gradient-to-r from-primary to-secondary h-full rounded-full shadow-lg" style={{ width: '84%' }} />
                </StyledView>
                <StyledView className="flex-row justify-between">
                  <LabelSM className="text-slate-500 font-bold">PROGRESSO TOTAL</LabelSM>
                  <LabelSM className="text-secondary font-bold">84% CONCLUÍDO</LabelSM>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* AI Insights */}
            <StyledView className="w-full lg:w-1/4 p-3">
              <GlassCard className="p-6 h-full border-l-4 border-tertiary">
                <StyledView className="flex-row items-center gap-2 mb-2">
                  <Icon name="auto-awesome" size={18} color="#fabc4e" />
                  <LabelSM className="text-tertiary font-bold uppercase tracking-widest">IA Insight</LabelSM>
                </StyledView>
                <BodyMD className="text-sm leading-relaxed text-on-surface-variant">
                  Seu ritmo de conversão aumentou. Projeção de atingir a meta em <StyledText className="text-tertiary font-bold">4 dias</StyledText>.
                </BodyMD>
                <StyledView className="mt-4 pt-4 border-t border-white/5">
                  <Pressable><LabelSM className="text-purple-400 font-bold">Ver otimizações de taxa</LabelSM></Pressable>
                </StyledView>
              </GlassCard>
            </StyledView>
          </StyledView>

          {/* Main Workspace */}
          <StyledView className="flex-row flex-wrap -m-3">
            {/* Logs */}
            <StyledView className="w-full lg:w-2/3 p-3">
              <StyledView className="flex-row justify-between items-center mb-6 px-1">
                <H3>Logs de Depósito PIX</H3>
                <StyledView className="flex-row gap-2">
                  <Button title="Todos" variant="glass" className="py-1 px-3" />
                  <Button title="Hoje" variant="primary" className="py-1 px-3" />
                </StyledView>
              </StyledView>
              <GlassCard className="rounded-2xl overflow-hidden">
                <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <StyledView className="min-w-[600px]">
                    <StyledView className="flex-row bg-white/5 border-b border-white/10 px-6 py-4">
                      <StyledView className="flex-1"><LabelSM className="uppercase tracking-widest text-xs text-slate-400">Origem</LabelSM></StyledView>
                      <StyledView className="flex-1"><LabelSM className="uppercase tracking-widest text-xs text-slate-400">Data/Hora</LabelSM></StyledView>
                      <StyledView className="flex-1 items-end"><LabelSM className="uppercase tracking-widest text-xs text-slate-400">Valor</LabelSM></StyledView>
                      <StyledView className="flex-1 items-center"><LabelSM className="uppercase tracking-widest text-xs text-slate-400">Status</LabelSM></StyledView>
                    </StyledView>
                    <TransactionRow name="João Silva" id="****.452.189-**" date="Hoje, 14:20" amount="450,00" status="CONFIRMADO" />
                    <TransactionRow name="Empresa Beta LTDA" id="**.541.222/0001-**" date="Hoje, 11:05" amount="2.100,00" status="CONFIRMADO" />
                    <TransactionRow name="Maria Oliveira" id="****.112.558-**" date="Hoje, 10:45" amount="15,00" status="PENDENTE" />
                  </StyledView>
                </StyledScrollView>
              </GlassCard>
            </StyledView>

            {/* Conversion Tool */}
            <StyledView className="w-full lg:w-1/3 p-3">
              <H3 className="mb-6 px-1">Converter para Doação</H3>
              <GlassCard className="p-6 relative overflow-hidden">
                <StyledView className="absolute top-0 right-0 p-4 opacity-10">
                  <Icon name="inventory" size={60} color="#eadfed" />
                </StyledView>
                <StyledView className="gap-6">
                  <StyledView className="gap-2">
                    <LabelSM className="text-slate-500 font-bold uppercase">Tipo de Item</LabelSM>
                    <StyledView className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <StyledText className="text-sm text-white">Cestas Básicas (Alimento)</StyledText>
                    </StyledView>
                  </StyledView>
                  
                  <StyledView className="gap-2">
                    <LabelSM className="text-slate-500 font-bold uppercase">Valor do Saldo (R$)</LabelSM>
                    <StyledView className="relative">
                      <StyledTextInput 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white" 
                        placeholder="0,00" 
                        placeholderTextColor="#64748b"
                      />
                      <LabelSM className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">MAX: 12k</LabelSM>
                    </StyledView>
                  </StyledView>

                  <StyledView className="bg-white/5 rounded-xl p-4 flex-row items-center justify-between">
                    <StyledText className="text-sm font-medium text-white">Equivale a:</StyledText>
                    <StyledText className="text-2xl font-bold text-secondary">0 <StyledText className="text-sm font-normal">itens</StyledText></StyledText>
                  </StyledView>

                  <Button title="Confirmar Conversão" icon={<Icon name="sync" size={18} color="#400071" />} />
                </StyledView>
              </GlassCard>

              {/* Feed */}
              <GlassCard className="mt-6 p-6">
                <LabelSM className="text-slate-400 uppercase tracking-widest font-bold mb-4">Impacto Recente</LabelSM>
                <StyledView className="gap-6">
                  <StyledView className="flex-row gap-4">
                    <StyledView className="w-1 h-10 bg-secondary rounded-full" />
                    <StyledView>
                      <StyledText className="text-xs font-bold text-white">120 Cestas Básicas enviadas</StyledText>
                      <StyledText className="text-[10px] text-slate-500">Ontem às 18:30 • Regional Sul</StyledText>
                    </StyledView>
                  </StyledView>
                  <StyledView className="flex-row gap-4">
                    <StyledView className="w-1 h-10 bg-primary rounded-full" />
                    <StyledView>
                      <StyledText className="text-xs font-bold text-white">Conversão de Saldo: R$ 4.500,00</StyledText>
                      <StyledText className="text-[10px] text-slate-500">2 dias atrás • Hub Central</StyledText>
                    </StyledView>
                  </StyledView>
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
