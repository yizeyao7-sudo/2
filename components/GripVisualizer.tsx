import React from 'react';
import { GripState } from '../types';

interface GripVisualizerProps {
  state: GripState;
  className?: string;
}

const GripVisualizer: React.FC<GripVisualizerProps> = ({ state, className = '' }) => {
  // Base styles for the handle shape
  const containerClass = "relative w-48 h-64 mx-auto transition-all duration-500";
  
  // Dynamic styles based on state
  let leftSideClass = "w-1/3 h-full bg-gray-200 rounded-l-3xl absolute left-0 top-0 transition-all duration-500 ease-in-out border-r border-gray-300";
  let rightSideClass = "w-1/3 h-full bg-gray-200 rounded-r-3xl absolute right-0 top-0 transition-all duration-500 ease-in-out border-l border-gray-300";
  let centerClass = "w-1/3 h-full bg-gray-300 absolute left-1/3 top-0 transition-all duration-500";
  let glowClass = "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300";

  switch (state) {
    case GripState.INFLATE_LEFT:
      leftSideClass += " bg-blue-500 w-[50%] -translate-x-4 shadow-[0_0_30px_rgba(59,130,246,0.6)] z-10 border-none scale-110";
      rightSideClass += " bg-gray-100 w-[20%] opacity-50";
      centerClass += " left-[50%] w-[30%] bg-gray-200";
      break;
    case GripState.INFLATE_RIGHT:
      rightSideClass += " bg-blue-500 w-[50%] translate-x-4 shadow-[0_0_30px_rgba(59,130,246,0.6)] z-10 border-none scale-110";
      leftSideClass += " bg-gray-100 w-[20%] opacity-50";
      centerClass += " left-[20%] w-[30%] bg-gray-200";
      break;
    case GripState.PULSE:
      centerClass += " animate-pulse bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10 scale-105";
      leftSideClass += " bg-gray-200";
      rightSideClass += " bg-gray-200";
      break;
    case GripState.WARNING:
      leftSideClass += " bg-red-500 animate-[wiggle_0.2s_infinite]";
      rightSideClass += " bg-red-500 animate-[wiggle_0.2s_infinite_reverse]";
      centerClass += " bg-red-600";
      break;
    case GripState.IDLE:
    default:
      // Default gray state
      break;
  }

  return (
    <div className={`${containerClass} ${className} flex flex-col items-center justify-center`}>
      {/* Label above */}
      <div className="absolute -top-12 text-center w-full">
         <span className={`text-sm font-bold tracking-widest uppercase ${state !== GripState.IDLE ? 'text-blue-600' : 'text-gray-400'}`}>
           {state === GripState.IDLE ? '气囊待机' : '触觉反馈中'}
         </span>
      </div>

      {/* The Handle Visual */}
      <div className="relative w-full h-full">
        {/* Shadow/Depth layer */}
        <div className="absolute inset-x-4 bottom-0 h-4 bg-black/20 blur-xl rounded-full"></div>

        {/* Parts */}
        <div className={leftSideClass}></div>
        <div className={centerClass}>
             {/* Grip texture */}
             <div className="w-full h-full opacity-10 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:8px_8px]"></div>
        </div>
        <div className={rightSideClass}></div>

        {/* Feedback Icons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {state === GripState.INFLATE_LEFT && (
                <div className="text-white font-black text-4xl opacity-80 drop-shadow-lg transform -translate-x-8">←</div>
            )}
            {state === GripState.INFLATE_RIGHT && (
                <div className="text-white font-black text-4xl opacity-80 drop-shadow-lg transform translate-x-8">→</div>
            )}
            {state === GripState.PULSE && (
                <div className="text-white font-black text-4xl opacity-80 drop-shadow-lg">↑</div>
            )}
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 font-medium">
         {state === GripState.INFLATE_LEFT ? '左侧气囊充气 • 向右转' : 
          state === GripState.INFLATE_RIGHT ? '右侧气囊充气 • 向左转' :
          state === GripState.PULSE ? '中央脉冲 • 直行' : '握持手柄感应方向'}
      </p>
    </div>
  );
};

export default GripVisualizer;