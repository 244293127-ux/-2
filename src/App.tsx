import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Coffee, 
  Wind, 
  Sparkles, 
  BellOff, 
  Smartphone, 
  Clock, 
  Home, 
  User, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Timer,
  Layout,
  Music,
  Heart,
  Coffee as CoffeeIcon,
  Map,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---
type TimePoint = '🌙 深夜 23:30' | '🌅 清晨 07:00' | '☀️ 下午 14:00' | '☕ 下午 16:30';

interface ScenarioData {
  space: string;
  userA: string;
  userB: string;
  aNeed: string;
  bNeed: string;
  strategy: string;
  popupA: { msg: string; actions: string[]; icon: React.ReactNode } | null;
  popupB: { msg: string; actions: string[]; icon: React.ReactNode } | null;
  aHint?: string;
  bHint?: string;
}

const SCENARIOS: Record<TimePoint, ScenarioData> = {
  '🌙 深夜 23:30': {
    space: 'A在公司 / B在卧室',
    userA: '疲惫归家',
    userB: '深度睡眠',
    aNeed: '预热归家环境',
    bNeed: '深度睡眠免打扰',
    strategy: '『车家双端联动守护』。车端预热：已提前开启车内空调与座椅加热。家端静默：开启 10% 暖黄踢脚线灯，暂存非紧急播报，确保卧室内 B 的绝对静谧。',
    popupA: {
      msg: "✨ 小爱提醒：外面降温啦，车内空调和座椅加热已为您开启。回家路上慢点开，家里的夜灯和热水也准备好啦。",
      actions: ["好的", "不用开灯"],
      icon: <Moon className="w-5 h-5 text-brand" />
    },
    popupB: null
  },
  '🌅 清晨 07:00': {
    space: 'A在厨房 / B在卧室',
    userA: '浅睡刚醒',
    userB: '深度睡眠',
    aNeed: '晨间提神补给',
    bNeed: '继续深度睡眠',
    strategy: '『晨间无感接力』。预热厨房设备，制冰机静音启动，保持卧室环境绝对静默，避免光影干扰。',
    popupA: {
      msg: "✨ 小爱提醒：早上好，需要按习惯为您提前预热咖啡机并制冰吗？",
      actions: ["一键执行", "今天不想"],
      icon: <CoffeeIcon className="w-5 h-5 text-brand" />
    },
    popupB: null
  },
  '☀️ 下午 14:00': {
    space: 'A在书房 / B在客厅',
    userA: '高压专注',
    userB: '准备做瑜伽',
    aNeed: '沉浸式工作空间',
    bNeed: '运动氛围营造',
    strategy: '『独立空间精细托管』。书房开启专注光线；客厅空调调至 26℃ 微风，音箱系统就绪，互不打扰。',
    popupA: null,
    aHint: "🎯 书房专注模式已开启。",
    popupB: {
      msg: "✨ 小爱提醒：检测到您准备做瑜伽，客厅空调已调至 26℃，要不要用音箱播放您最爱的冥想歌单？",
      actions: ["开始播放", "保持安静"],
      icon: <Music className="w-5 h-5 text-brand" />
    }
  },
  '☕ 下午 16:30': {
    space: '均在家 - 客厅/书房',
    userA: '久坐疲劳',
    userB: '闲暇 / 看旅游攻略',
    aNeed: '急需放松但不想被打断',
    bNeed: '心情放松，规划旅行',
    strategy: '综合策略：双人协同关怀。不主动发声惊扰 A，向 B 推送互动提醒。',
    popupA: null,
    aHint: "🎯 专注模式持续运行中。",
    popupB: {
      msg: "✨ 小爱提醒：看了好一会云南攻略啦，刚好起身活动一下身体。A 已经连续工作 3 小时了，要不要顺手给他倒杯水呀？",
      actions: ["包在我身上", "让他继续卷"],
      icon: <Heart className="w-5 h-5 text-brand" />
    }
  }
};

// --- Components ---

