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

export default function CadastroPage() {
  return (
    <StyledView className="flex-1 bg-background">
      {/* Background Decoration */}
      <StyledView className="absolute inset-0 pointer-events-none opacity-50">
         <StyledView className="absolute top-0 left-0 right-0 bottom-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(168, 85, 247, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </StyledView>

      <StyledScrollView 
        contentContainerStyle={{ padding: 20, minHeight: '100%', justifyContent: 'center' }}
        className="w-full"
      >
        <StyledView className="max-w-6xl mx-auto flex-row flex-wrap items-center">
          {/* Left Side: Branding and Info */}
          <StyledView className="w-full lg:w-5/12 hidden lg:flex pr-12 gap-8">
            <StyledView className="flex-row items-center gap-3">
              <StyledView className="w-12 h-12 rounded-lg bg-primary items-center justify-center shadow-neon-primary">
                <Icon name="photo-camera" size={30} color="#490080" />
              </StyledView>
              <H2 className="text-primary tracking-tighter">ScanCount AI</H2>
            </StyledView>

            <H1 className="leading-tight">
              Transforme Imagens em <StyledText className="text-primary italic">Dados Reais.</StyledText>
            </H1>

            <BodyLG className="text-on-surface-variant">
              Otimize seu inventário com reconhecimento visual de alta precisão. Entre para o futuro da gestão industrial e logística.
            </BodyLG>

            <StyledView className="gap-6 pt-4">
              <StyledView className="flex-row items-center gap-4">
                <StyledView className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant">
                  <Icon name="rocket-launch" size={20} color="#ddb7ff" />
                </StyledView>
                <BodyMD>Processamento 85% mais rápido que o manual.</BodyMD>
              </StyledView>
              <StyledView className="flex-row items-center gap-4">
                <StyledView className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant">
                  <Icon name="verified-user" size={20} color="#fbabff" />
                </StyledView>
                <BodyMD>99.9% de acurácia em contagens complexas.</BodyMD>
              </StyledView>
            </StyledView>

            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwNP_ipkleKSVob8eOfiE7xiSJVEcyCWkUFwELw15TE8gi_Xx8-6T9PpAc73nSHLavwZz3MaYjUjjtVhWlTH6AcNSYBwq4meypiySDhAjLIxzS07gMUQwLjJq2IsYOdrXJYHlML5WJnru0hJUrq6-h8ZKvVeAEIKJCKmrPi-VUkiCoG8-J4WL57bEN86IDcIMxJuYpAhoWcbnaqHXfxCTM2-tcqfOAYp_90LDePpgS8pWb_HzsLXS2WeU-ZhQxMKsRT20Ssuw_R-8' }}
              className="w-full h-64 rounded-xl opacity-80 border border-primary/20 mt-8"
            />
          </StyledView>

          {/* Right Side: Registration Form */}
          <StyledView className="w-full lg:w-7/12 items-center lg:items-end">
            <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
              <StyledView className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full" style={{ filter: 'blur(40px)' }} />
              
              <StyledView className="relative z-10">
                <StyledView className="mb-8">
                  <H2 className="text-xl mb-1">Crie sua conta</H2>
                  <BodyMD>Inicie sua jornada no ScanCount AI hoje mesmo.</BodyMD>
                </StyledView>

                {/* Social Login */}
                <StyledView className="flex-row gap-4 mb-8">
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-surface-container-high h-12 rounded-lg border border-outline-variant active:scale-95">
                    <Icon name="code" size={18} color="#eadfed" />
                    <LabelSM>Google</LabelSM>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-surface-container-high h-12 rounded-lg border border-outline-variant active:scale-95">
                    <Icon name="terminal" size={18} color="#eadfed" />
                    <LabelSM>GitHub</LabelSM>
                  </Pressable>
                </StyledView>

                <StyledView className="flex-row items-center gap-4 mb-8">
                  <StyledView className="h-px flex-1 bg-outline-variant" />
                  <LabelSM className="text-on-surface-variant">OU COM E-MAIL</LabelSM>
                  <StyledView className="h-px flex-1 bg-outline-variant" />
                </StyledView>

                <StyledView className="gap-6">
                  <StyledView className="gap-2">
                    <LabelSM>NOME COMPLETO</LabelSM>
                    <StyledView className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-lg h-12 px-4">
                      <Icon name="person" size={18} color="#988d9f" className="mr-3" />
                      <StyledTextInput className="flex-1 text-on-background font-body-md h-full" placeholder="Seu nome" placeholderTextColor="#988d9f/50" />
                    </StyledView>
                  </StyledView>

                  <StyledView className="gap-2">
                    <LabelSM>E-MAIL CORPORATIVO</LabelSM>
                    <StyledView className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-lg h-12 px-4">
                      <Icon name="mail" size={18} color="#988d9f" className="mr-3" />
                      <StyledTextInput className="flex-1 text-on-background font-body-md h-full" placeholder="nome@empresa.com" placeholderTextColor="#988d9f/50" />
                    </StyledView>
                  </StyledView>

                  <StyledView className="flex-row gap-4">
                    <StyledView className="flex-1 gap-2">
                      <LabelSM>SENHA</LabelSM>
                      <StyledView className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-lg h-12 px-4">
                        <Icon name="lock" size={18} color="#988d9f" />
                        <StyledTextInput className="flex-1 text-on-background font-body-md h-full" placeholder="••••" placeholderTextColor="#988d9f/50" secureTextEntry />
                      </StyledView>
                    </StyledView>
                    <StyledView className="flex-1 gap-2">
                      <LabelSM>CONFIRMAR</LabelSM>
                      <StyledView className="flex-row items-center bg-surface-container-low border border-outline-variant rounded-lg h-12 px-4">
                        <Icon name="shield" size={18} color="#988d9f" />
                        <StyledTextInput className="flex-1 text-on-background font-body-md h-full" placeholder="••••" placeholderTextColor="#988d9f/50" secureTextEntry />
                      </StyledView>
                    </StyledView>
                  </StyledView>

                  <StyledView className="flex-row gap-3">
                    <StyledView className="w-5 h-5 bg-surface-container-low border border-outline-variant rounded" />
                    <StyledText className="flex-1 text-on-surface-variant font-label-sm text-[12px]">
                      Eu concordo com os <StyledText className="text-primary">Termos de Serviço</StyledText> e a <StyledText className="text-primary">Política de Privacidade</StyledText>.
                    </StyledText>
                  </StyledView>

                  <Button title="CRIAR MINHA CONTA AGORA" icon={<Icon name="rocket-launch" size={18} color="#400071" />} />
                </StyledView>

                <StyledView className="mt-8 items-center">
                  <StyledView className="flex-row gap-1">
                    <BodyMD>Já possui uma conta?</BodyMD>
                    <Link href="/login" asChild>
                      <Pressable><BodyMD className="text-primary font-semibold">Fazer Login</BodyMD></Pressable>
                    </Link>
                  </StyledView>
                </StyledView>
              </StyledView>
            </GlassCard>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Footer Meta */}
      <StyledView className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-8 opacity-40">
        <LabelSM className="text-[10px]">v2.4.0-STABLE</LabelSM>
        <LabelSM className="text-[10px]">ACME CORP LICENSED</LabelSM>
      </StyledView>
    </StyledView>
  );
}
