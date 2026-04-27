'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Home, 
  ListTodo, 
  Bell, 
  Settings, 
  Wallet, 
  AlertCircle, 
  GripVertical, 
  CheckCircle2, 
  MessageCircle,
  CreditCard,
  Building,
  Store,
  Ticket,
  Plus,
  X,
  Edit2,
  Trash2,
  Calendar,
  Infinity as InfinityIcon,
  Layers,
  ArrowRight,
  FolderOpen,
  Coffee,
  ShoppingBag
} from 'lucide-react';
import clsx from 'clsx';

// ======= Types & Initial Data =======

type Point = {
  id: string;
  provider: string; // e.g. 國泰世華
  type: string; // e.g. 小樹點
  balance: number;
  expiring: number;
  expireDate: string | null; // YYYY-MM-DD or null for infinite
  color: string;
  iconName: string;
  groupId: string | null;
};

type PointGroup = {
  id: string;
  name: string;
};

const ICON_MAP: Record<string, React.ElementType> = {
  Building, CreditCard, Store, Ticket, Coffee, ShoppingBag
};

const INITIAL_POINTS: Point[] = [
  { id: '1', provider: '國泰世華', type: '小樹點', balance: 1250, expiring: 50, expireDate: '2026-05-01', color: 'bg-emerald-500', iconName: 'Building', groupId: null },
  { id: '2', provider: '台新銀行', type: 'Point', balance: 800, expiring: 0, expireDate: null, color: 'bg-red-500', iconName: 'CreditCard', groupId: null },
  { id: '3', provider: 'OPENPOINT', type: '點數', balance: 350, expiring: 20, expireDate: '2026-04-30', color: 'bg-orange-500', iconName: 'Store', groupId: null },
  { id: '4', provider: '全家便利商店', type: 'Fa點', balance: 12000, expiring: 0, expireDate: null, color: 'bg-blue-500', iconName: 'Store', groupId: null },
  { id: '5', provider: '威秀影城', type: 'iShow點', balance: 4, expiring: 1, expireDate: '2026-05-15', color: 'bg-purple-600', iconName: 'Ticket', groupId: null },
];

const INITIAL_GROUPS: PointGroup[] = [
  { id: 'g1', name: '日常消費' },
];

const INITIAL_ACTIVITIES = [
  { id: 'a1', title: '星巴克大杯買一送一', cost: '100 小樹點', provider: '國泰世華', tag: '限時' },
  { id: 'a2', title: '茶葉蛋免費換', cost: '10 Fa點', provider: '全家便利商店', tag: '熱門' },
  { id: 'a3', title: '威秀電影票免費換', cost: '1 iShow點', provider: '威秀影城', tag: '推薦' },
  { id: 'a4', title: 'CITY CAFE 提貨券', cost: '30 OPENPOINT', provider: 'OPENPOINT', tag: '實用' },
];

const NOTIFICATIONS = [
  { id: 'n1', title: '點數即將到期提醒', message: '您有 50 點國泰小樹點將於 2026-05-01 到期，請盡快使用！', time: '1 小時前', isUnread: true },
  { id: 'n2', title: 'LINE 通知已啟用', message: '您已成功綁定 LINE Bot，未來將透過 LINE 接收到期通知。', time: '1 天前', isUnread: false },
];

// ======= Main Application =======

