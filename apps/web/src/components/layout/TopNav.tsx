"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Search, Bell, User, Settings, LogOut, TriangleAlert, Info, AlertCircle } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';


export function TopNav() {
  const router = useRouter();
  const store = useSimulationStore();
  const { metrics, savedScenarios, climateEvent } = store;

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile Menu States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute Notifications Dynamically based on Simulation Store State
  const notifications = React.useMemo(() => {
    const alertsList: Array<{ id: string; text: string; type: 'error' | 'warning' | 'info'; path: string }> = [];
    
    if (metrics.energyDemand > 15) {
      alertsList.push({
        id: 'energy-overload',
        text: 'Grid overload warning: North Bengaluru peak strain exceeded.',
        type: 'error',
        path: '/disaster'
      });
    }
    
    if (metrics.waterDemand > 10) {
      alertsList.push({
        id: 'water-stress',
        text: 'Water reserve alert: Eastern aquifers dropping below 8% reserves.',
        type: 'error',
        path: '/disaster'
      });
    }

    if (metrics.trafficCongestion > 10) {
      alertsList.push({
        id: 'traffic-bottleneck',
        text: 'Transit latency warning: Silk Board corridor speed < 8km/h.',
        type: 'warning',
        path: '/overview'
      });
    }

    if (climateEvent !== "None") {
      alertsList.push({
        id: 'climate-alert',
        text: `Active Emergency: [${climateEvent}] registered in centralized HUD.`,
        type: 'error',
        path: '/disaster'
      });
    }

    // Default info notifications if clean
    if (alertsList.length === 0) {
      alertsList.push({
        id: 'sys-normal',
        text: 'System nominal. Bengaluru City Intelligence Twin active.',
        type: 'info',
        path: '/overview'
      });
    }

    return alertsList;
  }, [metrics, climateEvent]);

  // Unified Searchable Resources
  const searchResources = [
    // Districts
    { name: "Whitefield District", type: "District", path: "/cities", action: () => { if (typeof window !== 'undefined') sessionStorage.setItem('selectedDistrictId', 'whitefield'); } },
    { name: "Electronic City", type: "District", path: "/cities", action: () => { if (typeof window !== 'undefined') sessionStorage.setItem('selectedDistrictId', 'electronic_city'); } },
    { name: "Indiranagar Corridor", type: "District", path: "/cities", action: () => { if (typeof window !== 'undefined') sessionStorage.setItem('selectedDistrictId', 'indiranagar'); } },
    { name: "Hebbal Junction", type: "District", path: "/cities", action: () => { if (typeof window !== 'undefined') sessionStorage.setItem('selectedDistrictId', 'hebbal'); } },
    { name: "Koramangala Valley", type: "District", path: "/cities", action: () => { if (typeof window !== 'undefined') sessionStorage.setItem('selectedDistrictId', 'koramangala'); } },
    // Modules
    { name: "City Overview Dashboard", type: "Module", path: "/overview" },
    { name: "Cities Twin 3D GIS", type: "Module", path: "/cities" },
    { name: "Decision Twin Scenario Control", type: "Module", path: "/decision-twin" },
    { name: "Disaster Response Mode Command", type: "Module", path: "/disaster" },
    { name: "Urban Impact Analysis Matrix", type: "Module", path: "/impact" },
    { name: "Statistical Analytics Suite", type: "Module", path: "/analytics" },
    { name: "Strategic Strategy Reports", type: "Module", path: "/reports" },
    { name: "AI Planning Recommendations", type: "Module", path: "/insights" },
    { name: "Saved Scenario Profile Library", type: "Module", path: "/scenarios" },
    // Scenarios (Dynamic from Zustand Store)
    ...savedScenarios.map(scen => ({
      name: `${scen.name} Scenario`,
      type: "Scenario Run",
      path: "/simulation-results",
      action: () => {
        store.loadScenario(scen);
      }
    }))
  ];

  // Filtering Resources
  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : searchResources.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchResultClick = (item: typeof searchResources[0]) => {
    if (item.action) item.action();
    setSearchQuery("");
    setShowSearchDropdown(false);
    router.push(item.path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm select-none">
      <div className="flex items-center gap-8">
        <Link href="/">
          <BrandLogo className="hover:opacity-90 transition-opacity" />
        </Link>
        
        {/* Functional Search Bar */}
        <div ref={searchRef} className="hidden md:block relative">
          <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20 w-80">
            <Search />
            <input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="bg-transparent border-none focus:ring-0 text-body-sm w-full placeholder:text-on-surface-variant/60 outline-none text-on-surface" 
              placeholder="Search districts, scenarios, modules..." 
              type="text" 
            />
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-outline-variant/30 rounded-2xl shadow-2xl py-2 max-h-60 overflow-y-auto z-50">
              {filteredResults.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSearchResultClick(item)}
                  className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex justify-between items-center text-xs"
                >
                  <span className="font-bold text-on-surface truncate pr-2" title={item.name}>{item.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-full shrink-0">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Notification Bell */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-surface-container-high/50 transition-all cursor-pointer relative"
          >
            <Bell />
            {notifications.some(n => n.type === 'error' || n.type === 'warning') && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error animate-ping"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-outline-variant/30 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/10 flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface">Urban Strain Alerts</span>
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live Feeds</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      router.push(notif.path);
                    }}
                    className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/10 text-xs flex gap-2.5 items-start"
                  >
                    {notif.type === 'error' ? <AlertCircle size={16} className="mt-0.5 shrink-0 text-error" /> : 
                     notif.type === 'warning' ? <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-500" /> : 
                     <Info size={16} className="mt-0.5 shrink-0 text-primary" />}
                    <span className="text-on-surface-variant leading-relaxed">{notif.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div ref={profileRef} className="flex items-center gap-3 pl-2 border-l border-outline-variant/30 relative">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface leading-none">Admin Cluster</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">BBMP / Urban Dev</p>
          </div>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10 hover:bg-primary-fixed-dim transition-all cursor-pointer"
          >
            <User />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant/30 rounded-2xl shadow-2xl py-2 z-50 text-xs">
              <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex items-center gap-2 text-on-surface font-semibold">
                <User /> User Profile
              </Link>
              <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="px-4 py-2 hover:bg-surface-container-low cursor-pointer flex items-center gap-2 text-on-surface font-semibold">
                <Settings /> Settings
              </Link>
              <div className="h-[1px] bg-outline-variant/10 my-1" />
              <Link href="/auth" onClick={() => setShowProfileMenu(false)} className="px-4 py-2 hover:bg-surface-container-low text-error cursor-pointer flex items-center gap-2 font-bold">
                <LogOut /> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
