import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const adm4 = req.nextUrl.searchParams.get("adm4")?.trim();
  if (!adm4 || !/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4)) return NextResponse.json({error:"Masukkan kode wilayah desa/kelurahan ADM4 dengan format 00.00.00.0000."},{status:400});
  try {
    const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`, {next:{revalidate:900},headers:{Accept:"application/json"}});
    if(!res.ok) return NextResponse.json({error:`BMKG mengembalikan status ${res.status}. Periksa kode wilayah atau coba lagi nanti.`},{status:502});
    const data = await res.json();
    return NextResponse.json({source:"BMKG — Data Prakiraan Cuaca Terbuka",sourceUrl:"https://data.bmkg.go.id/prakiraan-cuaca/",fetchedAt:new Date().toISOString(),data});
  } catch { return NextResponse.json({error:"Data BMKG tidak dapat diakses saat ini."},{status:502}); }
}
