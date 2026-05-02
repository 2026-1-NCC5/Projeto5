import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <StyledView 
      className={`bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </StyledView>
  );
};
