'use client';
import { useState } from 'react';
import Link from 'next/link';
export function Navigation(){
 const [open,setOpen]=useState(false);
 return <header className="site-header"><a className="skip" href="#main">Skip to content</a><Link href="/" className="wordmark" aria-label="Akshay Gupta home">AKSHAY GUPTA<span className="brand-dot">.</span></Link><button className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}<span>{open?'−':'+'}</span></button><nav id="site-nav" className={open?'open':''} aria-label="Main navigation"><a href="#work" onClick={()=>setOpen(false)}>Work</a><a href="#about" onClick={()=>setOpen(false)}>About</a><a href="#skills" onClick={()=>setOpen(false)}>Skills</a><Link className="nav-resume" href="/resume">View résumé <span>↗</span></Link><a className="nav-contact" href="#contact" onClick={()=>setOpen(false)}>Get in touch <span>↗</span></a></nav></header>
}
export function CopyEmail(){
 const [status,setStatus]=useState('Copy email address');
 return <button className="copy-email" aria-live="polite" onClick={async()=>{try{await navigator.clipboard.writeText('akshay.c.gupta@icloud.com');setStatus('Email address copied');}catch{setStatus('akshay.c.gupta@icloud.com');}}}>{status} <span>⧉</span></button>;
}
export function PrintResume(){return <button className="button primary" onClick={()=>window.print()}>Print / save PDF <span>↓</span></button>;}
