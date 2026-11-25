"use client";
import { useEffect, useState } from "react";
import { Wind, Droplets, Thermometer, Activity, Gauge } from "lucide-react";

export default function WeatherStationAnimation() {
  const [wind, setWind] = useState(2.4);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setWind(+(1.8 + Math.random() * 1.8).toFixed(1));
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="station-scene" aria-label="Animasi konseptual stasiun cuaca METEORA dengan sensor angin, suhu, kelembapan, dan oksigen">
    <div className="scene-glow"/>
    <div className="wind-flow flow-a"/><div className="wind-flow flow-b"/><div className="wind-flow flow-c"/>
    <div className="station-cloud"><span/><span/><span/></div>
    <div className="station-device">
      <div className="mast-top"><div className="wind-vane"><i/><b/></div><div className="anemometer"><i/><i/><i/><b/></div></div>
      <div className="sensor-shield"><span/><span/><span/></div>
      <div className="device-cable"/>
      <div className="device-box">
        <div className="device-brand"><span className="brand-mark">◉</span> METE<span>O</span>RA</div>
        <div className="device-display"><small>FIELD STATION</small><strong>28.6°</strong><em>STATUS NORMAL</em></div>
        <div className="device-leds"><i/><i/><i/></div>
        <div className="oxygen-sensor"><div className="oxygen-wave">O₂</div><small>OXYGEN</small></div>
      </div>
      <div className="station-leg leg-left"/><div className="station-leg leg-mid"/><div className="station-leg leg-right"/>
      <div className="station-foot"/>
    </div>
    <div className="scene-card scene-wind"><span className="scene-icon"><Wind size={17}/></span><div><small>Kecepatan angin</small><b>{wind} <i>m/s</i></b><em>cup anemometer berputar</em></div><div className="mini-wind"><i/><i/><i/></div></div>
    <div className="scene-card scene-temp"><span className="scene-icon"><Thermometer size={17}/></span><div><small>Suhu udara</small><b>28.6 <i>°C</i></b><em>sensor membaca udara</em></div></div>
    <div className="scene-card scene-humidity"><span className="scene-icon"><Droplets size={17}/></span><div><small>Kelembapan</small><b>76 <i>% RH</i></b><em>sensor lingkungan</em></div></div>
    <div className="scene-card scene-o2"><span className="scene-icon"><Activity size={17}/></span><div><small>Konsentrasi O₂</small><b>20.9 <i>%*</i></b><em>ilustrasi nilai sensor</em></div></div>
    <div className="scene-caption"><span className="scene-live-dot"/> ANIMASI KONSEPTUAL PERANGKAT <small>DATA ILUSTRASI</small></div>
    <p className="scene-footnote">*Nilai hanya ilustrasi antarmuka, bukan hasil pembacaan perangkat aktual.</p>
  </div>;
}
