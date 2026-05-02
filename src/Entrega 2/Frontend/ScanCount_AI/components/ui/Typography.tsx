import React from 'react';
import { Text, TextProps } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);

interface TypographyProps extends TextProps {
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-h1 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-background ${className}`} {...props} />
);

export const H2: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-h2 text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-on-background ${className}`} {...props} />
);

export const H3: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-h3 text-[24px] font-semibold leading-[1.3] text-on-background ${className}`} {...props} />
);

export const BodyLG: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-body-lg text-[18px] font-normal leading-[1.6] text-on-surface-variant ${className}`} {...props} />
);

export const BodyMD: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-body-md text-[16px] font-normal leading-[1.5] text-on-surface-variant ${className}`} {...props} />
);

export const LabelSM: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-label-sm text-[14px] font-semibold leading-[1] tracking-[0.05em] text-on-surface-variant ${className}`} {...props} />
);

export const Code: React.FC<TypographyProps> = ({ className, ...props }) => (
  <StyledText className={`font-code text-[14px] font-medium leading-[1.4] text-slate-500 ${className}`} {...props} />
);
