"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowRight, Activity, CloudSun, Droplets, MapPinned, Satellite, Thermometer, Wind, Menu, X, ShieldCheck, Waves, BrainCircuit, RadioTower, ChartNoAxesCombined, BookOpen, Map, Trees, House, Building2, Sprout } from "lucide-react";
import WeatherStationAnimation from "@/components/WeatherStationAnimation";

const features = [
  {n:"01",title:"Pantau kondisi sekitar",desc:"Baca suhu udara, kelembapan, kecepatan angin, dan parameter oksigen dalam satu perangkat portabel.",icon:CloudSun},
  {n:"02",title:"Lokasi lebih terarah",desc:"Tempatkan titik pengamatan pada peta satelit atau gunakan koordinat GPS saat perangkat terhubung.",icon:MapPinned},
  {n:"03",title:"Pahami pola pengukuran",desc:"Jelajahi grafik histori untuk membandingkan perubahan parameter dari waktu ke waktu.",icon:ChartNoAxesCombined},
  {n:"04",title:"Kembangkan analisis",desc:"Siapkan data lingkungan untuk klasifikasi kondisi cuaca berbasis machine learning.",icon:BrainCircuit},
];
const steps = [
  ["01","Sensor membaca","Sensor lingkungan mengukur parameter di sekitar lokasi pengamatan."],
  ["02","ESP32 mengolah","Pembacaan diperiksa dan disiapkan bersama waktu pengukuran."],
  ["03","Lokasi ditautkan","GPS/GNSS menambahkan koordinat saat modul memperoleh sinyal."],
  ["04","Data ditampilkan","Data dikirim melalui jaringan dan disajikan pada platform METEORA."],
];
const places = [
 {title:"Area persawahan",tag:"PERTANIAN",desc:"Amati perubahan suhu, kelembapan, dan angin di area terbuka yang mendukung kegiatan pertanian.",icon:Sprout,cls:"field-rice"},
 {title:"Kebun dan perkebunan",tag:"AGROFORESTRI",desc:"Lakukan pengamatan mikroklimat di sekitar tanaman, kebun, atau lahan penghijauan.",icon:Trees,cls:"field-garden"},
 {title:"Pekarangan rumah",tag:"LINGKUNGAN HUNIAN",desc:"Pantau kondisi lingkungan sekitar rumah atau fasilitas umum dengan penempatan alat yang aman.",icon:House,cls:"field-home"},
 {title:"Kawasan perkotaan",tag:"LINGKUNGAN KOTA",desc:"Bandingkan kondisi lingkungan di area permukiman atau ruang terbuka perkotaan.",icon:Building2,cls:"field-city"},
];
export default function LandingPage(){
 const [mobileOpen,setMobileOpen]=useState(false);
 const [navVisible,setNavVisible]=useState(true);
 useEffect(()=>{const nodes=document.querySelectorAll(".reveal-on-scroll");const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});nodes.forEach(n=>observer.observe(n));return()=>observer.disconnect()},[]);
 const nav=[["Beranda","#beranda"],["Tentang","#tentang"],["Lokasi penggunaan","#lokasi"],["Cara Kerja","#cara-kerja"],["Fitur","#fitur"]];
 return <main className={`landing ${!navVisible?"landing-nav-hidden":""}`}>
  {navVisible&&<header className="landing-nav">
   <a href="#beranda" className="logo-lockup"><Image src="/images/meteora-logo.png" alt="Logo METEORA" width={190} height={55} priority/><span className="logo-fallback">METEORA</span></a>
   <nav className={`nav-pill ${mobileOpen?"nav-open":""}`}>{nav.map(([label,href])=><a key={href} href={href} onClick={()=>setMobileOpen(false)}>{label}</a>)}<Link href="/manual-penggunaan.pdf" target="_blank"><BookOpen size={14}/> Panduan</Link></nav>
   <Link className="nav-cta" href="/login">Masuk / Daftar <ArrowRight size={16}/></Link>
   <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Buka menu">{mobileOpen?<X/>:<Menu/>}</button>
  </header>}
  <button className="nav-visibility-toggle" onClick={()=>{setNavVisible(!navVisible);setMobileOpen(false)}} aria-label={navVisible?"Sembunyikan navigasi":"Tampilkan navigasi"}>{navVisible?<><X size={14}/> Sembunyikan menu</>:<><Menu size={15}/> Tampilkan menu</>}</button>
  <section id="beranda" className="hero-section">
   <div className="hero-backdrop"></div><div className="hero-grid"></div>
   <div className="hero-copy reveal-on-scroll">
    <div className="eyebrow"><span className="eyebrow-dot"/> STASIUN CUACA PORTABEL BERBASIS AIoT</div>
    <h1>Membaca cuaca.<br/><em>Memahami perubahan.</em></h1>
    <p>METEORA menghubungkan sensor lingkungan, geolokasi GPS, dan analisis data dalam satu platform untuk membantu memantau kondisi cuaca di sekitar.</p>
    <div className="hero-actions"><Link className="btn btn-primary" href="/login">Jelajahi Dashboard <ArrowRight size={17}/></Link><a className="btn btn-ghost" href="#solusi">Kenali Sistem <ArrowDownRight size={17}/></a></div>
    <div className="hero-trust"><span><ShieldCheck size={15}/> Data sensor terstruktur</span><span><MapPinned size={15}/> Berbasis lokasi</span><span><Activity size={15}/> Histori pengamatan</span></div>
   </div>
   <div className="hero-visual hero-station-visual reveal-on-scroll"><WeatherStationAnimation/></div>
   <div className="hero-bottom-note"><span>01 / PLATFORM PENGAMATAN LINGKUNGAN</span><span>PORTABEL · BATERAI ISI ULANG · TANPA PANEL SURYA <ArrowDownRight size={15}/></span></div>
  </section>
  <section className="ticker"><span>MONITORING LINGKUNGAN</span><i>✳</i><span>GPS & PEMETAAN</span><i>✳</i><span>ANALISIS HISTORIS</span><i>✳</i><span>KLASIFIKASI BERBASIS DATA</span></section>
  <section id="tentang" className="about-section section-pad reveal-on-scroll">
   <div className="section-kicker">TENTANG METEORA <span>01 — 04</span></div>
   <div className="about-grid"><h2>Lingkungan berubah.<br/><em>Data membantu kita memahami.</em></h2><div className="about-copy"><p>METEORA adalah konsep stasiun cuaca portabel yang menggabungkan pengukuran multi-sensor dan geolokasi untuk menyajikan informasi lingkungan secara ringkas.</p><p>Dirancang sebagai perangkat yang mudah dibawa ke berbagai titik pengamatan. Sistem menggunakan baterai isi ulang; tidak memerlukan panel surya untuk penggunaan portabel.</p><a className="text-link" href="#cara-kerja">Lihat cara kerja <ArrowRight size={16}/></a></div></div>
   <div className="about-banner"><div className="banner-text"><span>VISI SISTEM</span><h3>Lebih dekat dengan kondisi nyata, lebih jelas dalam membaca data.</h3></div><div className="banner-art"><div className="banner-ring"></div><CloudSun size={88} strokeWidth={1}/><div className="banner-coordinate"><MapPinned size={15}/> GEO-REFERENCED OBSERVATION</div></div></div>
  </section>
  <section id="lokasi" className="field-section section-pad reveal-on-scroll"><div className="section-kicker">DIBAWA KE LAPANGAN <span>AREA PENGGUNAAN</span></div><div className="field-heading"><div><h2>Satu perangkat.<br/><em>Beragam lingkungan.</em></h2><p>METEORA dirancang untuk dibawa ke lokasi pengamatan yang berbeda. Pilih tempat yang aman, stabil, dan memberi ruang bagi sensor untuk membaca udara sekitar.</p></div><Link href="/dashboard/maps" className="text-link">Buka peta pengamatan <ArrowRight size={16}/></Link></div><div className="field-grid">{places.map((p)=>{const Icon=p.icon;return <article className={`field-card ${p.cls}`} key={p.title}><div className="field-art"><div className="field-sun"/><div className="field-horizon"/><div className="field-station"><span>METEORA</span><i/></div><div className="field-landmark"><Icon size={43}/></div><div className="field-tag">{p.tag}</div></div><div className="field-copy"><span>{p.tag}</span><h3>{p.title}</h3><p>{p.desc}</p></div></article>})}</div><p className="field-note">Ilustrasi area penggunaan. Tempatkan alat di area terbuka dan aman; hindari hujan langsung apabila casing belum memiliki perlindungan cuaca yang sesuai.</p></section>
  <section id="solusi" className="solutions-section section-pad reveal-on-scroll"><div className="section-kicker">SOLUSI PLATFORM <span>02 — 04</span></div><div className="center-heading"><h2>Satu sistem.<br/><em>Empat kemampuan utama.</em></h2><p>Dari pengukuran lapangan hingga pemahaman pola, dalam alur yang saling terhubung.</p></div>
   <div className="feature-grid">{features.map(f=>{const Icon=f.icon;return <article className="feature-card" key={f.n}><div className="feature-top"><span>{f.n}</span><Icon size={23}/></div><h3>{f.title}</h3><p>{f.desc}</p><div className="feature-arrow"><ArrowDownRight size={18}/></div></article>})}</div>
  </section>
  <section id="cara-kerja" className="workflow-section section-pad reveal-on-scroll"><div className="section-kicker">CARA KERJA <span>03 — 04</span></div><div className="workflow-heading"><h2>Dari sensor ke wawasan,<br/><em>melalui empat langkah.</em></h2><p>Alur yang dirancang untuk menjaga pembacaan, lokasi, dan visualisasi data tetap terhubung.</p></div>
   <div className="workflow-line">{steps.map(s=><article className="step-card" key={s[0]}><div className="step-number">{s[0]}</div><h3>{s[1]}</h3><p>{s[2]}</p></article>)}</div>
   <div className="sensor-strip"><div className="sensor-strip-title"><RadioTower size={20}/><span>RANCANGAN SENSOR</span></div><div className="sensor-chip"><Thermometer size={17}/> DS18B20 <small>Suhu</small></div><div className="sensor-chip"><Droplets size={17}/> SHT20 <small>Kelembapan</small></div><div className="sensor-chip"><Wind size={17}/> Anemometer <small>Angin</small></div><div className="sensor-chip"><Activity size={17}/> Sensor O₂ <small>Oksigen</small></div><div className="sensor-chip"><Satellite size={17}/> GPS/GNSS <small>Lokasi</small></div></div>
  </section>
  <section id="fitur" className="cta-section reveal-on-scroll"><div className="cta-glow"></div><div className="cta-content"><span className="section-kicker">LANGKAH BERIKUTNYA</span><h2>Mulai jelajahi data<br/><em>bersama METEORA.</em></h2><p>Masuk ke dashboard prototipe untuk melihat rancangan monitoring, peta, histori, dan pratinjau analitik.</p><Link className="btn btn-light" href="/login">Masuk / Daftar <ArrowRight size={17}/></Link><a className="manual-cta-link" href="/manual-penggunaan.pdf" target="_blank"><BookOpen size={16}/> Baca buku panduan penggunaan</a></div><div className="cta-mark"><Image src="/images/meteora-logo.png" alt="" width={300} height={90}/><span>PORTABLE AIoT WEATHER STATION</span></div></section>
  <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Image src="/images/meteora-logo.png" alt="METEORA" width={190} height={55}/><p>Stasiun cuaca portabel untuk membaca kondisi lingkungan melalui sensor, GPS, dan analisis data.</p><span className="footer-status"><i className="live-dot"/> PROTOTIPE PENGEMBANGAN</span></div><div className="footer-col"><b>JELAJAHI</b>{nav.map(n=><a key={n[0]} href={n[1]}>{n[0]}</a>)}</div><div className="footer-col"><b>TEKNOLOGI</b><span>ESP32 & Multi-Sensor</span><span>Geolokasi GPS</span><span>Visualisasi Historis</span><span>Machine Learning (pengembangan)</span></div><div className="footer-col"><b>AKSES</b><Link href="/dashboard/maps">Pemetaan satelit</Link><Link href="/dashboard">Dashboard</Link><a href="/manual-penggunaan.pdf" target="_blank">Buku panduan</a><Link href="/login">Masuk ke Platform</Link></div></div><div className="footer-bottom"><span>© 2026 METEORA · Prototipe akademik</span><span>Data sensor saat ini berupa simulasi sampai perangkat dan database terhubung.</span></div></footer>
 </main>
}
