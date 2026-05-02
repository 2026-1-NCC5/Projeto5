import React from 'react';
import { View, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { H1, BodyMD, LabelSM, H3, Code } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

const StudentCard = ({ name, id, rank, rating, tags, efficiency, avatar, statusColor }: any) => (
  <GlassCard className="p-6 transition-all duration-300">
    <StyledView className="flex-row justify-between items-start mb-4">
      <StyledView className="relative">
        <Image 
          source={{ uri: avatar }} 
          className="w-16 h-16 rounded-xl border-2 border-primary/20"
        />
        <StyledView className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full border-2 border-surface ${statusColor} shadow-lg`} />
      </StyledView>
      <StyledView className="items-end">
        <StyledView className="px-2 py-0.5 bg-primary/10 rounded mb-1">
          <LabelSM className="text-primary text-[10px] uppercase">Rank #{rank}</LabelSM>
        </StyledView>
        <StyledView className="flex-row items-center gap-1">
          <Icon name="star" size={12} color="#fbabff" />
          <StyledView>
            <LabelSM className="text-secondary text-xs">{rating}</LabelSM>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>

    <H3 className="text-xl mb-1">{name}</H3>
    <Code className="text-xs mb-4">Matrícula: {id}</Code>
    
    <StyledView className="flex-row flex-wrap gap-2 mb-6">
      {tags.map((tag: string) => (
        <StyledView key={tag} className="px-2 py-1 bg-white/5 rounded">
          <StyledView>
            <LabelSM className="text-slate-300 text-[10px]">{tag}</LabelSM>
          </StyledView>
        </StyledView>
      ))}
    </StyledView>

    <StyledView className="space-y-3 mb-6">
      <StyledView className="flex-row justify-between items-center mb-1">
        <LabelSM className="text-[10px] uppercase text-slate-400">Eficiência de Ciclo</LabelSM>
        <LabelSM className="text-[10px] text-slate-400">{efficiency}%</LabelSM>
      </StyledView>
      <StyledView className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <StyledView 
          className="h-full bg-gradient-to-r from-primary to-secondary shadow-neon-primary" 
          style={{ width: `${efficiency}%` }} 
        />
      </StyledView>
    </StyledView>

    <Button 
      title="ENVIAR CONVITE" 
      variant="outline" 
      icon={<Icon name="person-add" size={14} color="#ddb7ff" />}
    />
  </GlassCard>
);

export default function AlunosPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-6xl mx-auto">
          {/* Header Section */}
          <StyledView className="flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <StyledView>
              <StyledView className="flex-row items-center gap-2 mb-2">
                <StyledView className="px-2 py-0.5 bg-primary-container rounded">
                  <LabelSM className="text-on-primary-container text-[10px] uppercase">Módulo Acadêmico</LabelSM>
                </StyledView>
                <StyledView><LabelSM className="text-outline text-xs">•</LabelSM></StyledView>
                <StyledView><LabelSM className="text-outline text-xs">Grupo: Equipe Beta-7</LabelSM></StyledView>
              </StyledView>
              <H1>Convidar Alunos</H1>
              <BodyMD className="max-w-xl mt-2">Busque por novos talentos para integrar o seu ciclo operacional de contagem por IA.</BodyMD>
            </StyledView>
            
            <StyledView className="flex-row gap-3">
              <Button 
                title="FILTRAR" 
                variant="glass" 
                icon={<Icon name="filter-list" size={14} color="#eadfed" />} 
              />
              <Button 
                title="CONVITES ENVIADOS (12)" 
                variant="primary" 
                icon={<Icon name="mail" size={14} color="white" />} 
              />
            </StyledView>
          </StyledView>

          {/* Search Bar */}
          <StyledView className="mb-12 relative">
            <StyledView className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20" />
            <GlassCard className="flex-row items-center px-6 py-4 rounded-2xl">
              <Icon name="search" color="#ddb7ff" className="mr-4" />
              <StyledTextInput 
                className="flex-1 text-on-background text-lg font-body-md" 
                placeholder="Pesquisar por nome, matrícula ou especialidade técnica..." 
                placeholderTextColor="#64748b"
              />
            </GlassCard>
          </StyledView>

          {/* Bento Grid */}
          <StyledView className="flex-row flex-wrap -m-3">
            <StyledView className="w-full md:w-1/2 lg:w-1/3 p-3">
              <StudentCard 
                name="Ricardo Santos"
                id="SC-2024-001"
                rank="14"
                rating="4.9"
                tags={['Logística', 'IA Vision', '+2']}
                efficiency={98}
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD4GeX3mpWdBsZRziCKbCAK3FHAXDBJTGLaLm5IxAy49-lRivkofKrEGcW5fPdwO0SMBZRMz3wJl6LQmZIAKmK-sBRdLjxuRUQxjfdii0eW28CuaqHDoreVeTwigMJ9spARg2OePoelZ-TkVeH2jn3H4zH30bxcfLj5FwvSdZj3jTj5ev4O4EXbib023tbQWHTtufE7VrgN_WEugFg1vLcxD3jJ0lKTyFwAID7BPX5NBRhC8zht84SWuMWhBMdP2-jMqeLemKzk3BI"
                statusColor="bg-green-500"
              />
            </StyledView>
            <StyledView className="w-full md:w-1/2 lg:w-1/3 p-3">
              <StudentCard 
                name="Ana Beatriz Costa"
                id="SC-2024-042"
                rank="32"
                rating="4.7"
                tags={['Estatística', 'Contagem']}
                efficiency={85}
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDkzn591jS-KNd32Dmq_0GTqCDRM5DS_hWv5NtQeiQOovELI6s7Nss8up3LhBID2d8j1cwp4bSqJP6v2fipIPFz8mg6cSiwZKDCiLzP1dbFqNRf9j6F05qI4GhyMotQg3ApYNzCrtp9w89O-KMBGmOXI0_J_fJxwbL8YRwarf-_1vMGbn571-flPV8VRdJKLYolBI1Cgv6f74hkE3Q5QlNEv9Vf0XL_nRIVgpUMT2L-yWJyE8PZJCXXeFAuAXL9T-RsFqITfDq-Xq4"
                statusColor="bg-slate-500"
              />
            </StyledView>
            <StyledView className="w-full md:w-1/2 lg:w-1/3 p-3">
              <StudentCard 
                name="Marcos Oliveira"
                id="SC-2024-118"
                rank="08"
                rating="5.0"
                tags={['Gestão', 'WMS', 'Big Data']}
                efficiency={94}
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCc2Lao-rbavSvBZZTRc7ifuFSrnLdmBHaUxXBVCvAJNcCMBqUYxuHQWB48gRqngVgjg8eueESOZXzCs0irLV_Ttv5CBdZ18wS-zwtK1L-Jeg5fICAqHaFrvBqA3rfVCoG-IaYFp4Ip-LuQIQa0eItWdndSv-iBoqzwWFD32T41nSKDFuUvHYoVNBt963jSURFNOlDZxsMj-Wuqr8lvp69P42deKwRio0ExlWyTD_KQW2mzKIMgWB-p5j8QwJayNxTi3V65O93ag6U"
                statusColor="bg-green-500"
              />
            </StyledView>
          </StyledView>

          {/* Pagination Placeholder */}
          <StyledView className="mt-12 flex-row items-center justify-between border-t border-white/10 pt-8">
            <LabelSM className="text-slate-500">Exibindo 1-5 de 248 alunos</LabelSM>
            <StyledView className="flex-row items-center gap-2">
              <Button title="1" variant="primary" className="w-10 h-10 p-0" />
              <Button title="2" variant="glass" className="w-10 h-10 p-0" />
              <Button title="3" variant="glass" className="w-10 h-10 p-0" />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <MobileBottomNav />
    </StyledView>
  );
}
