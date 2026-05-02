import React from 'react';
import { View, ScrollView, TextInput, Image, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';
import { H1, H3, BodyLG, LabelSM, Code } from '@/components/ui/Typography';
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

const MiniStat = ({ label, value, icon, colorClass }: any) => (
  <GlassCard className="p-6 rounded-2xl flex-row items-center justify-between">
    <StyledView>
      <LabelSM className="text-slate-400 uppercase tracking-widest mb-1">{label}</LabelSM>
      <H3 className="text-white">{value}</H3>
    </StyledView>
    <StyledView className={`h-12 w-12 rounded-xl ${colorClass} items-center justify-center`}>
      <Icon name={icon} size={30} color="currentColor" />
    </StyledView>
  </GlassCard>
);

const CatalogRow = ({ item, category, weight, ean, status, statusColor, avatar }: any) => (
  <StyledView className="flex-row items-center py-4 px-6 border-b border-white/5 hover:bg-white/5">
    <StyledView className="flex-[3] flex-row items-center gap-4">
      <StyledView className="h-12 w-12 rounded-lg bg-surface-container-highest p-1 border border-outline-variant overflow-hidden">
        <Image source={{ uri: avatar }} className="h-full w-full rounded-md" />
      </StyledView>
      <StyledView>
        <StyledText className="font-bold text-white text-sm">{item}</StyledText>
        <StyledText className="text-xs text-slate-500">{category}</StyledText>
      </StyledView>
    </StyledView>
    <StyledView className="flex-[2] items-center">
      <StyledView className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant">
        <LabelSM className="text-slate-300 text-[11px] font-bold">{category}</LabelSM>
      </StyledView>
    </StyledView>
    <StyledView className="flex-1 items-end">
      <Code className="text-on-surface">{weight}</Code>
    </StyledView>
    <StyledView className="flex-[2] items-center gap-2 flex-row justify-center">
      <Icon name="barcode" size={14} color="#64748b" />
      <Code className="text-primary/80">{ean}</Code>
    </StyledView>
    <StyledView className="flex-[2] items-center flex-row gap-2">
      <Icon name="check-circle" size={14} color={statusColor} />
      <LabelSM className={`text-[11px] font-bold uppercase tracking-wider text-[${statusColor}]`}>{status}</LabelSM>
    </StyledView>
    <StyledView className="flex-1 flex-row justify-center gap-2">
      <Pressable className="h-8 w-8 rounded-lg items-center justify-center active:bg-white/10">
        <Icon name="edit" size={16} color="#64748b" />
      </Pressable>
      <Pressable className="h-8 w-8 rounded-lg items-center justify-center active:bg-red-500/10">
        <Icon name="delete" size={16} color="#64748b" />
      </Pressable>
    </StyledView>
  </StyledView>
);

export default function CatalogoPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <StyledView>
              <StyledView className="flex-row items-center gap-2 mb-2">
                <StyledView className="h-2 w-2 rounded-full bg-primary" />
                <LabelSM className="text-primary uppercase tracking-widest">Inventário em Tempo Real</LabelSM>
              </StyledView>
              <H1>Catálogo de Itens</H1>
              <BodyLG className="text-on-surface-variant max-w-2xl">Gerencie os produtos autorizados para detecção por IA no ciclo atual de inventário industrial.</BodyLG>
            </StyledView>
            <Button title="Clonar do Ciclo Anterior" variant="glass" icon={<Icon name="history" size={18} color="#ddb7ff" />} />
          </StyledView>

          {/* Mini Bento Stats */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            <StyledView className="w-full md:w-1/3 p-3">
              <MiniStat label="Itens Ativos" value="128" icon="inventory" colorClass="bg-purple-500/20 text-purple-400" />
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <MiniStat label="Total EANs" value="432" icon="barcode" colorClass="bg-blue-500/20 text-blue-400" />
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <MiniStat label="Sincronização" value="100%" icon="sync" colorClass="bg-green-500/20 text-green-400" />
            </StyledView>
          </StyledView>

          {/* Table Container */}
          <GlassCard className="rounded-2xl overflow-hidden">
            {/* Search & Actions */}
            <StyledView className="p-6 border-b border-white/10 flex-col md:flex-row items-center justify-between gap-4">
              <StyledView className="relative w-full md:max-w-md">
                <StyledView className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Icon name="search" size={18} color="#64748b" />
                </StyledView>
                <StyledTextInput 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-4 py-3 text-sm text-white" 
                  placeholder="Pesquisar por nome ou EAN..."
                  placeholderTextColor="#64748b"
                />
              </StyledView>
              <StyledView className="flex-row gap-3 w-full md:w-auto">
                <Button title="Filtros" variant="glass" className="flex-1 md:flex-none" icon={<Icon name="filter-list" size={16} color="#eadfed" />} />
                <Button title="Novo Item" className="flex-1 md:flex-none" icon={<Icon name="add" size={16} color="#400071" />} />
              </StyledView>
            </StyledView>

            {/* Table (Simplified for mobile/web) */}
            <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StyledView className="min-w-[800px]">
                <StyledView className="flex-row bg-white/5 border-b border-white/10 px-6 py-4">
                  <StyledView className="flex-[3]"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Item</LabelSM></StyledView>
                  <StyledView className="flex-[2] items-center"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Categoria</LabelSM></StyledView>
                  <StyledView className="flex-1 items-end"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Peso (Kg)</LabelSM></StyledView>
                  <StyledView className="flex-[2] items-center"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Código EAN-13</LabelSM></StyledView>
                  <StyledView className="flex-[2] items-center"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Status IA</LabelSM></StyledView>
                  <StyledView className="flex-1 items-center"><LabelSM className="uppercase tracking-widest text-[10px] text-slate-400">Ações</LabelSM></StyledView>
                </StyledView>
                
                <CatalogRow 
                  item="Arroz Agulhinha T1" category="Alimentos Secos" weight="5.000" ean="7891020304050" 
                  status="Treinado" statusColor="#4ade80" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAzk2TRzRnZ5EzPCb3EEavTqbcZXYAKLU7ihCtdB7BlguKbHKTYR8VBY1TLcr9OWfYI5ax4EH2y35s-wJLxQHmSH7TaaKzksIWIFjsbtMf-lxsXbWi-ZtVGlKAMS5gt0yCkbjcdmtSQ4jp3AY6A_WEWSxscrPephzKd2WkF39zW6_v6F_kdhbHSaXeQWCGa-S-y6pHhEgH29L_Aky7DbrwACQW-LjtUHo_ZK1okQuB5CvH-XgxQ3pR52Xn_7AUPfQk_DyNW0IMi1vc"
                />
                <CatalogRow 
                  item="Feijão Preto Extra" category="Alimentos Secos" weight="1.000" ean="7892233445566" 
                  status="Treinado" statusColor="#4ade80" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuB1Z9SnvOtmPLMKURuJG7lzFgU_RVuFpCye1-cnH3GOnMeWU8scCgswoaZKYpA94COQ9V7-a1YzmkCSwyTkC_qYdEruckueaC-keBm5KTxvLrY3rjZehOp0QF34v3GmJxUpz0OT-pSQPsu5SPWJDKWIO1GA-e_BkQzru-XsVo7Vsf1Tq0zS8nhu9zncVv4-0na94GsSzWkiOk4hxpJ7n-bBrTeTgfXv1ZmDAKndj54upBG-vE3lLMNKtdY5hixUxODiX_BNN7k5vqI"
                />
              </StyledView>
            </StyledScrollView>

            {/* Pagination */}
            <StyledView className="p-6 bg-white/5 border-t border-white/10 flex-row items-center justify-between">
              <StyledText className="text-xs text-slate-500">Exibindo <StyledText className="text-white font-bold">1-4</StyledText> de <StyledText className="text-white font-bold">128</StyledText> itens</StyledText>
              <StyledView className="flex-row gap-2">
                <Button title="1" variant="primary" className="w-10 h-10 p-0" />
                <Button title="2" variant="glass" className="w-10 h-10 p-0" />
                <Button title="3" variant="glass" className="w-10 h-10 p-0" />
              </StyledView>
            </StyledView>
          </GlassCard>
        </StyledView>
      </StyledScrollView>

      {/* FAB */}
      <StyledView className="fixed bottom-8 right-8 z-50">
        <Pressable className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-lg items-center justify-center active:scale-95">
          <Icon name="qr-code-scanner" size={32} color="#400071" />
        </Pressable>
      </StyledView>

      <MobileBottomNav />
    </StyledView>
  );
}
