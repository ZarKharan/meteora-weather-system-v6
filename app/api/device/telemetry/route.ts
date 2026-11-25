import { NextRequest, NextResponse } from "next/server";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const table = `${base}/rest/v1/meteora_telemetry`;

export async function GET() {
  if (!base || !key) return NextResponse.json({ configured: false, error: "Supabase belum dikonfigurasi" }, { status: 503 });
  try {
    const headers = { apikey: key!, Authorization: `Bearer ${key}` };
    const [statusResponse, dataResponse] = await Promise.all([
      fetch(`${table}?select=*&device_id=eq.METEORA-001&order=created_at.desc&limit=1`, { headers, cache: "no-store" }),
      fetch(`${table}?select=*&device_id=eq.METEORA-001&event_type=eq.data&order=created_at.desc&limit=1`, { headers, cache: "no-store" })
    ]);
    const [statusRows, dataRows] = await Promise.all([statusResponse.json(), dataResponse.json()]);
    if (!statusResponse.ok || !dataResponse.ok) return NextResponse.json({ error: statusRows?.message || dataRows?.message || "Gagal membaca Supabase" }, { status: 502 });
    return NextResponse.json({ configured: true, latest: statusRows[0] || null, latest_data: dataRows[0] || null, server_time: new Date().toISOString() });
  } catch { return NextResponse.json({ error: "Tidak dapat menghubungi Supabase" }, { status: 502 }); }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-device-token");
  if (!process.env.DEVICE_API_TOKEN || token !== process.env.DEVICE_API_TOKEN)
    return NextResponse.json({ error: "Unauthorized device" }, { status: 401 });
  if (!base || !key) return NextResponse.json({ error: "Supabase belum dikonfigurasi" }, { status: 503 });
  try {
    const body = await req.json();
    const event_type = body.event_type === "heartbeat" ? "heartbeat" : "data";
    const payload = {
      device_id: String(body.device_id || "METEORA-001"), event_type,
      wifi_connected: Boolean(body.wifi_connected), device_on: body.device_on !== false,
      temperature: finite(body.temperature), humidity: finite(body.humidity), wind_speed: finite(body.wind_speed), oxygen: finite(body.oxygen),
      latitude: finite(body.latitude), longitude: finite(body.longitude),
    };
    const response = await fetch(table, { method: "POST", headers: { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(payload), cache: "no-store" });
    const result = await response.json();
    if (!response.ok) return NextResponse.json({ error: result?.message || "Gagal menyimpan telemetry" }, { status: response.status });
    return NextResponse.json({ ok: true, record: result[0] }, { status: 201 });
  } catch { return NextResponse.json({ error: "Payload JSON tidak valid" }, { status: 400 }); }
}
function finite(v: unknown): number | null { return typeof v === "number" && Number.isFinite(v) ? v : null; }
