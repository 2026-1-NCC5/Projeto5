import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';

const StyledIcon = styled(MaterialIcons);

interface IconProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
  fill?: boolean;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#eadfed', 
  className,
  fill = false
}) => {
  // MaterialIcons doesn't have a direct 'fill' prop like Material Symbols, 
  // but we can handle some common cases or just pass the color.
  return (
    <StyledIcon 
      name={name} 
      size={size} 
      color={color} 
      className={className}
    />
  );
};
