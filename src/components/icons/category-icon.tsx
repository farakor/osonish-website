import React from 'react';

interface CategoryIconProps {
  iconName?: string;
  fallbackIcon?: string;
  className?: string;
}

export function CategoryIcon({ iconName, fallbackIcon = '📋', className = "w-6 h-6" }: CategoryIconProps) {
  // Если иконки нет, показываем fallback emoji
  if (!iconName) {
    return <span className={className}>{fallbackIcon}</span>;
  }

  // Динамически загружаем SVG иконку
  const iconPath = `/assets/cats/${iconName}.svg`;

  return (
    <img 
      src={iconPath} 
      alt="" 
      className={className}
      onError={(e) => {
        // Если иконка не загрузилась, показываем fallback
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallbackSpan = document.createElement('span');
        fallbackSpan.textContent = fallbackIcon;
        fallbackSpan.className = className;
        target.parentNode?.appendChild(fallbackSpan);
      }}
    />
  );
}







