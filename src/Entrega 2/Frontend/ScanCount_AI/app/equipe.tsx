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

const MemberRow = ({ name, email, role, status, avatar, date }: any) => (
  <StyledView className="flex-row items-center py-4 px-6 border-b border-white/5 hover:bg-white/5">
    <StyledView className="flex-[2] flex-row items-center gap-3">
      <StyledView className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden">
        <Image source={{ uri: avatar }} className="w-full h-full" />
      </StyledView>
      <StyledView>
        <StyledText className="font-bold text-white text-sm">{name}</StyledText>
        <StyledText className="text-xs text-slate-500">{email}</StyledText>
      </StyledView>
    </StyledView>
    <StyledView className="flex-1">
      <StyledView className={`px-3 py-1 rounded-full ${role === 'Líder' ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/10'} border items-center`}>
        <LabelSM className={`text-xs font-bold ${role === 'Líder' ? 'text-primary' : 'text-slate-300'}`}>{role}</LabelSM>
      </StyledView>
    </StyledView>
    <StyledView className="flex-1 flex-row items-center gap-2">
      <StyledView className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      <StyledText className={`text-sm ${status === 'Online' ? 'text-emerald-400' : 'text-slate-500'}`}>{status}</StyledText>
    </StyledView>
    <StyledView className="flex-1">
      <StyledText className="text-sm text-slate-500">{date}</StyledText>
    </StyledView>
    <StyledView className="flex-1 items-end">
      <Pressable className="text-slate-500"><Icon name="more-vert" size={20} color="#64748b" /></Pressable>
    </StyledView>
  </StyledView>
);

