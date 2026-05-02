import React from 'react';
import { Pressable, Text, PressableProps, View } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);
const StyledView = styled(View);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  className, 
  textClassName,
  icon,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-container shadow-neon-primary active:scale-95';
      case 'secondary':
        return 'bg-secondary-container active:scale-95';
      case 'outline':
        return 'border border-primary/30 active:scale-95';
      case 'glass':
        return 'bg-surface/60 backdrop-blur-xl border border-white/10 active:scale-95';
      default:
        return 'bg-primary-container shadow-neon-primary active:scale-95';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'text-white font-bold text-xs uppercase tracking-widest';
      case 'outline':
        return 'text-primary font-bold text-xs uppercase tracking-widest';
      case 'glass':
        return 'text-on-background font-bold text-xs uppercase tracking-widest';
      default:
        return 'text-white font-bold text-xs uppercase tracking-widest';
    }
  };

  return (
    <StyledPressable 
      className={`flex-row items-center justify-center py-3 px-5 rounded-xl transition-all ${getVariantClasses()} ${className}`}
      {...props}
    >
      {icon && <StyledView className="mr-2">{icon}</StyledView>}
      <StyledText className={`${getTextClasses()} ${textClassName}`}>
        {title}
      </StyledText>
    </StyledPressable>
  );
};