const Card = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100 ${className}`}>
    <h3 className="text-[9px] font-bold text-zinc-400 mb-5 flex items-center gap-2 uppercase tracking-[0.2em]">
      {title}
    </h3>
    {children}
  </div>
);

const Metric = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
  <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
    <div className="text-[8px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1.5">
      {typeof Icon === 'string' ? <span className="text-[10px]">{Icon}</span> : <Icon className="w-3 h-3 text-brand" />} {label}
    </div>
    <div className="text-[11px] font-bold text-zinc-800">{value}</div>
  </div>
);

const PhoneUI = ({ owner, content }: { owner: string; content: React.ReactNode }) => (
  <div className="relative mx-auto border-[2px] border-zinc-200 rounded-[24px] h-[380px] w-[180px] bg-white shadow-xl overflow-hidden">
    {/* Minimal Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-zinc-200 rounded-b-lg z-30" />
    
    {/* Content Area */}
    <div className="p-3.5 h-full bg-white flex flex-col relative">
      <div className="mt-4 flex-1">
        <div className="text-[7px] text-zinc-300 font-bold mb-1 uppercase tracking-widest">Terminal {owner}</div>
        <div className="h-[1px] w-4 bg-zinc-100 mb-4" />
        
        {/* Notification Layer */}
        <div className="absolute inset-x-0 top-2 px-2 z-20 pointer-events-none">
          {content}
        </div>

        {/* Background Content Simulation */}
        <div className="space-y-3 opacity-10 pointer-events-none">
          <div className="h-20 bg-zinc-100 rounded-xl" />
          <div className="h-32 bg-zinc-100 rounded-xl" />
          <div className="h-20 bg-zinc-100 rounded-xl" />
        </div>
      </div>
      <div className="h-0.5 w-8 bg-zinc-100 rounded-full mx-auto mb-1" />
    </div>
  </div>
);

const Notification = ({ msg, actions, icon }: { msg: string; actions: string[]; icon: React.ReactNode }) => (
  <div className="animate-slide-down pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-[20px] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-white/50">
    <div className="flex items-start gap-2.5 mb-2.5">
      <div className="w-6 h-6 rounded-lg bg-zinc-50 shadow-sm flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-[8px] leading-relaxed text-zinc-700 font-bold">
        {msg}
      </p>
    </div>
    <div className="flex gap-1.5">
      {actions.map((action, idx) => (
        <button 
          key={idx}
          className={`flex-1 py-1.5 rounded-lg text-[7px] font-bold transition-all border ${
            idx === 0 
              ? 'bg-brand-light border-brand/10 text-brand' 
              : 'bg-white border-zinc-100 text-zinc-400'
          }`}
        >
          {action}
        </button>
      ))}
    </div>
  </div>
);

const FlowArrow = () => (
  <div className="hidden lg:flex flex-col items-center justify-center">
    <ChevronRight className="w-6 h-6 text-brand-arrow stroke-[3px]" />
  </div>
);

// --- Main App ---

export default function App() {
  const [time, setTime] = useState<TimePoint>('🌅 清晨 07:00');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  const scenario = SCENARIOS[time];

  const runSimulation = () => {
    setIsSimulating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResult(true);
    }, 1200);
  };

  useEffect(() => {
    setShowResult(false);
  }, [time]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#333333] font-sans p-8 selection:bg-brand-light selection:text-brand">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Spatial OS</h1>
          <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-[0.4em]">Brand Identity v10.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-sm shadow-sm">🧑‍💻</div>
            <div className="w-8 h-8 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-sm shadow-sm">👩‍⚖️</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-white border border-zinc-100 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
          
          {/* Column 1: System Memory */}
          <Card title="STEP 1 习惯特征库">
            <div className="space-y-6">
              <div className="p-4 bg-zinc-50 rounded-[12px] border border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🧑‍💻</span>
                  <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-wider">USER A</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  博一在读，科研项目高压期；清晨必喝冰咖啡；习惯长时间久坐；深夜归家频次较高。
                </p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-[12px] border border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">👩‍⚖️</span>
                  <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-wider">USER B</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  作息极度规律，23:00 准时深睡；周末下午喜欢瑜伽；近期在搜索云南旅游攻略。
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[8px] font-bold text-brand uppercase tracking-widest">
                <Heart className="w-2.5 h-2.5 fill-current" /> 亲密关系：同居伴侣
              </div>
            </div>
          </Card>

          <FlowArrow />

          {/* Column 2: Perception */}
          <Card title="STEP 2 实时环境输入">
            <div className="space-y-6">
              <div>
                <label className="text-[8px] font-bold text-zinc-400 uppercase mb-2 block tracking-wider">选择演示时间轴</label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value as TimePoint)}
                  className="w-full bg-zinc-50 border-zinc-100 rounded-xl px-3 py-3 text-[11px] font-bold focus:ring-2 focus:ring-brand-light outline-none transition-all cursor-pointer"
                >
                  <option>🌅 清晨 07:00</option>
                  <option>☀️ 下午 14:00</option>
                  <option>☕ 下午 16:30</option>
                  <option>🌙 深夜 23:30</option>
                </select>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <Metric label="当前空间状态" value={scenario.space} icon={Home} />
                <Metric label="User A 实时状态" value={scenario.userA} icon="🧑‍💻" />
                <Metric label="User B 实时状态" value={scenario.userB} icon="👩‍⚖️" />
              </div>

              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full mt-4 bg-white border border-brand text-brand rounded-xl py-3.5 text-[9px] font-bold flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                🚀 开始系统计算
              </button>
            </div>
          </Card>

          <FlowArrow />

          {/* Column 3: Decision Engine */}
          <Card title="STEP 3 情境决策引擎">
            <div className="relative min-h-[340px] flex flex-col">
              {isSimulating ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mb-3 text-brand" />
                  <p className="text-[8px] font-bold text-brand uppercase tracking-widest">Analyzing Context...</p>
                </div>
              ) : showResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-brand-light flex items-center justify-center mt-0.5 text-[10px]">🧑‍💻</div>
                      <div>
                        <div className="text-[7px] font-bold text-zinc-400 uppercase mb-0.5">需求识别</div>
                        <p className="text-[10px] font-bold text-zinc-700">{scenario.aNeed}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-brand-light flex items-center justify-center mt-0.5 text-[10px]">👩‍⚖️</div>
                      <div>
                        <div className="text-[7px] font-bold text-zinc-400 uppercase mb-0.5">需求识别</div>
                        <p className="text-[10px] font-bold text-zinc-700">{scenario.bNeed}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-[#FFF9F5] rounded-[16px] border border-[#FFE0CC] shadow-[0_4px_16px_rgba(255,105,0,0.05)]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[7px] font-bold text-[#333333] uppercase tracking-widest">综合策略方案</span>
                    </div>
                    <p className="text-[10px] leading-[1.6] text-[#555555] font-medium">
                      {scenario.strategy}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[8px] font-bold text-emerald-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/30">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    策略已同步至云端终端
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-200">
                  <Layout className="w-6 h-6 mb-3 opacity-20" />
                  <p className="text-[8px] font-bold uppercase tracking-widest">Waiting for Input</p>
                </div>
              )}
            </div>
          </Card>

          <FlowArrow />

          {/* Column 4: Mobile Terminal */}
          <Card title="STEP 4 终端双端触达">
            <div className="space-y-6">
              <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
                <button 
                  onClick={() => setActiveTab('A')}
                  className={`flex-1 py-1.5 text-[8px] font-bold rounded-lg transition-all ${activeTab === 'A' ? 'bg-white shadow-sm text-brand' : 'text-zinc-400'}`}
                >
                  📱 USER A
                </button>
                <button 
                  onClick={() => setActiveTab('B')}
                  className={`flex-1 py-1.5 text-[8px] font-bold rounded-lg transition-all ${activeTab === 'B' ? 'bg-white shadow-sm text-brand' : 'text-zinc-400'}`}
                >
                  📱 USER B
                </button>
              </div>

              <div className="flex justify-center">
                <AnimatePresence mode="wait">
                  {activeTab === 'A' ? (
                    <motion.div
                      key="phoneA"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PhoneUI 
                        owner="A" 
                        content={
                          showResult && scenario.popupA ? (
                            <Notification {...scenario.popupA} />
                          ) : showResult && scenario.aHint ? (
                            <div className="animate-slide-down bg-white/95 backdrop-blur-md p-2.5 rounded-[16px] border border-white/50 shadow-lg">
                              <p className="text-[7px] font-bold text-zinc-400 flex items-center gap-1.5">
                                <Zap className="w-2.5 h-2.5 text-brand" /> {scenario.aHint}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-200">
                              <Clock className="w-5 h-5 mb-2 opacity-20" />
                              <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-300">Standby</p>
                            </div>
                          )
                        } 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="phoneB"
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PhoneUI 
                        owner="B" 
                        content={
                          showResult && scenario.popupB ? (
                            <Notification {...scenario.popupB} />
                          ) : showResult && scenario.userB === '深度睡眠' ? (
                            <div className="animate-slide-down flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-4 rounded-[20px] shadow-lg border border-white/50">
                              <BellOff className="w-5 h-5 mb-2 text-zinc-300" />
                              <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-400">深度睡眠中</p>
                              <p className="text-[6px] font-bold text-zinc-300 mt-0.5">暂无打扰推送</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-200">
                              <Clock className="w-5 h-5 mb-2 opacity-20" />
                              <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-300">Standby</p>
                            </div>
                          )
                        } 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-24 text-center">
        <div className="h-[1px] w-10 bg-zinc-100 mx-auto mb-6" />
        <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-[0.5em]">
          Spatial OS © 2026 Visual Refinement
        </p>
      </div>
    </div>
  );
}
