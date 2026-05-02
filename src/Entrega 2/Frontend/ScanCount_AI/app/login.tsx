import React from 'react';
import { View, ScrollView, TextInput, Pressable, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import { H1, H2, BodyLG, BodyMD, LabelSM, Code } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link } from 'expo-router';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

export default function LoginPage() {
  return (
    <StyledView className="flex-1 bg-surface items-center justify-center">
      {/* Background Decoration */}
      <StyledView className="absolute inset-0 pointer-events-none">
        <StyledView className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full" style={{ filter: 'blur(120px)' }} />
        <StyledView className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full" style={{ filter: 'blur(120px)' }} />
      </StyledView>

      <StyledScrollView 
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}
        className="w-full px-6"
      >
        {/* Logo & Branding */}
        <StyledView className="mb-12 items-center">
          <H1 className="text-primary text-center shadow-neon-primary">ScanCount AI</H1>
          <BodyLG className="text-on-surface-variant mt-2 text-center">
            Precisão industrial. Inteligência em tempo real.
          </BodyLG>
        </StyledView>

        {/* Login Card */}
        <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
          <StyledView className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30 shadow-neon-primary" />
          
          <StyledView className="gap-8">
            <StyledView>
              <H2 className="text-on-surface mb-1">Acessar Painel</H2>
              <BodyMD>Entre com suas credenciais para gerenciar seu estoque.</BodyMD>
            </StyledView>

            {/* Form */}
            <StyledView className="gap-4">
              <StyledView className="gap-2">
                <LabelSM className="ml-1">E-mail Corporativo</LabelSM>
                <StyledView className="relative flex-row items-center bg-white/5 border border-white/10 rounded-lg h-14 px-4">
                  <Icon name="mail" color="#988d9f" className="mr-3" />
                  <StyledTextInput 
                    className="flex-1 text-on-surface font-body-md h-full"
                    placeholder="nome@empresa.com.br"
                    placeholderTextColor="#988d9f"
                  />
                </StyledView>
              </StyledView>

              <StyledView className="gap-2">
                <StyledView className="flex-row justify-between px-1">
                  <LabelSM>Senha</LabelSM>
                  <Pressable><LabelSM className="text-primary">Esqueceu?</LabelSM></Pressable>
                </StyledView>
                <StyledView className="relative flex-row items-center bg-white/5 border border-white/10 rounded-lg h-14 px-4">
                  <Icon name="lock" color="#988d9f" className="mr-3" />
                  <StyledTextInput 
                    className="flex-1 text-on-surface font-body-md h-full"
                    placeholder="••••••••"
                    placeholderTextColor="#988d9f"
                    secureTextEntry
                  />
                  <Icon name="visibility" color="#988d9f" />
                </StyledView>
              </StyledView>

              <Button title="Entrar no Sistema" className="mt-4" />
            </StyledView>

            {/* Divider */}
            <StyledView className="flex-row items-center gap-4">
              <StyledView className="h-[1px] flex-1 bg-outline-variant" />
              <LabelSM className="text-outline-variant">OU ACESSE COM</LabelSM>
              <StyledView className="h-[1px] flex-1 bg-outline-variant" />
            </StyledView>

            {/* OAuth */}
            <StyledView className="flex-row gap-4">
              <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-white/5 border border-white/10 h-14 rounded-lg active:scale-95">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAojWHpCxQi_zExUYTlfWWuow2ge4kaPeSLqLbJQGeYCwHTSQgp9SR4F-thzu1rAB4AJTD3mWw0eWxoNi4BF_kVvO4As9RkAg1_qcC4SKq4HHgwBXgUFRPo2dXItRGpFS68yhC8evvHnsuaeKQEFMeuuh3CsXZgpW-BCJw6FtR4SWeOBcqfdwwDVZgixu-g5S42KPrYuh130HasH15CCzTcdUwr_fI4ggF6a6OhEf3sX-Lres1mKj-EOZFmLg7dj6clmivHZtG8bfg' }} className="w-5 h-5" />
                <LabelSM className="text-on-surface">Google</LabelSM>
              </Pressable>
              <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-white/5 border border-white/10 h-14 rounded-lg active:scale-95">
                <Icon name="code" color="#eadfed" size={20} />
                <LabelSM className="text-on-surface">GitHub</LabelSM>
              </Pressable>
            </StyledView>

            {/* Invite */}
            <StyledView className="pt-6 border-t border-white/10 items-center">
              <StyledView className="flex-row gap-1">
                <BodyMD>Possui um convite de acesso?</BodyMD>
                <Pressable><BodyMD className="text-primary font-bold">Resgatar via Token</BodyMD></Pressable>
              </StyledView>
            </StyledView>
          </StyledView>
        </GlassCard>

        {/* Footer */}
        <StyledView className="mt-12 items-center gap-2">
          <LabelSM className="text-outline uppercase tracking-widest">Versão 2.4.1 Build 2024</LabelSM>
          <StyledView className="flex-row gap-4">
            <Pressable><LabelSM className="text-outline">Termos de Serviço</LabelSM></Pressable>
            <Pressable><LabelSM className="text-outline">Privacidade</LabelSM></Pressable>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
