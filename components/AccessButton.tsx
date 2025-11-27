import React from 'react';

interface AccessButtonProps {
  onClick: () => void;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'glass';
  className?: string;
}

const AccessButton: React.FC<AccessButtonProps> = ({ 
  onClick, 
  label, 
  sublabel,
  icon, 
  variant = 'primary',
  className = ''
}) => {
  
  const baseClasses = "relative overflow-hidden flex flex-col justify-between p-6 rounded-[32px] transition-all active:scale-[0.98] shadow-soft hover:shadow-lg group";
  
  let colorClasses = "";
  let textClasses = "";
  let iconBgClass = "";
  
  switch (variant) {
    case 'primary': // Black (High Contrast)
      colorClasses = "bg-[#111] text-white";
      textClasses = "text-gray-400";
      iconBgClass = "bg-white/10 text-white";
      break;
    case 'accent': // Blue (Brand)
      colorClasses = "bg-[#4355F9] text-white"; // A vibrant indigo/blue
      textClasses = "text-blue-200";
      iconBgClass = "bg-white/20 text-white";
      break;
    case 'secondary': // White (Card)
      colorClasses = "bg-white border border-gray-100";
      textClasses = "text-gray-500";
      iconBgClass = "bg-gray-50 text-gray-900";
      break;
    case 'danger': // Red/Emergency
      colorClasses = "bg-[#FF3B30] text-white";
      textClasses = "text-red-100";
      iconBgClass = "bg-white/20 text-white";
      break;
    case 'glass': // Semi-transparent
      colorClasses = "bg-white/80 backdrop-blur-md border border-white/50";
      textClasses = "text-gray-600";
      iconBgClass = "bg-gray-100/50 text-gray-900";
      break;
  }

  return (
    <button
      onClick={onClick}
      aria-label={`${label} ${sublabel || ''}`}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {/* Background decoration for some visual flair */}
      {variant === 'accent' && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      )}
      
      <div className="flex justify-between w-full items-start mb-2 z-10">
         {icon && <div className={`p-3 rounded-full ${iconBgClass} backdrop-blur-sm`}>
          {icon}
        </div>}
      </div>
     
      <div className="text-left mt-auto z-10">
        <span className={`block text-2xl font-bold leading-tight tracking-tight ${variant === 'secondary' ? 'text-gray-900' : 'text-white'}`}>{label}</span>
        {sublabel && <span className={`text-sm font-medium mt-1 block opacity-80 ${textClasses}`}>{sublabel}</span>}
      </div>
    </button>
  );
};

export default AccessButton;