import Image from 'next/image';

interface SpecializationIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

/**
 * Компонент для отображения SVG иконок специализаций
 * Использует Next.js Image для оптимизации
 */
export function SpecializationIcon({ 
  iconName, 
  size = 24, 
  className = '' 
}: SpecializationIconProps) {
  const iconPath = `/icons/specializations/${iconName}.svg`;
  
  return (
    <Image
      src={iconPath}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

