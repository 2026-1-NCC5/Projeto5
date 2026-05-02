import React from 'react';
import { View, ScrollView, TextInput, Pressable, Text, Switch, Image } from 'react-native';
import { styled } from 'nativewind';
import { H1, H3, BodyMD, LabelSM } from '@/components/ui/Typography';
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

const InputField = ({ label, placeholder, type = 'default' }: any) => (
  <StyledView className="space-y-2 flex-1">
    <LabelSM className="text-slate-400 font-bold uppercase">{label}</LabelSM>
    <StyledTextInput 
      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary" 
      placeholder={placeholder} 
      placeholderTextColor="#64748b"
      keyboardType={type === 'number' ? 'numeric' : 'default'}
    />
  </StyledView>
);

const SettingToggle = ({ label, description, value }: any) => (
  <StyledView className="flex-row items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 flex-1 min-w-[200px]">
    <StyledView>
      <StyledText className="font-bold text-white text-sm">{label}</StyledText>
      <StyledText className="text-[10px] text-slate-500 uppercase">{description}</StyledText>
    </StyledView>
    <Switch 
      value={value} 
      trackColor={{ false: '#334155', true: '#a855f7' }}
      thumbColor={value ? '#f0dbff' : '#94a3b8'}
    />
  </StyledView>
);

