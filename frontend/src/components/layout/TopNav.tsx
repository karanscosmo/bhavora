"use client";

import React from 'react';
import Link from 'next/link';

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="font-display-sm text-display-sm font-bold tracking-tight text-primary">BHAVORA</h1>
        </Link>
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20 w-80">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-sm w-full placeholder:text-on-surface-variant/60 outline-none" placeholder="Search urban nodes..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-container-high/50 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface leading-none">Admin Cluster</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">BBMP / Urban Dev</p>
          </div>
          <Link href="/profile" className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-primary/10 hover:bg-primary-fixed-dim transition-all">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