export default function UniPointsApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [groups, setGroups] = useState<PointGroup[]>(INITIAL_GROUPS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [lineConnected, setLineConnected] = useState(false);

  const unreadCount = NOTIFICATIONS.filter(n => n.isUnread).length;

  const NAV_ITEMS = [
    { id: 'home', icon: Wallet, label: '跨界錢包' },
    { id: 'activities', icon: ListTodo, label: '願望活動' },
    { id: 'notifications', icon: Bell, label: '智能通知', badge: unreadCount },
    { id: 'settings', icon: Settings, label: '系統設定' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gray-50 selection:bg-blue-100 font-sans transition-all text-gray-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">UniPoints</h1>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={clsx(
                    "w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-left",
                    isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  )}
                >
                  <div className="relative">
                    <Icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6">
           <div className={clsx("p-4 rounded-2xl flex items-center space-x-3 text-sm font-semibold transition-colors", lineConnected ? "bg-[#06C755]/10 text-[#06C755]" : "bg-gray-50 text-gray-400")}>
             <MessageCircle className="w-5 h-5" />
             <span>{lineConnected ? 'LINE 已連動' : '未連動 LINE'}</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeTab key="home" points={points} setPoints={setPoints} groups={groups} setGroups={setGroups} />}
          {activeTab === 'activities' && <ActivitiesTab key="activities" activities={activities} setActivities={setActivities} />}
          {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
          {activeTab === 'settings' && <SettingsTab key="settings" lineConnected={lineConnected} setLineConnected={setLineConnected} />}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <div className="md:hidden flex-shrink-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-safe box-border shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-50">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center space-y-1.5 focus:outline-none w-16"
            >
              <div className="relative">
                <Icon
                  className={clsx("w-6 h-6 transition-all duration-300", isActive ? "text-blue-600 scale-110" : "text-gray-400")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={clsx("text-[10px] font-bold transition-colors duration-300", isActive ? "text-blue-600" : "text-gray-400")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ======= Individual Tabs =======

function HomeTab({ points, setPoints, groups, setGroups }: { points: Point[], setPoints: any, groups: PointGroup[], setGroups: any }) {
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoveredDropId, setHoveredDropId] = useState<string | null>(null); // group id or point id
  const [hoverAction, setHoverAction] = useState<'group' | 'merge' | null>(null);

  const expiringTotal = points.reduce((acc, curr) => acc + curr.expiring, 0);
  const totalValue = points.reduce((acc, curr) => acc + (curr.balance * (curr.provider === '國泰世華' ? 1 : 0.8)), 0);

  // Drag and drop logic
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('pointId', id);
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, id: string, type: 'group' | 'point') => {
    e.preventDefault();
    if (id === draggedId) return;

    setHoveredDropId(id);
    if (type === 'point') {
       const source = points.find(p => p.id === draggedId);
       const target = points.find(p => p.id === id);
       if (source && target && source.provider === target.provider) {
         setHoverAction('merge');
       } else {
         setHoverAction('group');
       }
    } else {
       setHoverAction('group');
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setHoveredDropId(null);
    setHoverAction(null);
  };

  const onDrop = (e: React.DragEvent, targetId: string, type: 'group' | 'point') => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('pointId');
    if (!sourceId || sourceId === targetId) {
      clearDrag();
      return;
    }

    if (type === 'group') {
      // Move to folder
      setPoints(points.map(p => p.id === sourceId ? { ...p, groupId: targetId } : p));
    } else if (type === 'point') {
      const source = points.find(p => p.id === sourceId);
      const target = points.find(p => p.id === targetId);
      
      if (source && target) {
        if (source.provider === target.provider) {
          // Verify Merge
          const confirmMerge = window.confirm(`是否將 ${source.provider} 點數合併？`);
          if (confirmMerge) {
            setPoints(points.map(p => {
              if (p.id === targetId) return { ...p, balance: p.balance + source.balance, expiring: p.expiring + source.expiring };
              return p;
            }).filter(p => p.id !== sourceId));
          }
        } else {
          // Create new group and put both inside
          const groupName = window.prompt('請輸入新群組名稱：', '新群組');
          if (groupName) {
            const newGroupId = `g-${crypto.randomUUID()}`;
            setGroups([...groups, { id: newGroupId, name: groupName }]);
            setPoints(points.map(p => (p.id === sourceId || p.id === targetId) ? { ...p, groupId: newGroupId } : p));
          }
        }
      }
    }
    clearDrag();
  };

  const clearDrag = () => {
    setDraggedId(null);
    setHoveredDropId(null);
    setHoverAction(null);
  };

  const removeGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setPoints(points.map(p => p.groupId === groupId ? { ...p, groupId: null } : p));
  };

  const unassignedPoints = points.filter(p => p.groupId === null);

  return (
    <div className="h-full overflow-y-auto pb-24 p-6 md:p-10 space-y-8 scrollbar-hide relative">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-sm font-medium">早安，開發者 👋</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">跨界資產總覽</h1>
        </div>
        <button 
          onClick={() => setIsAddingMode(true)}
          className="h-10 px-4 bg-gray-900 text-white rounded-full flex items-center font-bold text-sm shadow-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" /> 新增點數
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden h-full flex flex-col justify-between">
           <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="relative z-10">
             <p className="text-blue-200 text-sm font-medium flex items-center">
               預估總價值 (TWD) <AlertCircle className="w-3.5 h-3.5 ml-2 opacity-50" />
             </p>
             <h2 className="text-5xl font-black mt-2 tracking-tight">$ {Math.floor(totalValue).toLocaleString()}</h2>
           </div>
           <div className="relative z-10 mt-10 inline-flex items-center text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 self-start">
               <Wallet className="w-4 h-4 mr-2" />
               已整合 {new Set(points.map(p=>p.provider)).size} 家平台
           </div>
        </div>

        {expiringTotal > 0 && (
          <div className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-gray-900 font-black text-xl">點數即將到期</h3>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">您有 <strong className="text-red-500 text-lg font-black">{expiringTotal}</strong> 點將於近日到期，點擊下方願望清單尋找兌換靈感，確保您的權益不受損。</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 px-1">點數管理 <span className="text-sm font-normal text-gray-400 ml-2">拖曳卡片以合併或建立群組</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Groups */}
          {groups.map(group => {
            const groupPoints = points.filter(p => p.groupId === group.id);
            const isHovered = hoveredDropId === group.id;

            return (
              <div 
                key={group.id}
                onDragOver={(e) => onDragOver(e, group.id, 'group')}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, group.id, 'group')}
                className={clsx(
                  "p-5 rounded-3xl border-2 transition-all flex flex-col min-h-[200px]",
                  isHovered ? "bg-blue-50 border-blue-400 border-dashed" : "bg-gray-100/50 border-transparent",
                  groupPoints.length === 0 && !isHovered && "hidden" // hide empty groups unless dragging
                )}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-700 font-bold">
                    <FolderOpen className="w-5 h-5 mr-2 text-gray-500" />
                    {group.name}
                  </div>
                  <button onClick={() => removeGroup(group.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                </div>
                
                <div className="space-y-3 flex-1">
                  {groupPoints.map(point => (
                    <PointCard 
                      key={point.id} 
                      point={point} 
                      onEdit={() => setEditingPoint(point)}
                      onDragStart={onDragStart}
                      isDragging={draggedId === point.id}
                    />
                  ))}
                  {groupPoints.length === 0 && isHovered && (
                    <div className="h-full flex items-center justify-center text-blue-500 font-bold text-sm">放開以加入群組</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Unassigned Points */}
          {unassignedPoints.map(point => {
             const isHovered = hoveredDropId === point.id;
             const isMerge = hoverAction === 'merge';

             return (
               <div
                 key={point.id}
                 onDragOver={(e) => onDragOver(e, point.id, 'point')}
                 onDragLeave={onDragLeave}
                 onDrop={(e) => onDrop(e, point.id, 'point')}
                 className="relative"
               >
                 {isHovered && (
                   <div className={clsx("absolute inset-0 z-10 rounded-3xl border-2 border-dashed flex items-center justify-center bg-white/80 backdrop-blur-sm font-bold text-sm shadow-xl", isMerge ? "border-emerald-500 text-emerald-600" : "border-blue-500 text-blue-600")}>
                     {isMerge ? `合併 ${point.provider} 點數` : '建立新群組'}
                   </div>
                 )}
                 <PointCard 
                   point={point} 
                   onEdit={() => setEditingPoint(point)} 
                   onDragStart={onDragStart}
                   isDragging={draggedId === point.id}
                 />
               </div>
             );
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingPoint && <EditPointModal point={editingPoint} onClose={() => setEditingPoint(null)} onSave={(p) => {
          setPoints(points.map(pt => pt.id === p.id ? p : pt));
          setEditingPoint(null);
        }} onDelete={(id) => {
          setPoints(points.filter(pt => pt.id !== id));
          setEditingPoint(null);
        }} />}

        {isAddingMode && <EditPointModal isNew onClose={() => setIsAddingMode(false)} onSave={(p) => {
          setPoints([...points, p]);
          setIsAddingMode(false);
        }} onDelete={()=>{}} />}
      </AnimatePresence>
    </div>
  )
}

function PointCard({ point, onEdit, onDragStart, isDragging }: { point: Point, onEdit: () => void, onDragStart: (e: React.DragEvent, id: string) => void, isDragging?: boolean }) {
  const Icon = ICON_MAP[point.iconName] || Store;
  const isInfinite = point.expireDate === null;

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, point.id)}
      onClick={onEdit}
      className={clsx(
        "bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md cursor-pointer group",
        isDragging && "opacity-40 scale-95"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105", point.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-base">{point.provider}</h4>
          <div className="flex items-center text-gray-400 text-xs mt-1 font-medium">
             <span>{point.type}</span>
             <span className="mx-2">•</span>
             {isInfinite ? <span className="flex items-center"><InfinityIcon className="w-3 h-3 mr-1"/> 無限期</span> : <span>{point.expireDate} 到期</span>}
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <p className="font-black text-gray-900 text-xl tracking-tight">{point.balance.toLocaleString()}</p>
        {point.expiring > 0 && <p className="text-red-500 text-[10px] mt-1 font-bold bg-red-50 px-2 py-0.5 rounded-full">{point.expiring} 點即將失效</p>}
      </div>
    </div>
  );
}

function EditPointModal({ point, isNew, onClose, onSave, onDelete }: { point?: Point, isNew?: boolean, onClose: () => void, onSave: (p: Point) => void, onDelete: (id: string) => void }) {
  const [formData, setFormData] = useState<Point>(() => point || {
    id: `p-${crypto.randomUUID()}`, provider: '', type: '', balance: 0, expiring: 0, expireDate: null, color: 'bg-gray-800', iconName: 'Store', groupId: null
  });
  const [isInfinite, setIsInfinite] = useState(() => !point?.expireDate && !isNew);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div 
        initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}}
        className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative z-10 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">{isNew ? '新增點數' : '編輯點數'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-4 h-4"/></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">提供者 (Provider)</label>
            <input type="text" value={formData.provider} onChange={e=>setFormData({...formData, provider: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：國泰世華" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">點數類型</label>
              <input type="text" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：小樹點" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">總餘額</label>
              <input type="number" value={formData.balance} onChange={e=>setFormData({...formData, balance: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
               <label className="text-sm font-bold text-gray-900 flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500"/> 到期設定</label>
               <label className="flex items-center space-x-2 cursor-pointer">
                 <input type="checkbox" checked={isInfinite} onChange={(e) => {
                   setIsInfinite(e.target.checked);
                   if (e.target.checked) setFormData({...formData, expireDate: null, expiring: 0});
                 }} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                 <span className="text-sm font-semibold text-gray-600">無限期</span>
               </label>
            </div>
            {!isInfinite && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">即將到期數量</label>
                  <input type="number" value={formData.expiring} onChange={e=>setFormData({...formData, expiring: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">到期日</label>
                  <input type="date" value={formData.expireDate || ''} onChange={e=>setFormData({...formData, expireDate: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            {!isNew && (
              <button onClick={() => onDelete(formData.id)} className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5"/>
              </button>
            )}
            <button onClick={() => onSave(formData)} disabled={!formData.provider} className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
              儲存變更 <ArrowRight className="w-4 h-4 ml-2"/>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ActivitiesTab({ activities, setActivities }: { activities: any[], setActivities: any }) {
  return (
    <div className="h-full flex flex-col md:p-10">
      <div className="p-6 md:px-0 flex-shrink-0 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black text-gray-900">兌換願望與活動清單</h1>
           <p className="text-gray-500 text-sm mt-2 font-medium">上下拖曳卡片來安排兌換的優先順序</p>
        </div>
        <button className="hidden md:flex h-10 px-4 bg-gray-900 text-white rounded-full items-center font-bold text-sm shadow-md hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4 mr-1.5" /> 新增目標
        </button>
      </div>

      <div className="p-6 md:px-0 flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-10 max-w-3xl">
        <Reorder.Group axis="y" values={activities} onReorder={setActivities} className="space-y-4">
          {activities.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                     <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">{item.tag}</span>
                     <span className="text-xs text-gray-400 font-bold">{item.provider}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                </div>
              </div>
              <div className="flex justify-end w-full md:w-auto ml-14 md:ml-0">
                 <span className="font-black text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center">
                   {item.cost}
                 </span>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        <div className="mt-10 text-center">
           <p className="text-sm text-gray-400 font-bold bg-gray-100/50 inline-block px-4 py-2 rounded-full">
             已經到底囉！快去累積更多點數 🎁
           </p>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="h-full overflow-y-auto pb-24 p-6 md:p-10 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">智能通知</h1>
        <p className="text-gray-500 font-medium mt-2 text-sm">重要點數異動與到期提醒</p>
      </div>
      
      <div className="space-y-4">
        {NOTIFICATIONS.map((note) => (
          <div key={note.id} className={clsx("p-6 rounded-3xl border transition-all relative overflow-hidden", note.isUnread ? "bg-blue-50/40 border-blue-100 shadow-sm" : "bg-white border-gray-100")}>
            {note.isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <div className="flex justify-between items-start mb-2">
              <h4 className={clsx("font-bold text-lg", note.isUnread ? "text-blue-900" : "text-gray-900")}>
                {note.title}
              </h4>
              <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{note.time}</span>
            </div>
            <p className={clsx("text-sm leading-relaxed font-medium", note.isUnread ? "text-blue-800" : "text-gray-500")}>
              {note.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ lineConnected, setLineConnected }: { lineConnected: boolean, setLineConnected: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className="h-full overflow-y-auto pb-24 p-6 md:p-10 space-y-8 max-w-2xl">
      <h1 className="text-3xl font-black text-gray-900">系統設定</h1>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
        {lineConnected && <div className="absolute top-0 right-0 w-64 h-64 bg-[#06C755]/10 rounded-bl-full -z-10 blur-3xl transition-opacity duration-1000"></div>}
        
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
            <span className="w-8 h-px bg-gray-200 mr-3"></span> 推播與通知整合
        </h3>

        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center space-x-5">
            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-all duration-500", lineConnected ? "bg-[#06C755] shadow-[#06C755]/20" : "bg-gray-200")}>
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-xl text-gray-900">LINE 官方帳號綁定</h4>
              <p className="text-gray-500 text-sm mt-1 font-medium">接收點數到期通知、專屬活動推播</p>
            </div>
          </div>
          
          <button
            onClick={() => setLineConnected(!lineConnected)}
            className={clsx(
              "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#06C755] focus:ring-offset-2",
              lineConnected ? 'bg-[#06C755]' : 'bg-gray-200'
            )}
          >
            <span
              className={clsx(
                "inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300",
                lineConnected ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <AnimatePresence>
          {lineConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="pt-5 border-t border-gray-100/50 flex items-center text-sm font-bold text-[#06C755]"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              已成功連動，服務啟動中
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