export default function NovoDesafioPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledScrollView className="flex-1 md:ml-64 pt-24 pb-32 px-6">
        <StyledView className="max-w-6xl mx-auto">
          {/* Header */}
          <StyledView className="flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <StyledView className="flex-1">
              <H1>Novo Desafio</H1>
              <BodyMD className="text-slate-500 max-w-2xl mt-2">Configure os parâmetros do novo semestre acadêmico e as regras de detecção por IA.</BodyMD>
            </StyledView>
            <StyledView className="flex-row gap-4">
              <Button title="Cancelar" variant="glass" className="px-6" />
              <Button title="Publicar Desafio" icon={<Icon name="save" size={18} color="#400071" />} className="px-6" />
            </StyledView>
          </StyledView>

          {/* Bento Grid */}
          <StyledView className="flex-row flex-wrap -m-3 mb-8">
            {/* Semester Basics */}
            <StyledView className="w-full lg:w-2/3 p-3">
              <GlassCard className="p-8 h-full gap-8">
                <StyledView className="flex-row items-center gap-3 border-b border-white/10 pb-4">
                  <Icon name="calendar-month" size={24} color="#ddb7ff" />
                  <H3>Dados do Semestre</H3>
                </StyledView>
                
                <StyledView className="gap-6">
                  <InputField label="Nome do Desafio" placeholder="Ex: Inventário Global 2024.2" />
                  <StyledView className="flex-row gap-6">
                    <InputField label="Data de Início" placeholder="DD/MM/AAAA" />
                    <InputField label="Data de Término" placeholder="DD/MM/AAAA" />
                  </StyledView>
                </StyledView>

                <StyledView className="gap-6 pt-4">
                  <StyledView className="flex-row items-center gap-3 border-b border-white/10 pb-4">
                    <Icon name="rule" size={24} color="#ddb7ff" />
                    <H3>Regras de Membros</H3>
                  </StyledView>
                  <StyledView className="flex-row gap-6">
                    <InputField label="Min. por Grupo" placeholder="2" type="number" />
                    <InputField label="Max. por Grupo" placeholder="5" type="number" />
                    <InputField label="Tentativas" placeholder="3" type="number" />
                  </StyledView>
                </StyledView>
              </GlassCard>
            </StyledView>

            {/* Import & Preview */}
            <StyledView className="w-full lg:w-1/3 p-3">
              <StyledView className="gap-6 h-full">
                <GlassCard className="p-8 flex-1 gap-6">
                  <StyledView className="flex-row items-center gap-3 border-b border-white/10 pb-4">
                    <Icon name="group-add" size={24} color="#ddb7ff" />
                    <H3 className="text-lg">Importar Alunos</H3>
                  </StyledView>
                  <StyledView className="flex-1 border-2 border-dashed border-white/10 rounded-xl items-center justify-center p-8 gap-4">
                    <StyledView className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center">
                      <Icon name="upload-file" size={32} color="#ddb7ff" />
                    </StyledView>
                    <StyledView className="items-center">
                      <StyledText className="font-bold text-white text-sm">Arraste seu CSV aqui</StyledText>
                      <StyledText className="text-xs text-slate-500 text-center">Ou clique para selecionar arquivos</StyledText>
                    </StyledView>
                    <Button title="Selecionar Planilha" variant="glass" className="py-2 px-4 h-auto" />
                  </StyledView>
                  <StyledView className="bg-white/5 p-4 rounded-lg flex-row gap-3">
                    <Icon name="info" size={16} color="#fabc4e" />
                    <StyledText className="text-[10px] text-slate-400 flex-1 leading-relaxed">
                      Colunas obrigatórias: <StyledText className="text-tertiary">nome, email, id_estudante</StyledText>.
                    </StyledText>
                  </StyledView>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden h-48">
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaqPCVdbvQ1D25EHVvdNXOLFJPW2t6ntFnfg8hTXm6BjW8m_hZvF-DPISLDSR_NmZS8cCAMeRe1jr8898XuNpDUIIp9oicIaHBnQjMYu4u0DKd_ksUW62d32s3pX7fWA-OcdTEWTlP43PV5W3BOmkYp6G_gh1neH7RQAnql1pgac9gA2ZfwE0AMBurJ1dNJKBbuacF1t5KezrpiyF3YWdOoeCT4jLDfnF1xBVQIBCLokXb7--qPf8W2oMyo39A2Eo0TjVj4pvdQlI' }} 
                    className="absolute inset-0 w-full h-full opacity-30"
                  />
                  <StyledView className="relative z-10 justify-between h-full">
                    <StyledView className="flex-row items-center gap-2">
                      <StyledView className="w-2 h-2 rounded-full bg-primary" />
                      <LabelSM className="text-primary font-bold uppercase tracking-tighter">Motor de IA Ativo</LabelSM>
                    </StyledView>
                    <StyledView>
                      <StyledText className="text-white font-bold">Precisão de Detecção</StyledText>
                      <StyledView className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                        <StyledView className="h-full bg-primary" style={{ width: '94%' }} />
                      </StyledView>
                      <StyledText className="text-[10px] text-slate-400 mt-1">94.8% Estimado</StyledText>
                    </StyledView>
                  </StyledView>
                </GlassCard>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Advanced Options */}
          <GlassCard className="p-8 rounded-2xl">
            <StyledView className="flex-row justify-between items-center border-b border-white/10 pb-4 mb-6">
              <StyledView className="flex-row items-center gap-3">
                <Icon name="settings-suggest" size={24} color="#ddb7ff" />
                <H3>Configurações Avançadas</H3>
              </StyledView>
              <StyledView className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex-row items-center gap-2">
                <Icon name="bolt" size={14} color="#fbabff" />
                <LabelSM className="text-secondary font-bold uppercase text-[10px]">Modo Performance</LabelSM>
              </StyledView>
            </StyledView>
            
            <StyledView className="flex-row flex-wrap -m-2">
              <StyledView className="w-full md:w-1/4 p-2">
                 <StyledView className="p-4 bg-white/5 rounded-xl border border-white/10 h-full justify-between">
                    <LabelSM className="text-slate-300 font-bold uppercase">Sensibilidade</LabelSM>
                    <StyledText className="text-primary font-bold text-lg">0.85</StyledText>
                    <StyledView className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <StyledView className="h-full bg-primary" style={{ width: '85%' }} />
                    </StyledView>
                 </StyledView>
              </StyledView>
              <StyledView className="w-full md:w-1/4 p-2">
                <SettingToggle label="Modo Offline" description="Cache local" value={true} />
              </StyledView>
              <StyledView className="w-full md:w-1/4 p-2">
                <SettingToggle label="Auto-validação" description="Cross-check IA" value={false} />
              </StyledView>
              <StyledView className="w-full md:w-1/4 p-2">
                <SettingToggle label="Ranking Público" description="Visível p/ alunos" value={true} />
              </StyledView>
            </StyledView>
          </GlassCard>
        </StyledView>
      </StyledScrollView>

      <MobileBottomNav />
    </StyledView>
  );
}
