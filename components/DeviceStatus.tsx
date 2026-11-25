"use client";
import { useEffect, useMemo, useState } from "react";
import { Wifi, Power, Radio, Database, RefreshCw } from "lucide-react";
type Mode = "dummy" | "real";
type RecordRow = { wifi_connected?: boolean; device_on?: boolean; event_type?: string; created_at?: string; temperature?: number|null; humidity?: number|null; wind_speed?: number|null; oxygen?: number|null; latitude?: number|null; longitude?: number|null };
const demo = (): RecordRow => ({ wifi_connected: Math.random() > .12, device_on: true, event_type: "data", created_at: new Date().toISOString(), temperature: 28 + Math.random()*3, humidity: 70 + Math.random()*12, wind_speed: 1 + Math.random()*2, oxygen: 20.8 + Math.random()*.2 });
export default function DeviceStatus(){
 const [mode,setMode]=useState<Mode>("dummy"),[row,setRow]=useState<RecordRow>(demo()),[dataRow,setDataRow]=useState<RecordRow>(demo()),[error,setError]=useState(""),[lastPoll,setLastPoll]=useState(new Date().toISOString()),[tick,setTick]=useState(0);
 useEffect(()=>{const saved=localStorage.getItem("meteora-data-mode");if(saved==="real")setMode("real");},[]);
 useEffect(()=>{const id=window.setInterval(()=>setTick(v=>v+1),500);return()=>clearInterval(id)},[]);
 useEffect(()=>{let alive=true;const load=async()=>{if(mode==="dummy"){const sample=demo();setRow(sample);setDataRow(sample);setError("");setLastPoll(new Date().toISOString());return;}try{const r=await fetch("/api/device/telemetry",{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j.error||"Gagal mengambil data");if(alive){setRow(j.latest||{});setDataRow(j.latest_data||{});setError("");setLastPoll(new Date().toISOString());}}catch(e){if(alive)setError(e instanceof Error?e.message:"Koneksi gagal");}};load();const id=window.setInterval(load,3000);return()=>{alive=false;clearInterval(id)}},[mode]);
 const age=row.created_at?Math.max(0,(Date.now()-new Date(row.created_at).getTime())/1000):Infinity;
 const dataAge=dataRow.created_at?Math.max(0,(Date.now()-new Date(dataRow.created_at).getTime())/1000):Infinity;
 const power=mode==="dummy"?Boolean(row.device_on):age<30&&row.device_on!==false;
 const wifi=mode==="dummy"?Boolean(row.wifi_connected):power&&Boolean(row.wifi_connected);
 const receiving=mode==="dummy"?true:power&&dataAge<10;
 const ledBlink=receiving && Math.floor(tick/4)%2===0;
 const cards=[{name:"Wi-Fi",desc:wifi?"Terhubung ke jaringan":"Tidak terhubung",on:wifi,Icon:Wifi},{name:"Power alat",desc:power?"Perangkat aktif":"Perangkat tidak aktif",on:power,Icon:Power},{name:"Menerima data",desc:receiving?"Data diterima · LED berkedip":"Tidak ada data baru",on:receiving,blink:ledBlink,Icon:Radio}];
 function change(m:Mode){setMode(m);localStorage.setItem("meteora-data-mode",m)}
 return <section className="device-status-panel"><div className="device-status-head"><div><span className="device-kicker"><Radio size={14}/> DEVICE CONNECTIVITY</span><h2>Status Perangkat METEORA-001</h2><p>Monitoring koneksi, daya, dan penerimaan telemetry.</p></div><div className="device-mode-switch"><button className={mode==="dummy"?"active":""} onClick={()=>change("dummy")}>Dummy</button><button className={mode==="real"?"active":""} onClick={()=>change("real")}>Real / Supabase</button></div></div><div className="device-led-grid">{cards.map(c=><article className="device-led-card" key={c.name}><div className="device-led-top"><span>{c.name}</span><span className={`led-dot ${c.on?(c.blink?"blink":"on"):"off"}`}/></div><div className="device-led-icon"><c.Icon size={22}/></div><b>{c.on?"ON":"OFF"}</b><p>{c.desc}</p></article>)}</div><div className="device-status-foot"><span><Database size={14}/> {mode==="dummy"?"Data simulasi lokal": "Sumber: Supabase REST API"}</span><span><RefreshCw size={13}/> Update {new Date(lastPoll).toLocaleTimeString("id-ID")}</span></div>{mode==="real"&&<div className="device-real-info">{error?`Koneksi real gagal: ${error}`:row.created_at?`Heartbeat ${Math.round(age)} detik lalu · data terakhir ${Number.isFinite(dataAge)?Math.round(dataAge)+" detik lalu":"belum ada"} · Wi-Fi ${wifi?"terhubung":"tidak terhubung"}`:"Belum ada telemetry dari perangkat. Kirim heartbeat/data dari ESP32."}</div>}</section>
}
