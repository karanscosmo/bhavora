"use client";

import React from 'react';

export default function DisasterResponsePage() {
  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Interactive Map (The Base Layer) */}
      <div className="flex-1 relative bg-[#e5eeff] overflow-hidden" style={{ backgroundImage: "radial-gradient(circle, #c3c6d7 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
        {/* Simulated Map Canvas */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}></div>

        {/* Map Overlays: Critical Infrastructure Hazards */}
        <div className="absolute inset-0 z-10 p-6 pointer-events-none">
          {/* Blinking Alerts */}
          <div className="absolute top-1/4 left-1/3 pointer-events-auto group cursor-pointer">
            <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center text-white animate-pulse shadow-lg">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>flood</span>
            </div>
            <div className="absolute left-8 top-0 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-3 rounded-xl shadow-xl w-48 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-label-md font-bold text-error">Bellandur Inundation</p>
              <p className="text-body-sm text-on-surface-variant">Depth: 1.4m. Impact: Road 4B closed.</p>
            </div>
          </div>

          <div className="absolute bottom-1/3 right-1/4 pointer-events-auto group cursor-pointer">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white animate-pulse shadow-lg" style={{ animationDelay: "0.5s" }}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div className="absolute right-8 top-0 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-3 rounded-xl shadow-xl w-48 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-label-md font-bold text-secondary">Grid Instability</p>
              <p className="text-body-sm text-on-surface-variant">Substation 12 Overload. Risk: High.</p>
            </div>
          </div>

          {/* SVG Cascade Effect Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
            <defs>
              <linearGradient id="gradient-error" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.8"></stop>
              </linearGradient>
            </defs>
            <path d="M 400 300 Q 500 450 700 400" fill="transparent" stroke="url(#gradient-error)" strokeWidth="2" strokeDasharray="8" className="animate-pulse"></path>
            <circle cx="400" cy="300" fill="#ba1a1a" r="4"></circle>
            <circle cx="700" cy="400" fill="#ba1a1a" r="4"></circle>
          </svg>
        </div>

        {/* Floating Map Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-1 rounded-xl shadow-lg flex flex-col">
            <button className="p-3 hover:bg-surface-container-high rounded-lg transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="h-[1px] bg-outline-variant/20 mx-2"></div>
            <button className="p-3 hover:bg-surface-container-high rounded-lg transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
          <button className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-3 rounded-xl shadow-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">layers</span>
          </button>
          <button className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-3 rounded-xl shadow-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        {/* Map HUD Overlays (Top) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none z-20">
          <div className="flex gap-4 pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <span className="text-label-md font-bold uppercase tracking-tight text-on-surface-variant">Active Load:</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="font-mono-label text-error">94.2%</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <span className="text-label-md font-bold uppercase tracking-tight text-on-surface-variant">Disruptions:</span>
              <span className="font-mono-label text-on-surface">12 Nodes</span>
            </div>
          </div>
          <div className="flex gap-4 pointer-events-auto">
            <select className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-full px-6 py-2 text-label-md font-bold shadow-lg focus:ring-2 focus:ring-primary outline-none">
              <option>Flood Event (100-Year)</option>
              <option>Extreme Heatwave</option>
              <option>Sewer Overflow</option>
            </select>
          </div>
        </div>

        {/* Operations Comms */}
        <button className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-xl border border-outline-variant/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform z-50 pointer-events-auto">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed overflow-hidden flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">JD</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-fixed overflow-hidden flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">AK</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-fixed overflow-hidden flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">+4</div>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant/30"></div>
          <div className="text-left">
            <p className="text-label-md font-bold text-on-surface">Operations Comms</p>
            <p className="text-[10px] text-on-surface-variant">6 Personnel Active on Ground</p>
          </div>
          <span className="material-symbols-outlined text-primary">chat_bubble</span>
        </button>
      </div>

      {/* Right Side Intelligence Panel (Bento Style) */}
      <div className="w-[480px] bg-white h-full border-l border-outline-variant/20 flex flex-col shadow-2xl overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Priority AI Recommendation */}
          <div className="relative p-6 rounded-2xl bg-primary text-on-primary shadow-xl overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  AI Strategy Engine
                </div>
                <span className="text-[10px] font-mono-label opacity-70">EXEC_T_00.2s</span>
              </div>
              <h3 className="font-headline-sm mb-2">Reroute traffic from Bellandur Junction</h3>
              <p className="text-body-sm opacity-90 mb-4 leading-relaxed">
                A 100-year flood event detected at Koramangala Valley. 
                Probability of total arterial failure: <span className="font-bold underline decoration-secondary-fixed">87%</span>.
              </p>
              <div className="flex gap-2">
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-label-md font-bold shadow-md hover:bg-surface-bright transition-colors">Execute Rerouting</button>
                <button className="bg-primary-container text-white px-4 py-2 rounded-lg text-label-md font-medium border border-white/20">Analyze Impact</button>
              </div>
            </div>
          </div>

          {/* Hospital Load & Critical Infrastructure Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-40">
              <div>
                <span className="material-symbols-outlined text-primary mb-2">local_hospital</span>
                <div className="text-label-md text-on-surface-variant font-bold uppercase">Hospital Load</div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-display-sm font-bold text-on-surface tracking-tighter">82%</span>
                <span className="text-error font-mono-label text-[10px] pb-2 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12%
                </span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1 mt-2">
                <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-40">
              <div>
                <span className="material-symbols-outlined text-secondary mb-2">water_drop</span>
                <div className="text-label-md text-on-surface-variant font-bold uppercase">Stormwater Level</div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-display-sm font-bold text-on-surface tracking-tighter">4.2m</span>
                <span className="text-error font-mono-label text-[10px] pb-2">CRITICAL</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1 mt-2">
                <div className="bg-secondary h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>

          {/* Cascading Alerts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-body-lg font-bold">Cascading Alerts</h4>
              <span className="text-label-md text-primary font-bold cursor-pointer">View History</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/30 group">
                <div className="w-12 h-12 rounded-full bg-error-container flex-shrink-0 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">power_off</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-label-md text-on-surface">Substation #12 Failure</span>
                    <span className="text-[10px] font-mono-label text-on-surface-variant">2m ago</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-snug">Flood water breached perimeter wall. Backup systems offline.</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] rounded font-bold">HSR Layout</span>
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] rounded font-bold">Priority 1</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/30 group">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">traffic</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-label-md text-on-surface">Bottleneck Detected</span>
                    <span className="text-[10px] font-mono-label text-on-surface-variant">14m ago</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-snug">ORR traffic moving at &lt; 4km/h. Emergency lanes impacted.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics and Trends */}
          <div className="p-6 rounded-2xl bg-surface-container-high/20 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-6">
              <span className="text-label-md font-bold uppercase text-on-surface-variant">Disaster Severity Trend</span>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="h-32 flex items-end gap-2">
              <div className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30 h-[40%]"></div>
              <div className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30 h-[60%]"></div>
              <div className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30 h-[45%]"></div>
              <div className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30 h-[80%]"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40 h-[90%]"></div>
              <div className="flex-1 bg-error/60 rounded-t-lg transition-all hover:bg-error/80 h-[100%] animate-pulse"></div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[10px] font-mono-label text-on-surface-variant">08:00</span>
              <span className="text-[10px] font-mono-label text-on-surface-variant">12:00</span>
              <span className="text-[10px] font-mono-label text-on-surface-variant">Now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
