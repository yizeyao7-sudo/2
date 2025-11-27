import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Settings, 
  Mic, 
  Home, 
  ArrowUp, 
  ArrowLeft, 
  ArrowRight, 
  MapPin,
  ChevronLeft,
  Briefcase,
  ShoppingCart,
  Phone,
  Navigation as NavIcon,
  Menu,
  Bell,
  Search,
  CloudRain,
  Wind,
  Sun,
  Volume2,
  Vibrate,
  Eye,
  Battery,
  Bluetooth,
  Wifi,
  Thermometer,
  Cloud
} from 'lucide-react';
import { Screen, NavigationStep, GripState } from './types';
import AccessButton from './components/AccessButton';
import GripVisualizer from './components/GripVisualizer';
import StatusCard from './components/StatusCard';
import { speak } from './utils/speech';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [batteryLevel, setBatteryLevel] = useState(62);
  const [destinationInput, setDestinationInput] = useState('');
  const [navSteps, setNavSteps] = useState<NavigationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gripState, setGripState] = useState<GripState>(GripState.IDLE);
  const [navError, setNavError] = useState<string | null>(null);

  // Settings state
  const [volume, setVolume] = useState(50);
  const [hapticStrength, setHapticStrength] = useState(80);

  // Announce screen changes - Reduced verbosity
  useEffect(() => {
    if (currentScreen === Screen.EMERGENCY) speak("紧急模式已激活");
  }, [currentScreen]);

  const generateMockDirections = (destination: string): NavigationStep[] => {
    const routes = [
      [
        { instruction: "前方路口向左转，进入人民路。", distance: "120米", direction: "left" as const },
        { instruction: "沿人民路直行。", distance: "300米", direction: "straight" as const },
        { instruction: "在第二个红绿灯处向右转，进入中山大道。", distance: "50米", direction: "right" as const },
        { instruction: `您已到达目的地附近：${destination}。`, distance: "终点", direction: "arrive" as const },
      ],
      [
        { instruction: "沿当前道路直行，通过人行横道。", distance: "80米", direction: "straight" as const },
        { instruction: "在地铁站 C 口前向右转。", distance: "200米", direction: "right" as const },
        { instruction: `继续前行，您的目的地 ${destination} 就在左侧。`, distance: "50米", direction: "left" as const },
        { instruction: `您已到达目的地：${destination}。`, distance: "终点", direction: "arrive" as const },
      ],
      [
        { instruction: "请注意台阶，下楼后向左转。", distance: "30米", direction: "left" as const },
        { instruction: "穿过广场，保持直行。", distance: "250米", direction: "straight" as const },
        { instruction: "在公交站牌后向右转。", distance: "100米", direction: "right" as const },
        { instruction: `导航结束，您已到达 ${destination}。`, distance: "终点", direction: "arrive" as const },
      ]
    ];
    const routeIndex = destination.length % routes.length;
    return routes[routeIndex];
  };

  const handleStartNavigation = async (dest?: string) => {
    const target = dest || destinationInput;
    if (!target) {
        speak("请先输入目的地");
        return;
    }
    
    setNavError(null);
    setIsLoading(true);

    // Simulate a short delay for a better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = generateMockDirections(target);
    setIsLoading(false);

    if (data && data.length > 0) {
        setNavSteps(data);
        setCurrentStepIndex(0);
        setCurrentScreen(Screen.NAVIGATION_ACTIVE);
        triggerGripFeedback(data[0].direction);
    } else {
        const fallbackError = "无法规划路线";
        setNavError(fallbackError);
        speak(fallbackError);
    }
  };

  const triggerGripFeedback = (direction: string) => {
      let state = GripState.PULSE;
      if (direction === 'left') state = GripState.INFLATE_LEFT;
      if (direction === 'right') state = GripState.INFLATE_RIGHT;
      if (direction === 'arrive') state = GripState.WARNING;

      setGripState(state);
      setTimeout(() => {
          setGripState(GripState.IDLE);
      }, 2000);
  };

  const handleNextStep = () => {
    if (currentStepIndex < navSteps.length - 1) {
        const next = currentStepIndex + 1;
        setCurrentStepIndex(next);
        const step = navSteps[next];
        triggerGripFeedback(step.direction);
    } else {
        triggerGripFeedback('arrive');
        speak("已到达");
        setTimeout(() => setCurrentScreen(Screen.HOME), 3000);
    }
  };

  // --- COMMON UI COMPONENTS ---

  const Header = ({ title, onBack }: { title: string, onBack?: () => void }) => (
    <div className="p-6 flex items-center gap-4 z-20 bg-white/50 backdrop-blur-md sticky top-0">
      <button 
        onClick={onBack || (() => setCurrentScreen(Screen.HOME))} 
        className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors"
      >
          <ChevronLeft size={28} className="text-gray-800" />
      </button>
      <span className="text-xl font-black text-gray-900">{title}</span>
    </div>
  );

  // --- RENDERING SCREENS ---

  const renderHome = () => (
    <div className="flex flex-col h-full pt-6 pb-2 px-4 gap-4 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-white/50">
                 <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div>
                 <h2 className="text-sm font-bold text-gray-500">下午好</h2>
                 <h1 className="text-xl font-black text-gray-900 leading-none">User</h1>
             </div>
         </div>
         <button 
            onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)}
            className="p-2 bg-white rounded-full shadow-sm text-gray-600 active:scale-95 transition-transform relative"
         >
             <Bell size={20} />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
         </button>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col gap-4 flex-grow">
        
        {/* Top Row: Cane Status + Weather/Context */}
        <div className="flex gap-4 h-[42%]">
            {/* Cane Card - Hero */}
            <div 
                onClick={() => setCurrentScreen(Screen.DEVICE_DETAIL)}
                className="w-[65%] bg-white rounded-[32px] p-5 shadow-soft relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98]"
            >
                <div className="z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide">在线</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">小白手杖 <span className="text-gray-300 text-lg">Pro</span></h2>
                </div>

                {/* Battery Pill */}
                <div className="z-10 bg-gray-50/80 backdrop-blur self-start px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-2 mt-2 pointer-events-none">
                     <Zap size={14} className="text-blue-500 fill-current" />
                     <span className="text-sm font-bold text-gray-700">{batteryLevel}%</span>
                </div>

                {/* Stylized Cane Illustration */}
                <div className="absolute -right-4 top-10 w-32 h-64 transform rotate-[15deg] transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-105 pointer-events-none">
                     <div className="relative w-full h-full">
                        <div className="absolute right-8 top-0 w-6 h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full shadow-lg z-10"></div>
                        <div className="absolute right-4 top-0 w-16 h-24 border-[8px] border-gray-300 rounded-t-3xl rounded-bl-3xl border-r-0 border-b-0 z-0"></div>
                        <div className="absolute right-8 bottom-12 w-6 h-6 bg-blue-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                     </div>
                </div>
            </div>

            {/* Weather / Status Stack */}
            <div className="w-[35%] flex flex-col gap-3">
                 <div 
                    onClick={() => setCurrentScreen(Screen.WEATHER_DETAIL)}
                    className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[28px] p-4 text-white flex flex-col justify-center items-center shadow-glow relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                 >
                     <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
                     <span className="text-3xl font-black mb-1">24°</span>
                     <span className="text-xs font-medium opacity-80">多云微风</span>
                 </div>
                 <div 
                    onClick={() => setCurrentScreen(Screen.SETTINGS)}
                    className="flex-1 bg-white rounded-[28px] p-4 flex flex-col justify-center items-center border border-gray-100 shadow-sm text-gray-400 cursor-pointer active:scale-95 transition-transform hover:bg-gray-50"
                 >
                     <Settings size={24} className="mb-1 text-gray-300" />
                     <span className="text-[10px] font-bold uppercase">设置</span>
                 </div>
            </div>
        </div>

        {/* Middle Row: Map Navigation Widget */}
        <div 
            className="h-[35%] bg-white rounded-[32px] p-4 shadow-soft relative overflow-hidden cursor-pointer group active:scale-[0.99] transition-transform"
            onClick={() => setCurrentScreen(Screen.NAVIGATION_SETUP)}
        >
             <div className="absolute inset-0 bg-gray-100 opacity-80 group-hover:scale-105 transition-transform duration-700">
                 <div className="w-full h-full" style={{
                     backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px), radial-gradient(#CBD5E1 2px, transparent 2px)',
                     backgroundSize: '32px 32px',
                     backgroundPosition: '0 0, 16px 16px'
                 }}></div>
                 <svg className="absolute inset-0 w-full h-full stroke-gray-300 stroke-[6] fill-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M-10,80 Q30,80 40,50 T90,20" />
                     <path d="M20,110 L20,60 L80,60 L80,-10" stroke="#94A3B8" />
                 </svg>
             </div>

             <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                 <div className="flex justify-between items-start">
                     <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-2">
                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-gray-800">当前位置</span>
                     </div>
                 </div>

                 <div className="flex items-center gap-4 mt-auto">
                     <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                         <NavIcon size={20} className="transform rotate-45" />
                     </div>
                     <div>
                         <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">去哪里?</div>
                         <div className="text-lg font-black text-gray-900">点击开始导航</div>
                     </div>
                 </div>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
             </div>
        </div>

        {/* Bottom Actions */}
        <div className="h-[18%] flex gap-3">
             {/* Grip Status Mini */}
             <div 
                onClick={() => setCurrentScreen(Screen.GRIP_SETTINGS)}
                className="flex-1 bg-gray-50 rounded-[24px] border border-gray-200 flex items-center justify-center gap-2 text-gray-400 cursor-pointer active:scale-95 transition-transform hover:bg-white hover:border-gray-300 hover:shadow-sm"
             >
                  <div className="flex gap-1 items-end h-4 pointer-events-none">
                      <div className="w-1 bg-gray-300 h-2 rounded-full animate-[bounce_1s_infinite]"></div>
                      <div className="w-1 bg-gray-300 h-4 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                      <div className="w-1 bg-gray-300 h-3 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
                  </div>
                  <span className="text-xs font-bold pointer-events-none">气囊调试</span>
             </div>
             {/* SOS */}
             <button 
                onClick={() => setCurrentScreen(Screen.EMERGENCY)}
                className="flex-[1.5] bg-red-500 text-white rounded-[24px] flex items-center justify-center gap-2 font-black text-lg shadow-lg active:scale-95 transition-transform"
             >
                 <Phone size={20} fill="currentColor" />
                 <span>SOS</span>
             </button>
        </div>

      </div>
    </div>
  );

  const renderNavSetup = () => (
    <div className="flex flex-col h-full bg-white rounded-t-[40px] shadow-2xl overflow-hidden animate-slide-up">
      <Header title="规划路线" />
      
      <div className="px-6 flex flex-col gap-6 flex-grow">
        {/* Search Bar */}
        <div className="relative">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400"/>
             </div>
             <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="搜索目的地..."
                className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-12 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                autoFocus
            />
            <button className="absolute right-3 top-3 p-1.5 bg-white rounded-xl shadow-sm text-black">
                <Mic size={18} />
            </button>
        </div>
        
        {navError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-center text-sm font-bold">
            {navError}
          </div>
        )}

        {/* Recent/Favorites */}
        <div className="flex-grow space-y-4 overflow-y-auto no-scrollbar pb-28">
             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">已保存位置</p>
             
             {[
               { icon: <Home size={20} />, label: "家", sub: "1.2km • 步行约15分钟", color: "blue" },
               { icon: <Briefcase size={20} />, label: "公司", sub: "3.5km • 建议公交", color: "orange" },
               { icon: <ShoppingCart size={20} />, label: "沃尔玛超市", sub: "800m • 步行约8分钟", color: "green" },
               { icon: <MapPin size={20} />, label: "人民医院", sub: "2.1km • 步行约25分钟", color: "red" }
             ].map((item, idx) => (
                <button 
                    key={idx}
                    onClick={() => handleStartNavigation(item.label)} 
                    className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-soft hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-500`}>
                        {item.icon}
                    </div>
                    <div className="text-left flex-grow">
                        <div className="font-bold text-lg text-gray-900">{item.label}</div>
                        <div className="text-gray-400 text-xs font-medium">{item.sub}</div>
                    </div>
                    <div className="text-gray-300"><ChevronLeft size={20} className="rotate-180"/></div>
                </button>
             ))}
        </div>

        {/* Sticky Bottom Button */}
        <div className="absolute bottom-6 left-6 right-6">
            <AccessButton 
                label={isLoading ? "正在规划..." : "开始导航"}
                variant="primary"
                className="w-full py-4 shadow-xl"
                onClick={() => handleStartNavigation()}
            />
        </div>
      </div>
    </div>
  );

  const renderNavActive = () => {
      const currentStep = navSteps[currentStepIndex];

      return (
        <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
             
             {/* Header */}
             <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                 <button onClick={() => setCurrentScreen(Screen.HOME)} className="bg-white/80 backdrop-blur border border-gray-200 p-3 rounded-full shadow-sm text-gray-900">
                    <Home size={20} />
                 </button>
                 <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    气囊反馈中
                 </div>
             </div>

             {/* Main Visualizer Area */}
             <div className="flex-grow flex flex-col items-center justify-center relative pt-10">
                 {/* Radial Gradient Background */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-gray-50 opacity-50"></div>
                 
                 {/* The Airbag Visualizer Component */}
                 <div className="transform scale-125 md:scale-150 z-10 mb-8">
                     <GripVisualizer state={gripState} />
                 </div>
             </div>

             {/* Bottom Instruction Card */}
             <div className="bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-8 pb-10 z-20 animate-slide-up">
                 <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${gripState === GripState.WARNING ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'} shadow-lg`}>
                            {currentStep?.direction === 'left' && <ArrowLeft size={32} />}
                            {currentStep?.direction === 'right' && <ArrowRight size={32} />}
                            {currentStep?.direction === 'straight' && <ArrowUp size={32} />}
                            {currentStep?.direction === 'arrive' && <MapPin size={32} />}
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900 leading-none mb-1">{currentStep?.distance}</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">当前指令</div>
                        </div>
                     </div>
                 </div>

                 <p className="text-xl font-bold text-gray-800 leading-snug mb-8">
                    {currentStep?.instruction}
                 </p>

                 <button 
                    onClick={handleNextStep}
                    className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                 >
                    <span>{currentStepIndex === navSteps.length - 1 ? "结束导航" : "下一步"}</span>
                    <ArrowRight size={20} className="opacity-50"/>
                 </button>
             </div>
        </div>
      );
  };

  const renderEmergency = () => (
      <div className="flex flex-col h-full bg-[#FF3B30] text-white p-6 relative overflow-hidden animate-slide-up">
          <div className="flex-grow flex flex-col items-center justify-center text-center relative z-10">
             <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                 <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl text-[#FF3B30]">
                    <Phone size={48} fill="currentColor" />
                 </div>
             </div>
             
             <h1 className="text-4xl font-black mb-2">正在呼叫...</h1>
             <p className="opacity-80 text-lg mb-12">已发送当前位置给紧急联系人</p>
             
             <div className="w-full space-y-4 px-4">
                 <button className="w-full bg-white text-[#FF3B30] py-5 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-transform">
                     免提通话
                 </button>
                 <button 
                    onClick={() => setCurrentScreen(Screen.HOME)}
                    className="w-full bg-black/20 text-white py-5 rounded-3xl font-bold text-lg border border-white/20 active:bg-black/30 transition-colors"
                 >
                     取消
                 </button>
             </div>
          </div>
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl"></div>
      </div>
  );

  const renderWeatherDetail = () => (
      <div className="flex flex-col h-full bg-blue-500 text-white animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
          <div className="p-6 z-20 flex items-center gap-4">
              <button onClick={() => setCurrentScreen(Screen.HOME)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                  <ChevronLeft size={28} />
              </button>
              <span className="text-xl font-bold">天气详情</span>
          </div>

          <div className="px-6 flex flex-col gap-8 z-10">
              <div className="text-center mt-4">
                  <div className="text-[80px] font-black leading-none">24°</div>
                  <div className="text-xl font-medium opacity-90 mt-2">多云转晴 • 空气优</div>
                  <div className="flex justify-center gap-8 mt-6">
                      <div className="flex flex-col items-center gap-1">
                          <Wind size={20} className="opacity-70"/>
                          <span className="text-sm font-bold">3级</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <CloudRain size={20} className="opacity-70"/>
                          <span className="text-sm font-bold">10%</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Sun size={20} className="opacity-70"/>
                          <span className="text-sm font-bold">UV弱</span>
                      </div>
                  </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold uppercase opacity-60 mb-4">未来24小时</h3>
                  <div className="flex justify-between">
                      {[
                          { time: '现在', icon: <Cloud size={20}/>, temp: '24°' },
                          { time: '16:00', icon: <Sun size={20}/>, temp: '25°' },
                          { time: '18:00', icon: <CloudRain size={20}/>, temp: '22°' },
                          { time: '20:00', icon: <Cloud size={20}/>, temp: '20°' },
                      ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-3">
                              <span className="text-xs font-medium opacity-80">{item.time}</span>
                              {item.icon}
                              <span className="font-bold">{item.temp}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSettings = () => (
      <div className="flex flex-col h-full bg-[#F2F4F6] animate-slide-up">
          <Header title="设置" />
          <div className="px-4 pb-20 overflow-y-auto no-scrollbar space-y-6">
              
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">音频与触感</h3>
                  
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Volume2 size={20}/></div>
                              <span className="font-bold text-gray-900">语音播报音量</span>
                          </div>
                          <span className="font-bold text-gray-400">{volume}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={volume} 
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />

                      <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Vibrate size={20}/></div>
                              <span className="font-bold text-gray-900">气囊反馈强度</span>
                          </div>
                          <span className="font-bold text-gray-400">{hapticStrength}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={hapticStrength} 
                        onChange={(e) => setHapticStrength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                  </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">通用</h3>
                   {[
                       { label: "显示模式", val: "高对比度", icon: <Eye size={20}/> },
                       { label: "账户安全", val: "已保护", icon: <Settings size={20}/> }
                   ].map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">{item.icon}</div>
                                <span className="font-bold text-gray-900">{item.label}</span>
                            </div>
                            <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                                {item.val} <ChevronLeft size={16} className="rotate-180"/>
                            </span>
                       </div>
                   ))}
              </div>

              <button className="w-full py-4 bg-white text-red-500 font-bold rounded-3xl shadow-sm">
                  退出登录
              </button>
          </div>
      </div>
  );

  const renderDeviceDetail = () => (
      <div className="flex flex-col h-full bg-[#F2F4F6] animate-slide-up">
          <Header title="手杖状态" />
          <div className="px-4 pb-10 overflow-y-auto no-scrollbar">
               {/* Hero Visual */}
               <div className="bg-white rounded-[32px] p-8 flex flex-col items-center justify-center shadow-soft mb-6 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0"></div>
                   <div className="w-32 h-64 relative z-10 transform rotate-12">
                       {/* Simplified bigger cane visual */}
                       <div className="w-6 h-full bg-gray-200 rounded-full mx-auto relative">
                           <div className="absolute top-0 w-16 h-24 bg-gray-800 rounded-t-2xl rounded-bl-3xl -left-4"></div>
                           <div className="absolute bottom-0 w-8 h-8 bg-black rounded-full -left-1"></div>
                       </div>
                   </div>
                   <div className="mt-6 text-center z-10">
                       <h2 className="text-2xl font-black text-gray-900">Smart Cane Pro</h2>
                       <p className="text-gray-400 font-medium">固件版本 v2.4.1</p>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white p-5 rounded-3xl shadow-sm">
                       <div className="flex items-center gap-2 mb-2 text-green-600">
                           <Battery size={20}/>
                           <span className="font-bold">电池</span>
                       </div>
                       <div className="text-3xl font-black text-gray-900">62%</div>
                       <div className="text-xs text-gray-400 mt-1">预计可用 4 小时</div>
                   </div>
                   <div className="bg-white p-5 rounded-3xl shadow-sm">
                       <div className="flex items-center gap-2 mb-2 text-blue-600">
                           <Bluetooth size={20}/>
                           <span className="font-bold">连接</span>
                       </div>
                       <div className="text-lg font-black text-gray-900 mt-1">信号极佳</div>
                       <div className="text-xs text-gray-400 mt-1">蓝牙 5.2</div>
                   </div>
               </div>

               <div className="bg-white rounded-3xl p-2 shadow-sm">
                   <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 rounded-2xl transition-colors">
                       <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                           <Volume2 size={24}/>
                       </div>
                       <div className="text-left">
                           <div className="font-bold text-gray-900">查找我的手杖</div>
                           <div className="text-xs text-gray-400">播放高音量提示音</div>
                       </div>
                   </button>
               </div>
          </div>
      </div>
  );

  const renderGripSettings = () => (
      <div className="flex flex-col h-full bg-[#F2F4F6] animate-slide-up">
          <Header title="气囊调试" />
          <div className="px-4 flex flex-col gap-6 h-full pb-10">
              
              <div className="bg-white rounded-[40px] p-8 flex items-center justify-center shadow-soft flex-grow max-h-[45%]">
                  <GripVisualizer state={gripState} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                  {[
                      { label: "测试左转", act: () => triggerGripFeedback('left') },
                      { label: "测试直行", act: () => triggerGripFeedback('straight') },
                      { label: "测试右转", act: () => triggerGripFeedback('right') },
                  ].map((btn, idx) => (
                      <button 
                        key={idx} 
                        onClick={btn.act}
                        className="py-4 bg-white border border-gray-200 rounded-2xl font-bold text-sm shadow-sm active:bg-black active:text-white transition-colors"
                      >
                          {btn.label}
                      </button>
                  ))}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                       <span className="font-bold text-gray-900">气囊灵敏度</span>
                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">自适应</span>
                   </div>
                   <div className="h-12 bg-gray-100 rounded-xl w-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-[75%] bg-black/10 rounded-xl"></div>
                       <div className="absolute left-4 top-0 bottom-0 flex items-center text-xs font-bold text-gray-500">
                           压力值实时监控
                       </div>
                   </div>
              </div>
          </div>
      </div>
  );

  const renderNotifications = () => (
      <div className="flex flex-col h-full bg-[#F2F4F6] animate-slide-up">
           <Header title="消息中心" />
           <div className="px-4 space-y-3">
               {[
                   { title: "固件更新可用", time: "10分钟前", type: "system", read: false },
                   { title: "电量低于 20%", time: "昨天", type: "alert", read: true },
                   { title: "导航记录周报", time: "周一", type: "info", read: true }
               ].map((notif, idx) => (
                   <div key={idx} className={`p-5 rounded-3xl bg-white shadow-sm flex gap-4 ${!notif.read ? 'border-l-4 border-blue-500' : ''}`}>
                       <div className={`p-3 rounded-full ${notif.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}>
                           <Bell size={20} />
                       </div>
                       <div>
                           <div className="font-bold text-gray-900">{notif.title}</div>
                           <div className="text-xs text-gray-400 font-medium mt-1">{notif.time}</div>
                       </div>
                   </div>
               ))}
           </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 font-sans text-gray-900 overflow-hidden relative flex items-center justify-center">
      <div className="w-full max-w-[420px] h-[100dvh] md:h-[90dvh] md:max-h-[850px] md:rounded-[48px] bg-[#F2F4F6] shadow-2xl overflow-hidden relative flex flex-col border-[8px] border-white ring-1 ring-gray-900/5 selection:bg-blue-100">
        {currentScreen === Screen.HOME && renderHome()}
        {currentScreen === Screen.NAVIGATION_SETUP && renderNavSetup()}
        {currentScreen === Screen.NAVIGATION_ACTIVE && renderNavActive()}
        {currentScreen === Screen.EMERGENCY && renderEmergency()}
        {currentScreen === Screen.WEATHER_DETAIL && renderWeatherDetail()}
        {currentScreen === Screen.SETTINGS && renderSettings()}
        {currentScreen === Screen.DEVICE_DETAIL && renderDeviceDetail()}
        {currentScreen === Screen.GRIP_SETTINGS && renderGripSettings()}
        {currentScreen === Screen.NOTIFICATIONS && renderNotifications()}
      </div>
    </div>
  );
};

export default App;
