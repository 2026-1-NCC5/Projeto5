import React from 'react';
import { View, ScrollView, Image, Pressable, Text, ImageBackground } from 'react-native';
import { styled } from 'nativewind';
import { H3, LabelSM, BodyMD, Code } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { SideNavBar } from '@/components/layout/SideNavBar';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);

const BoundingBox = ({ top, left, width, height, label, confidence, color = '#ddb7ff' }: any) => (
  <StyledView 
    className="absolute border-2 rounded-lg" 
    style={{ top: `${top}%`, left: `${left}%`, width, height, borderColor: color, backgroundColor: `${color}1A` }}
  >
    <StyledView 
      className="absolute -top-10 left-0 px-3 py-1 rounded-full flex-row items-center gap-2 shadow-lg"
      style={{ backgroundColor: color }}
    >
      <LabelSM className="text-on-primary text-[10px] uppercase font-bold">{label}</LabelSM>
      {confidence && <LabelSM className="text-on-primary text-[10px] font-bold">{confidence}%</LabelSM>}
    </StyledView>
    {/* Brackets */}
    <StyledView className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: color }} />
    <StyledView className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: color }} />
    <StyledView className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: color }} />
    <StyledView className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: color }} />
  </StyledView>
);

const DetectionCard = ({ title, category, confidence, color, image, progress, status, statusColor }: any) => (
  <GlassCard className={`p-4 rounded-xl border-l-4 mb-4 ${statusColor === 'REVISAR' ? 'border-tertiary' : 'border-primary'}`}>
    <StyledView className="flex-row justify-between items-start mb-3">
      <StyledView>
        <StyledText className="text-sm font-bold text-white mb-1">{title}</StyledText>
        <StyledText className="text-[10px] text-slate-500 uppercase">{category}</StyledText>
      </StyledView>
      <StyledText className={`text-xs font-bold ${statusColor === 'REVISAR' ? 'text-tertiary' : 'text-primary'}`}>{confidence}%</StyledText>
    </StyledView>
    <StyledView className="flex-row items-center gap-3">
      <Image source={{ uri: image }} className="w-12 h-12 rounded-lg bg-surface-variant" />
      <StyledView className="flex-1">
        <StyledView className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
          <StyledView 
            className={`h-full ${statusColor === 'REVISAR' ? 'bg-tertiary' : 'bg-primary'} shadow-lg`} 
            style={{ width: `${progress}%` }} 
          />
        </StyledView>
        <StyledView className="flex-row justify-between mt-1">
          <StyledText className="text-[9px] text-slate-400">Verificação</StyledText>
          <StyledText className={`text-[9px] font-bold ${statusColor === 'REVISAR' ? 'text-tertiary' : 'text-slate-400'}`}>{status}</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  </GlassCard>
);

