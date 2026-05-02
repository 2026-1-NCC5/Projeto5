import React from 'react';
import { View, ScrollView, TextInput, Image, Pressable, Text } from 'react-native';
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

const ClassCard = ({ title, id, image, accuracy, detections, progress, trend, trendColor, icon, statusLabel, statusColor }: any) => (
  <GlassCard className="rounded-2xl overflow-hidden group mb-6">
    <StyledView className="h-40 relative">
      <Image source={{ uri: image }} className="w-full h-full object-cover" />
      <StyledView className="absolute inset-0 bg-black/40" />
      <StyledView className={`absolute top-4 right-4 px-3 py-1 rounded-full ${statusColor || 'bg-secondary-container'} shadow-lg`}>
        <LabelSM className={`text-[10px] font-bold ${statusColor ? 'text-white' : 'text-on-secondary-container'}`}>{statusLabel || `${accuracy}% ACURÁCIA`}</LabelSM>
      </StyledView>
      {/* Scanner Corners */}
      <StyledView className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary" />
    </StyledView>
    <StyledView className="p-6 gap-4">
      <StyledView className="flex-row justify-between items-start">
        <StyledView>
          <H3 className="text-lg">{title}</H3>
          <LabelSM className="text-slate-500 mt-1 uppercase">ID: {id}</LabelSM>
        </StyledView>
        <Icon name={icon} size={20} color="#ddb7ff" />
      </StyledView>
      <StyledView className="gap-2">
        <StyledView className="flex-row justify-between">
          <LabelSM className="text-slate-400">Detecções (24h)</LabelSM>
          <LabelSM className="text-white">{detections}</LabelSM>
        </StyledView>
        <StyledView className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <StyledView className={`h-full ${statusLabel === 'RE-TREINANDO' ? 'bg-tertiary' : 'bg-primary'} shadow-lg`} style={{ width: `${progress}%` }} />
        </StyledView>
      </StyledView>
      <StyledView className="flex-row justify-between items-center pt-2 border-t border-white/5">
        <StyledView className="flex-row items-center gap-1">
          <Icon name={trend === 'Estável' ? 'trending-flat' : 'trending-up'} size={14} color={trendColor} />
          <LabelSM className={`font-bold ${trendColor}`}>{trend}</LabelSM>
        </StyledView>
        <Pressable><LabelSM className="text-primary font-bold">DETALHES</LabelSM></Pressable>
      </StyledView>
    </StyledView>
  </GlassCard>
);