export default function EquipePage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-7xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <StyledView>
              <H1>Minha Equipe</H1>
              <BodyMD className="text-slate-500">Gerencie seus colegas e convide novos membros para o projeto AI.</BodyMD>
            </StyledView>
            <StyledView className="flex-row gap-3">
              <Button title="Compartilhar" variant="glass" icon={<Icon name="share" size={18} color="#eadfed" />} />
              <Button title="Criar Novo Grupo" icon={<Icon name="group-add" size={18} color="#400071" />} />
            </StyledView>
          </StyledView>

          {/* Bento Grid */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            {/* UUID Card */}
            <StyledView className="w-full lg:w-1/3 p-3">
              <GlassCard className="p-8 h-full relative overflow-hidden">
                <StyledView className="absolute -right-12 -top-12 w-32 h-32 bg-primary/20 rounded-full" style={{ filter: 'blur(40px)' }} />
                <StyledView className="gap-6">
                  <StyledView className="gap-2">
                    <StyledView className="flex-row items-center gap-2">
                      <Icon name="key" size={16} color="#ddb7ff" />
                      <LabelSM className="text-primary uppercase tracking-widest">Código de Convite</LabelSM>
                    </StyledView>
                    <H3>ID da Equipe</H3>
                  </StyledView>
                  <StyledView className="p-4 bg-white/5 border border-white/10 rounded-xl flex-row items-center justify-between">
                    <Code className="text-primary text-xs">550e8400-e29b-41d4-a716-446655440000</Code>
                    <Icon name="content-copy" size={18} color="#64748b" />
                  </StyledView>
                  <StyledText className="text-sm text-slate-500 leading-relaxed">Compartilhe este código UUID com seus colegas para que eles possam se juntar à sua equipe.</StyledText>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Stats */}
            <StyledView className="w-full lg:w-2/3 p-3">
              <StyledView className="flex-row flex-wrap -m-3">
                <StyledView className="w-full md:w-1/2 p-3">
                  <GlassCard className="p-6 flex-row items-center gap-4">
                    <StyledView className="w-14 h-14 rounded-xl bg-purple-500/20 items-center justify-center">
                      <Icon name="groups" size={30} color="#a855f7" />
                    </StyledView>
                    <StyledView>
                      <LabelSM className="text-slate-500 uppercase tracking-widest">Total Membros</LabelSM>
                      <H2>08 / 12</H2>
                    </StyledView>
                  </GlassCard>
                </StyledView>
                <StyledView className="w-full md:w-1/2 p-3">
                  <GlassCard className="p-6 flex-row items-center gap-4">
                    <StyledView className="w-14 h-14 rounded-xl bg-tertiary/20 items-center justify-center">
                      <Icon name="star" size={30} color="#fabc4e" />
                    </StyledView>
                    <StyledView>
                      <LabelSM className="text-slate-500 uppercase tracking-widest">Ranking Geral</LabelSM>
                      <H2>#04</H2>
                    </StyledView>
                  </GlassCard>
                </StyledView>
                <StyledView className="w-full p-3">
                  <GlassCard className="p-6">
                    <StyledView className="flex-row justify-between items-center mb-4">
                      <LabelSM className="text-slate-500 uppercase tracking-widest">Progresso do Ciclo</LabelSM>
                      <StyledText className="text-primary font-bold">78%</StyledText>
                    </StyledView>
                    <StyledView className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <StyledView className="h-full bg-gradient-to-r from-primary to-secondary shadow-lg" style={{ width: '78%' }} />
                    </StyledView>
                  </GlassCard>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Members Table */}
          <GlassCard className="rounded-2xl overflow-hidden mb-8">
            <StyledView className="p-6 border-b border-white/10 flex-row justify-between items-center">
              <H3>Membros da Equipe</H3>
              <StyledView className="relative w-64">
                <StyledView className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Icon name="search" size={16} color="#64748b" />
                </StyledView>
                <StyledTextInput className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white" placeholder="Filtrar membros..." placeholderTextColor="#64748b" />
              </StyledView>
            </StyledView>
            <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StyledView className="min-w-[800px]">
                <StyledView className="flex-row bg-white/5 border-b border-white/10 px-6 py-4">
                  <StyledView className="flex-[2]"><LabelSM className="uppercase tracking-widest text-xs text-slate-500">Membro</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase tracking-widest text-xs text-slate-500">Cargo</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase tracking-widest text-xs text-slate-500">Status</LabelSM></StyledView>
                  <StyledView className="flex-1"><LabelSM className="uppercase tracking-widest text-xs text-slate-500">Data</LabelSM></StyledView>
                  <StyledView className="flex-1 items-end"><LabelSM className="uppercase tracking-widest text-xs text-slate-500">Ações</LabelSM></StyledView>
                </StyledView>
                <MemberRow name="Ricardo Silva" email="ricardo.s@scancount.ai" role="Líder" status="Online" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBcLkF8DuE1Ba0FbmyIXav927g0o56tmU4zPhNttp_pQK3stCiEw5talk2T7JrPLdG_rgjNeFutoGBQ6SX9ZPbkdsLgegXQvNy-FQhqNcKCg20TC_Y_rXOVZB19vx88fFauCqeNUHfWf9Sq3qv0TIFS1p913Fu6Odf1Sxl7RNxw0xepmqLcuYkdpDuJJMeK-viiedurr8166aEfVz6_tAqrRwzmZeURcWk-Bnq3x0H7f_1xGDq0nql3oVp0RmdbmyJyNVupxjxXb2Y" date="12 Out, 2023" />
                <MemberRow name="Mariana Costa" email="mariana.c@scancount.ai" role="Membro" status="Offline" avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCLOkqZwbxIYJ2cFTxmh0CXs_1dqBYjY_kifvrvsJs1t0uoKI7TNheQzcp__EeGIH7-H1HnWzFGyiKOB42CA7LJUD8gOpi-SEujmfuGZ2zXnvsRxFcFQcZIHFzgT00uNueDlGqaVVfJL4ldhuRZT4sENZtML3E9cypAoEH2Bb3DqjPCJfS8uCyDnmH1wSC2zmSpdTAYgPOt6ynri2FT9WbUbkrFnt-GDlJORpseYb4tQ4mJL3dD-GKIYcElYPGzTpJCEcZ37rnorW8" date="15 Out, 2023" />
              </StyledView>
            </StyledScrollView>
          </GlassCard>

          {/* Quick Invite */}
          <GlassCard className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 flex-col md:flex-row items-center justify-between gap-6">
            <StyledView className="flex-row items-center gap-4">
              <StyledView className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center border border-primary/30">
                <Icon name="mail" size={32} color="#ddb7ff" />
              </StyledView>
              <StyledView>
                <H3 className="text-lg">Convide via E-mail</H3>
                <StyledText className="text-sm text-slate-500">Envie convites diretos para novos membros.</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="flex-row w-full md:w-auto gap-2">
              <StyledTextInput className="flex-1 md:w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" placeholder="email@universidade.edu" placeholderTextColor="#64748b" />
              <Button title="Enviar" />
            </StyledView>
          </GlassCard>
        </StyledView>
      </StyledScrollView>

      <MobileBottomNav />
    </StyledView>
  );
}