export default function CheckoutPage() {
  return (
    <StyledView className="flex-1 bg-background">
      <TopAppBar />
      <SideNavBar />
      
      <StyledView className="flex-1 md:ml-64 pt-16 flex-row">
        {/* Scanner Viewport */}
        <StyledView className="flex-1 bg-black relative overflow-hidden">
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqeHVTwZgqWxlXJhiOtC655IJ8kpwRBm9Mf1YnYNAS2E7p0suZg33iJDGjHesZ9bfj3ah1CEuPjeqyVnnDDrmwzo-cCq-QZs3Evq2-LFkwU1ByJSuEQup7wW_Sl2KMHb0CzZVqQz7viviuYJdqG2mLrMNVhvngAE_kEMDeNgGbTl63Nc1PZxk3wgT8rHWa7ZgGDXDMvR9YY3f54z9urODHGtR01WjgDbI1yKFsTjSR-miUjVhwqKF5EA6cyRhk-QIhByhp7g0Apxw' }} 
            className="flex-1"
          >
            <StyledView className="absolute inset-0 bg-black/40" />
            
            {/* Overlays */}
            <BoundingBox top={20} left={30} width={192} height={128} label="Lote: 4921-A" confidence={98} />
            <BoundingBox top={55} left={50} width={256} height={192} label="Scanner: Em Curso" color="#fabc4e" />

            {/* Telemetry */}
            <StyledView className="absolute top-8 left-8 gap-4">
              <GlassCard className="p-4 border-l-4 border-primary">
                <LabelSM className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Precisão</LabelSM>
                <H3 className="text-primary">99.4<StyledText className="text-sm font-normal text-slate-500">%</StyledText></H3>
              </GlassCard>
              <GlassCard className="p-4">
                <LabelSM className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Objetos/Min</LabelSM>
                <H3 className="text-white">42<StyledText className="text-sm font-normal text-slate-500">ppm</StyledText></H3>
              </GlassCard>
            </StyledView>

            {/* Controls */}
            <StyledView className="absolute bottom-8 left-0 right-0 flex-row justify-center items-center gap-6">
              <Pressable className="w-14 h-14 rounded-full bg-surface/70 backdrop-blur-xl items-center justify-center border border-white/10 active:scale-95">
                <Icon name="zoom-in" size={24} color="white" />
              </Pressable>
              <Pressable className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-neon-primary active:scale-95">
                <StyledView className="w-full h-full bg-background rounded-full items-center justify-center">
                  <Icon name="photo-camera" size={32} color="#ddb7ff" />
                </StyledView>
              </Pressable>
              <Pressable className="w-14 h-14 rounded-full bg-surface/70 backdrop-blur-xl items-center justify-center border border-white/10 active:scale-95">
                <Icon name="flash-on" size={24} color="white" />
              </Pressable>
            </StyledView>
          </ImageBackground>
        </StyledView>

        {/* Side Panel */}
        <StyledView className="w-96 bg-surface-container-low border-l border-white/10 hidden lg:flex">
          <StyledView className="p-6 border-b border-white/10">
            <StyledView className="flex-row justify-between items-center mb-2">
              <H3 className="text-lg">Detecções</H3>
              <StyledView className="px-2 py-1 bg-primary/10 rounded">
                <LabelSM className="text-primary text-[10px] font-bold uppercase">Real-time</LabelSM>
              </StyledView>
            </StyledView>
            <BodyMD className="text-xs">Monitoramento de fluxo de entrada.</BodyMD>
          </StyledView>

          <StyledScrollView className="flex-1 p-4">
            <DetectionCard 
              title="Drone Pro-X2" category="Eletrônicos • SKU-9021" confidence={98.2} 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAkJHUpxBVfeamKtRDMZU0LeOtWCQ2juGdM2capQSCBuR6zyGv3d5igm-YcfPbCkhIGFf8wRDjdLuz1AwWgOhuCIPk5oStnBH3YtysiyThRaz17j_HJloU2PDxH_byNnR4pk4jLZKML93OyoZtRXNJT12XewTz_q9PmQpKLfGvtbS5x380dUOkVuf1vL9A8BAXC1xZVpo7odSD9-kCwbCDJrIR94eZ6XQprQfQHvJIVtYqoElwJ9IUfECI5QOhOFnchJVM7h_npgyA"
              progress={98} status="OK" statusColor="OK"
            />
            <DetectionCard 
              title="Módulo Sensor V4" category="Componentes • SKU-4412" confidence={85.5} 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuD4F6Vus5JFeGaG8IwtZ0uegszddMyn1Fww06FotSrY6eHk_ZHOAqVm2lH2XDUwf6UQv5vqutt2mzFF0ncuatv45G2HzYnokfdXty_jKQsMoinKfyroT-9pTe5qYeAEZzMWbNr98RBVlEBQ5tAz1SpkZoYkIQoqTv_5o0fOmLEFZRN0ru8Nb9j65PLqatnrL9z5oy6U8AakDAkeu2lCFagwstxnY-YUWd6HbT5yusgyHkDuQvLZnbpOOr-KZ_xYCLu2DByn_jmxwW0"
              progress={85} status="REVISAR" statusColor="REVISAR"
            />
            <DetectionCard 
              title="Estação de Recarga" category="Acessórios • SKU-1002" confidence={99.9} 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuA-83uydWROJWqtuQYUxTvJuTDAgj8Has4DMLKIMzcfy8DvAyPpcJFCnsBDwasDKHtKovnCXCdkaJhfGfwRhU9wASaRwDBEK5ZMsXHNuozAds9w0xt2fkcDlzJXwSMKO8LwxuymITdF1gAu10g_w1zTIN5XPSqK3OOmN87OhMYRgOXspXz21eDZ4-0rBp76W2O-4C7M6TtchY46O6IuJ-r186XGDrYUWQ-4WfF5jXCt5G5VJuOaP840qGXFDdhjKPMg1KHCE7eQF4A"
              progress={100} status="OK" statusColor="OK"
            />
          </StyledScrollView>

          <StyledView className="p-6 bg-surface-container-high border-t border-white/10 gap-4">
            <StyledView className="flex-row justify-between items-center">
              <StyledText className="text-sm font-bold text-slate-400">Total Detectado:</StyledText>
              <StyledText className="text-white font-bold">14 Itens</StyledText>
            </StyledView>
            <StyledView className="flex-row gap-3">
              <Button title="Limpar" variant="glass" className="flex-1" />
              <Button title="Finalizar" className="flex-1" />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