export default function ClassesPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <StyledView>
              <H1>Gerenciamento de Classes</H1>
              <BodyMD className="mt-2 max-w-xl">Configure e otimize as categorias de reconhecimento de IA para inventário em tempo real.</BodyMD>
            </StyledView>
            <Button title="Nova Classe" icon={<Icon name="add" size={20} color="#400071" />} />
          </StyledView>

          {/* Filters */}
          <GlassCard className="p-4 rounded-2xl flex-row items-center gap-4 mb-8">
            <StyledView className="relative flex-1">
              <StyledView className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Icon name="search" size={18} color="#64748b" />
              </StyledView>
              <StyledTextInput 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white" 
                placeholder="Buscar classes..." 
                placeholderTextColor="#64748b"
              />
            </StyledView>
            <StyledView className="hidden md:flex flex-row items-center gap-2">
               <Button title="Todas" variant="primary" className="py-1.5 px-4 rounded-full h-auto" />
               <Button title="Ativas" variant="glass" className="py-1.5 px-4 rounded-full h-auto" />
            </StyledView>
          </GlassCard>

          {/* Classes Grid */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            <StyledView className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
              <ClassCard 
                title="Eletrônicos" id="CLASS_ELE_01" image="https://lh3.googleusercontent.com/aida-public/AB6AXuAmCZUhXo2bOYneSNFnWrZS6c40nr61w6W7CmuRj9HdI1ePx3B6nwzeVpd7CGoO5TEgE3i9bL1MURaKE4pLbaYDrGx9BKGtIaVgfplICoEuA7xD_oo7AsHnUDmgUsw83ahzHQzAFb8VLjeDXGKzOWs6yAXmlSMO7un7kQS86AsXgQOKPTQQ03PVvhOU6T0sEwc1PI3i5c6iDpHYkVxV9fRvZOVInJ0FVzxuSxKls9UM80zNDlzoRPk3_9S5ZSjQEBqpcyjU0C0EdXQ"
                accuracy={98.4} detections="12,402" progress={85} trend="+5.2%" trendColor="text-green-400" icon="bolt"
              />
            </StyledView>
            <StyledView className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
              <ClassCard 
                title="Vestuário" id="CLASS_VES_04" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDMi6uXKZJHpgJbk2sepNAOwrop68PIC2u_Z_GimtzHUSIJJ6LLW6-qYoGzowqUl8aV9PZ6GH9IJUOdLlTBlCKzY1VeHiGwzEBhKSzhbEGXbkdWhTPJTR2Xt_iaGHhOQoYbw161SKSad7QBDpB_9IOJKMFZEQFCUp_kNr_-IlUsyE8NVJnz831Yfon5uVGC226A78jzw-aTx3K240zbZH_SI-gPyUG1L_11yxI_F1eQdnEmufU5XCUJNCZXNA0eunk0C11nWN34aCk"
                accuracy={92.1} detections="8,941" progress={62} trend="Estável" trendColor="text-slate-400" icon="check-circle"
              />
            </StyledView>
            <StyledView className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
              <ClassCard 
                title="Auto-Peças" id="CLASS_AUT_22" image="https://lh3.googleusercontent.com/aida-public/AB6AXuD0iR7rsOpyu15heYYwx8T-08C4b6ZeLfViulp8SgeFsQVBjW9JuzyBU4YLNz7eyIIDeSJs_zzhj8ZmI4SMXBEiPJpa4Yts9BMF7PMY-veRP1SklMhF3aQsSP-L6XnltqGFngoDX0-ipBi60daOpTa-k-3Jz7igt3tfhvaPkhcVqrLKYRsx6OkAbw2Z-DKk8a8pGpXROHnSnsziFYAo_DdE54ZqqBRRHXrLgerkPHCWU4TUhOMXHzOCZ9AWl8sGN2ZrN44egfqxE-U"
                statusLabel="RE-TREINANDO" statusColor="bg-tertiary" detections="-" progress={45} trend="2h restantes" trendColor="text-tertiary" icon="sync"
              />
            </StyledView>
            <StyledView className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
              <ClassCard 
                title="Alimentos" id="CLASS_ALI_09" image="https://lh3.googleusercontent.com/aida-public/AB6AXuCO4xHKUAt3kBiPb1VeMeolOhuH7x_62vrxtyJMQxFLXffru1Yi6VQELg9RCo5DH9pdhJ4JM7Rx0asz2eWk1g3CSeY7bIY8EKFm--FgA0vAVH4V6rJmkHT2Lb-CIBFR6k-0CxKPn4e4ppDIwbbWqJ2ksr5UH78OAgCCBT0dGiRXiq5tjP_kQD9oLthNZY3FcA7EvYOwMJAxoVjYrvj3YpRJXbhb6mYhp1qyFj9kuDy_MX_PyjpSAg5s88JjK6MdCAvtykrI0X9X9tE"
                accuracy={99.1} detections="45,102" progress={95} trend="+12.8%" trendColor="text-green-400" icon="verified"
              />
            </StyledView>
          </StyledView>

          {/* Bottom Stats */}
          <StyledView className="flex-row flex-wrap -m-3">
            <StyledView className="w-full md:w-1/3 p-3">
              <GlassCard className="p-6 border-l-4 border-primary">
                <LabelSM className="text-slate-500 uppercase tracking-widest">Total de Classes</LabelSM>
                <StyledView className="flex-row items-end gap-3 mt-2">
                  <StyledText className="text-4xl font-bold text-white">42</StyledText>
                  <LabelSM className="text-primary font-bold mb-1">+3 este mês</LabelSM>
                </StyledView>
              </GlassCard>
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <GlassCard className="p-6 border-l-4 border-secondary">
                <LabelSM className="text-slate-500 uppercase tracking-widest">Acurácia Média</LabelSM>
                <StyledView className="flex-row items-end gap-3 mt-2">
                  <StyledText className="text-4xl font-bold text-white">95.8%</StyledText>
                  <LabelSM className="text-secondary font-bold mb-1">Otimizado</LabelSM>
                </StyledView>
              </GlassCard>
            </StyledView>
            <StyledView className="w-full md:w-1/3 p-3">
              <GlassCard className="p-6 border-l-4 border-tertiary">
                <LabelSM className="text-slate-500 uppercase tracking-widest">Em Treinamento</LabelSM>
                <StyledView className="flex-row items-end gap-3 mt-2">
                  <StyledText className="text-4xl font-bold text-white">04</StyledText>
                  <LabelSM className="text-tertiary font-bold mb-1">Processando...</LabelSM>
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
