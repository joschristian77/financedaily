/* ===================================================================
   Duit — daily money tracker for RMB + Rupiah
   Local-first: every write lands in localStorage immediately.
   Firestore sync (optional, lazy-loaded) reconciles in the background.
   =================================================================== */
"use strict";

/* ============================ icons ============================ */
const ICON = {
  wallet:'<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v2"/><path d="M3 7.5V18a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 21 18v-2.5"/><path d="M21 11.5h-3.5a2 2 0 0 0 0 4H21z"/>',
  utensils:'<path d="M3 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2"/><path d="M6 2v9"/><path d="M7 11v11"/><path d="M21 14V2a5 5 0 0 0-5 5v5c0 1.1.9 2 2 2h3z"/><path d="M21 14v8"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.5 12.1a1.8 1.8 0 0 0 1.8 1.4h8.6a1.8 1.8 0 0 0 1.8-1.4L21 7H5"/>',
  car:'<path d="M3 13l2.1-6a2.2 2.2 0 0 1 2.1-1.5h9.6A2.2 2.2 0 0 1 18.9 7l2.1 6"/><path d="M3 13h18v4.2a.8.8 0 0 1-.8.8h-1.9a.8.8 0 0 1-.8-.8V16H6.5v1.2a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8z"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/>',
  bag:'<path d="M6 2L3.5 6.2V20a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V6.2L18 2z"/><path d="M3.5 6.2h17"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  bolt:'<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  home:'<path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9.5 22v-9h5v9"/>',
  heart:'<path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7L12 21.3l8.8-8.7a5.4 5.4 0 0 0 0-7.7z"/>',
  music:'<path d="M9 18V5.5l11-2V16"/><circle cx="6.2" cy="18" r="2.8"/><circle cx="17.2" cy="16" r="2.8"/>',
  book:'<path d="M4 19.2A2.8 2.8 0 0 1 6.8 16.4H20"/><path d="M6.8 2H20v20H6.8A2.8 2.8 0 0 1 4 19.2V4.8A2.8 2.8 0 0 1 6.8 2z"/>',
  plane:'<path d="M10.2 20.6l1.6-5.1 3.5 3.5.9-.9-1.6-5.6 5.5-1.6a2 2 0 1 0-1.4-1.4l-1.6 5.5-5.6-1.6-.9.9 3.5 3.5-5.1 1.6"/><path d="M3.5 12.9l6.3-6.3"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2.4"/><path d="M2 10h20"/><path d="M6 15h3"/>',
  gift:'<rect x="3" y="8" width="18" height="4.2" rx="1"/><path d="M5 12.2V21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.8"/><path d="M12 8v14"/><path d="M12 8S9.4 8 8.4 7a2.1 2.1 0 0 1 3-3c1 1 .6 4 .6 4z"/><path d="M12 8s2.6 0 3.6-1a2.1 2.1 0 0 0-3-3c-1 1-.6 4-.6 4z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  box:'<path d="M21 8.5L12 3 3 8.5v7L12 21l9-5.5z"/><path d="M3 8.5L12 14l9-5.5"/><path d="M12 14v7"/>',
  trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5a2.5 2.5 0 0 0 2.5 4"/><path d="M17 5.5h2.5a2.5 2.5 0 0 1-2.5 4"/><path d="M9.5 20h5"/><path d="M12 14v6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrowDown:'<path d="M12 4v15"/><path d="M6 13.5l6 6 6-6"/>',
  arrowUp:'<path d="M12 20V5"/><path d="M6 10.5l6-6 6 6"/>',
  trendUp:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  scale:'<path d="M12 3v18"/><path d="M5 21h14"/><path d="M7 7l-4 7h8z"/><path d="M17 7l-4 7h8z"/><path d="M4 7h16"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>',
  chart:'<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
  piggy:'<path d="M20 11.5c0-3.6-3.6-6.5-8-6.5-.9 0-1.8.1-2.6.3L7 3.5v3A6.7 6.7 0 0 0 4.3 10H2.5v4h2.2c.5 1 1.3 1.9 2.3 2.6V20h3v-2.1c.3 0 .7.1 1 .1h2v2h3v-2.6c1.8-1.1 3-3 3-5.9z"/><circle cx="16" cy="11" r="1"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.09A1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.2-4.2"/>',
  chevL:'<path d="M15 18l-6-6 6-6"/>',
  chevR:'<path d="M9 18l6-6-6-6"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7.5 18.5 3 20l1.5-4.5z"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2.2"/><path d="M5.5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v1"/>',
  trash:'<path d="M3.5 6h17"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"/><path d="M5.5 6l1 14a1.6 1.6 0 0 0 1.6 1.5h7.8A1.6 1.6 0 0 0 17.5 20l1-14"/>',
  dl:'<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 21h16"/>',
  up:'<path d="M12 21V9"/><path d="M7 13l5-5 5 5"/><path d="M4 3h16"/>',
  cloud:'<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 10.5 3.75 3.75 0 0 0 6.5 19z"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
  moon:'<path d="M20.5 14.5A8.7 8.7 0 0 1 9.5 3.5a8.7 8.7 0 1 0 11 11z"/>',
  list:'<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  check:'<path d="M4 12.5l5 5L20 6.5"/>'
};
const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICON[n]||ICON.box}</svg>`;

/* ============================ currencies ============================ */
const CUR = {
  CNY:{code:"CNY", sym:"¥",  name:"RMB · Chinese Yuan", dec:2, loc:"en-US"},
  IDR:{code:"IDR", sym:"Rp", name:"Rupiah · Indonesia", dec:0, loc:"id-ID"}
};
const CUR_WORDS = {
  cny:"CNY", rmb:"CNY", yuan:"CNY", kuai:"CNY", "¥":"CNY", "元":"CNY", "块":"CNY", quai:"CNY",
  rp:"IDR", idr:"IDR", rupiah:"IDR", rupiahs:"IDR", perak:"IDR", ripiah:"IDR"
};
const MULT = { k:1e3, rb:1e3, rbu:1e3, ribu:1e3, ribuan:1e3, jt:1e6, jeti:1e6, juta:1e6, jutaan:1e6, m:1e6, mil:1e6, w:1e4, wan:1e4, "万":1e4 };
const IDR_MULT = new Set(["rb","rbu","ribu","ribuan","jt","jeti","juta","jutaan"]);
const CNY_MULT = new Set(["w","wan","万"]);

/* ============================ categories ============================ */
const CATS = [
  {id:"food", label:"Food & Drink", icon:"utensils", color:"#ff9500", kind:"expense", kw:"dinner lunch breakfast brunch supper food meal eat eating snack snacks coffee kopi cafe kafe tea teh makan makanan sarapan nasi mie bakso sate soto ayam warung warteg restoran restaurant resto milktea boba bubble jajan jajanan minum minuman drink beer bir wine juice jus roti bread cake kue eskrim icecream pizza burger sushi ramen hotpot bbq chifan waimai takeout takeaway delivery gofood grabfood shopeefood meituan eleme luckin starbucks mcd mcdonalds kfc padang gorengan bakmi dimsum kantin katering catering buffet mala malatang shaokao zaocan wucan wancan naicha kaifei"},
  {id:"groceries", label:"Groceries", icon:"cart", color:"#00d68f", kind:"expense", kw:"groceries grocery supermarket market pasar belanja sayur sayuran buah daging telur beras minyak gula susu milk indomaret alfamart superindo hypermart giant carrefour lotte walmart hema freshippo chaoshi mart minimarket sembako bulanan dapur meiyijia"},
  {id:"transport", label:"Transport", icon:"car", color:"#2f80ff", kind:"expense", kw:"taxi taksi grab gojek gocar goride ojek ojol bluebird bus busway train kereta krl mrt lrt transjakarta didi metro subway tram bensin pertalite pertamax solar fuel petrol parkir parking toll tol angkot becak sepeda bike ebike scooter motor gaotie ditie chuzu chuzuche uber lyft carpool ongkos transport transportasi servis oli tambal gonggong huoche feiji"},
  {id:"shopping", label:"Shopping", icon:"bag", color:"#ff4d94", kind:"expense", kw:"shopping shop baju clothes clothing shirt kaos kemeja shoes sepatu sandal celana jaket dress tas bag dompet jam watch aksesoris taobao tmall jd pinduoduo pdd shopee tokopedia tokped lazada bukalapak blibli amazon tiktokshop elektronik gadget hp phone handphone laptop tablet headphone earphone charger kabel keyboard mouse furniture furnitur perabot ikea decor dekorasi xiaomi"},
  {id:"bills", label:"Bills & Subs", icon:"bolt", color:"#8b5cff", kind:"expense", kw:"bill bills tagihan listrik electricity water air pln pdam internet wifi indihome pulsa kuota data paket paketan subscription subs langganan netflix spotify icloud youtube premium disney vidio wetv iqiyi bstation appstore googleplay chatgpt claude insurance asuransi bpjs premi tax pajak pbb iuran administrasi cicilan installment kredit loan pinjaman utang domain hosting server dianfei shuifei"},
  {id:"rent", label:"Rent & Home", icon:"home", color:"#5b6bff", kind:"expense", kw:"rent sewa kos kost kontrakan apartment apartemen fangzu dorm asrama deposit kebersihan keamanan satpam maintenance perbaikan renovasi wuye"},
  {id:"health", label:"Health", icon:"heart", color:"#ff3d57", kind:"expense", kw:"doctor dokter hospital rumahsakit klinik clinic obat medicine pharmacy apotek apotik dentist gigi mata kacamata optik vitamin suplemen gym fitness olahraga yoga renang checkup medical vaksin vaccine masker terapi therapy pijat yiyuan yaodian yakult"},
  {id:"fun", label:"Fun & Leisure", icon:"music", color:"#ff2d9b", kind:"expense", kw:"movie bioskop cinema film game games gaming steam nintendo topup diamond concert konser karaoke ktv bar club hiburan entertainment hobby hobi mainan toys manga komik novel taman park zoo museum tiketmasuk billiard bowling futsal badminton dianying"},
  {id:"education", label:"Education", icon:"book", color:"#00b8e6", kind:"expense", kw:"kuliah tuition spp school sekolah course kursus les bimbel training pelatihan seminar workshop webinar buku book textbook kelas class exam ujian sertifikat certificate university universitas kampus xuefei stationery atk printing fotokopi skripsi thesis toefl ielts hsk"},
  {id:"travel", label:"Travel", icon:"plane", color:"#00d1c1", kind:"expense", kw:"hotel penginapan homestay hostel airbnb losmen villa flight pesawat tiketpesawat airport bandara tiket ticket liburan vacation holiday trip travel jalanjalan wisata tour visa passport paspor imigrasi oleholeh souvenir bagasi luggage mudik pulangkampung lvyou"},
  {id:"fees", label:"Fees & Transfer", icon:"card", color:"#a855f7", kind:"expense", kw:"fee fees admin biaya adminfee transfer bank atm charge komisi denda fine bunga wechatpay alipay gopay ovo dana shopeepay linkaja kirim remit remittance withdraw tarik penalty zhuanzhang"},
  {id:"gift", label:"Gifts & Giving", icon:"gift", color:"#ff7a00", kind:"expense", kw:"gift hadiah kado donasi donation angpao hongbao sumbangan zakat sedekah infaq charity amal traktir traktiran patungan kondangan nikahan wedding ulangtahun birthday"},
  {id:"personal", label:"Personal Care", icon:"user", color:"#00c2ff", kind:"expense", kw:"haircut potongrambut rambut salon barber barbershop skincare laundry cuci setrika spa massage kosmetik cosmetics makeup sabun shampoo pasta parfum deodorant tissue popok diapers pembalut facial lifa"},
  {id:"other", label:"Other", icon:"box", color:"#7b8aad", kind:"expense", kw:"other lain lainnya misc lupa entah rokok cigarette vape"},
  {id:"salary", label:"Salary", icon:"wallet", color:"#06c270", kind:"income", kw:"gaji salary gajian payroll upah honor honorarium wage income pendapatan penghasilan gongzi"},
  {id:"bonus", label:"Bonus", icon:"trophy", color:"#ffc300", kind:"income", kw:"bonus thr tunjangan insentif incentive reward jiangjin"},
  {id:"otherinc", label:"Other Income", icon:"arrowDown", color:"#2f80ff", kind:"income", kw:"refund cashback dividen dividend jual sold laku freelance project proyek klien client invoice beasiswa scholarship kiriman transferan allowance uangsaku sangu untung profit sewaan royalti tip"}
];
const CATBY = Object.fromEntries(CATS.map(c=>[c.id,c]));
const KW = {};
CATS.forEach(c => c.kw.split(/\s+/).forEach(w => { if(w && !(w in KW)) KW[w]=c.id; }));
CATS.forEach(c => { if(!(c.id in KW)) KW[c.id]=c.id; });
const INCOME_WORDS = new Set(["income","masuk","terima","diterima","received","dapat","dapet","gaji","gajian","salary","refund","cashback","bonus","thr","untung","profit","jual","laku","sold","invoice"]);

/* ============================ state ============================ */
const KEY = "duit.v2";
const OLD_KEY = "duit.v1";
/**
 * Baked-in Firebase project so sync works with just the Settings toggle —
 * no per-device config paste. The apiKey here is a public project
 * identifier, not a secret; the Firestore rules are what actually gate
 * access to any given user's data. Clear it in Settings to point at a
 * different project instead.
 */
const DEFAULT_FB = {
  apiKey: "AIzaSyBneGkGcRjPoZF-SDlfuLIODZB4xr7X_8M",
  authDomain: "financedaily-2ebc9.firebaseapp.com",
  projectId: "financedaily-2ebc9",
  storageBucket: "financedaily-2ebc9.firebasestorage.app",
  messagingSenderId: "652289335275",
  appId: "1:652289335275:web:5f557e6f68714ad776c3ae",
  measurementId: "G-RDXKHZRHQY"
};
const DEFAULTS = {
  txs: [], tomb: [],
  s: { base:"CNY", def:"CNY", rate:2250, budget:0, budgets:{}, theme:"auto", smart:true,
       sync:false, fb:DEFAULT_FB, uid:null, lastSync:0 }
};
let S = loadState();
let SYNC = { mod:null, status:"off", msg:"Off", user:null };

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function validTx(t){ return t && typeof t.amt==="number" && isFinite(t.amt) && t.amt>0 && CUR[t.cur] && typeof t.ts==="number"; }

function loadState(){
  const base = structuredClone(DEFAULTS);
  try{
    let raw = localStorage.getItem(KEY);
    if(!raw){
      const old = localStorage.getItem(OLD_KEY);       // carry over v1 data
      if(old){
        const p = JSON.parse(old);
        base.txs = (p.txs||[]).filter(validTx).map(t=>({...t, id:String(t.id), up:Date.now()}));
        if(p.s) Object.assign(base.s, {base:p.s.base, def:p.s.def, rate:p.s.rate, budget:p.s.budget, theme:p.s.theme, smart:p.s.smart});
      }
      return base;
    }
    const p = JSON.parse(raw);
    if(Array.isArray(p.txs)) base.txs = p.txs.filter(validTx);
    if(Array.isArray(p.tomb)) base.tomb = p.tomb;
    Object.assign(base.s, p.s||{});
    if(!base.s.budgets) base.s.budgets = {};
    return base;
  }catch(e){ return base; }
}
let saveTimer;
function persist(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{ localStorage.setItem(KEY, JSON.stringify(S)); }
    catch(e){ toast("Can't save — device storage is full."); }
  }, 60);
}
/** Single funnel for every data change: save locally, redraw, then sync. */
function commit(opts){
  persist();
  if(!(opts&&opts.quiet)) draw();
  if(S.s.sync) queueSync();
}

/* ============================ money ============================ */
const rate = () => (+S.s.rate>0 ? +S.s.rate : 2250);
function toBase(amt,cur,txRate){
  const b=S.s.base;
  if(cur===b) return amt;
  const r = (typeof txRate==="number" && txRate>0) ? txRate : rate();
  return cur==="IDR" ? amt/r : amt*r;
}
function fmt(v,cur,short){
  const c=CUR[cur]||CUR[S.s.base], a=Math.abs(v), sign=v<0?"-":"";
  if(short){
    if(c.code==="IDR"){
      if(a>=1e9) return sign+c.sym+trim(a/1e9)+"M";
      if(a>=1e6) return sign+c.sym+trim(a/1e6)+"jt";
      if(a>=1e4) return sign+c.sym+Math.round(a/1e3)+"rb";
    }else if(a>=1e3){
      return sign+c.sym+trim(a/1e3)+"k";
    }
  }
  let d=c.dec;
  if(c.dec===2 && Math.abs(a-Math.round(a))<0.005) d=0;
  return sign+c.sym+new Intl.NumberFormat(c.loc,{minimumFractionDigits:d,maximumFractionDigits:d}).format(a);
}
const trim = n => (n>=100?Math.round(n):+n.toFixed(1)).toString().replace(/\.0$/,"");
const fmtB = (v,short) => fmt(v,S.s.base,short);

/* ============================ dates ============================ */
const DAY=864e5;
const sod = d => { const x=new Date(d); x.setHours(0,0,0,0); return x.getTime(); };
const today = () => sod(Date.now());
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONL=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function dstr(ts){ const d=new Date(ts); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fromDstr(s){ const [y,m,d]=String(s).split("-").map(Number); return new Date(y,(m||1)-1,d||1).getTime(); }
function dayLabel(ts){
  const diff=Math.round((today()-sod(ts))/DAY);
  if(diff===0) return "Today";
  if(diff===1) return "Yesterday";
  if(diff===-1) return "Tomorrow";
  const d=new Date(ts), y=d.getFullYear()!==new Date().getFullYear();
  return DOW[d.getDay()]+", "+d.getDate()+" "+MON[d.getMonth()]+(y?" "+d.getFullYear():"");
}
const monthStart = ts => { const d=new Date(ts); return new Date(d.getFullYear(),d.getMonth(),1).getTime(); };
const monthEnd   = ts => { const d=new Date(ts); return new Date(d.getFullYear(),d.getMonth()+1,1).getTime(); };
const monthLabel = ts => { const d=new Date(ts); return MONL[d.getMonth()]+" "+d.getFullYear(); };
const daysInMonth = ts => { const d=new Date(ts); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate(); };
/** Days of the month that have actually happened — full month once it's in the past. */
const daysElapsed = ts => monthStart(ts)===monthStart(Date.now()) ? new Date().getDate() : daysInMonth(ts);

const weekStart = ts => { const d=new Date(sod(ts)); const dow=(d.getDay()+6)%7; d.setDate(d.getDate()-dow); return d.getTime(); };
const yearStart = ts => { const d=new Date(ts); return new Date(d.getFullYear(),0,1).getTime(); };
const yearEnd   = ts => { const d=new Date(ts); return new Date(d.getFullYear()+1,0,1).getTime(); };

function rangeFor(scope, anchor){
  if(scope==="day"){ const s=sod(anchor); return {s, e:s+DAY, label:dayLabel(s)}; }
  if(scope==="week"){
    const s=weekStart(anchor), e=s+7*DAY;
    const a=new Date(s), b=new Date(e-DAY);
    const sameMonth = a.getMonth()===b.getMonth() && a.getFullYear()===b.getFullYear();
    const label = sameMonth
      ? `${a.getDate()}–${b.getDate()} ${MON[a.getMonth()]}`
      : `${a.getDate()} ${MON[a.getMonth()]} – ${b.getDate()} ${MON[b.getMonth()]}`;
    return {s, e, label};
  }
  if(scope==="year"){ const s=yearStart(anchor); return {s, e:yearEnd(anchor), label:String(new Date(s).getFullYear())}; }
  return {s:monthStart(anchor), e:monthEnd(anchor), label:monthLabel(anchor)};
}
function shiftedAnchor(scope, anchor, dir){
  const d = new Date(anchor);
  if(scope==="day") d.setDate(d.getDate()+dir);
  else if(scope==="week") d.setDate(d.getDate()+dir*7);
  else if(scope==="year") d.setFullYear(d.getFullYear()+dir);
  else d.setMonth(d.getMonth()+dir, 1);
  return d.getTime();
}
function periodTx(range){ return S.txs.filter(t=>t.ts>=range.s && t.ts<range.e).sort((a,b)=> b.ts-a.ts || (b.up||0)-(a.up||0)); }
function periodElapsedDays(range){ return Math.max(1, Math.ceil((Math.min(Date.now(), range.e)-range.s)/DAY)); }
const periodNoun = scope => ({day:"today", week:"this week", month:"this month", year:"this year"}[scope]||"this month");
const periodCompareWord = scope => ({day:"yesterday", week:"last week", month:"last month", year:"last year"}[scope]||"last month");

/* ============================ parser ============================ */
function parseNum(s){
  s=String(s).trim(); if(!/\d/.test(s)) return null;
  const hd=s.includes("."), hc=s.includes(",");
  if(hd&&hc){
    s = s.lastIndexOf(".")>s.lastIndexOf(",") ? s.replace(/,/g,"") : s.replace(/\./g,"").replace(",",".");
  }else if(hd||hc){
    const sep=hd?".":",", p=s.split(sep);
    const grouped = p.length>1 && p.slice(1).every(x=>x.length===3) && p[0].length<=3 && /^\d+$/.test(p[0]);
    s = grouped ? p.join("") : p.join(".");
  }
  const n=parseFloat(s);
  return isFinite(n)?n:null;
}
const NUMTOK = /^([+-]?)(\d[\d.,]*)\s*([a-z一-鿿¥]*)$/i;
const PRETOK = /^(rp\.?|idr|¥|rmb|cny)\s*(\d[\d.,]*)\s*([a-z]*)$/i;

function parse(raw, fallbackTs){
  let str = " "+String(raw||"").trim()+" ";
  const out = { amt:null, cur:null, type:"expense", cat:null, note:"", ts:(fallbackTs||today()), ok:false, explicitCur:false, dated:false };
  if(!str.trim()) return out;

  const dateRules = [
    [/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/, m=>new Date(+m[1],+m[2]-1,+m[3]).getTime()],
    [/\b(\d{1,2})[\/](\d{1,2})(?:[\/](\d{2,4}))?\b/, m=>{ let y=m[3]?+m[3]:new Date().getFullYear(); if(y<100)y+=2000; return new Date(y,+m[2]-1,+m[1]).getTime(); }],
    [/\b(\d{1,3})\s*(?:d|days?|hari)\s*(?:ago|lalu|yg lalu|yang lalu)\b/i, m=>today()-(+m[1])*DAY],
    [/\b(?:kemarin dulu|kemarin lusa|day before yesterday)\b/i, ()=>today()-2*DAY],
    [/\b(?:yesterday|kemarin|kmrn|kmarin|zuotian)\b/i, ()=>today()-DAY],
    [/\b(?:tomorrow|besok|bsk|mingtian)\b/i, ()=>today()+DAY],
    [/\b(?:lusa)\b/i, ()=>today()+2*DAY],
    [/\b(?:today|hari ini|hariini|jintian)\b/i, ()=>today()]
  ];
  for(const [re,fn] of dateRules){
    const m = str.match(re);
    if(m){ const t=fn(m); if(isFinite(t)){ out.ts=sod(t); out.dated=true; str=str.replace(m[0]," "); break; } }
  }

  const toks = str.trim().split(/\s+/).filter(Boolean).map(t=>({raw:t, lc:t.toLowerCase(), used:false}));
  const clean = s => s.toLowerCase().replace(/[^a-z0-9一-鿿¥+\-.,]/g,"");

  for(let i=0;i<toks.length && out.amt===null;i++){
    const t=toks[i], c=clean(t.raw);
    let sign="", num=null, tail="";
    let m = c.match(NUMTOK);
    if(m){ sign=m[1]; num=m[2]; tail=m[3]||""; }
    else { m = c.match(PRETOK); if(m){ out.cur=CUR_WORDS[m[1].replace(/\.$/,"")]||null; out.explicitCur=!!out.cur; num=m[2]; tail=m[3]||""; } }
    if(num===null) continue;
    const v = parseNum(num); if(v===null) continue;

    let mult=1, tailCur=null;
    if(tail){
      const tl=tail.toLowerCase();
      if(MULT[tl]!==undefined){
        mult=MULT[tl];
        if(IDR_MULT.has(tl)) tailCur="IDR";
        else if(CNY_MULT.has(tl)) tailCur="CNY";
      }
      else if(CUR_WORDS[tl]) tailCur=CUR_WORDS[tl];
      else{
        let hit=false;
        for(const k of Object.keys(MULT).sort((a,b)=>b.length-a.length)){
          if(tl.startsWith(k) && CUR_WORDS[tl.slice(k.length)]){ mult=MULT[k]; tailCur=CUR_WORDS[tl.slice(k.length)]; hit=true; break; }
        }
        if(!hit) continue;                       // unknown suffix — not an amount
      }
    }
    t.used=true;
    if(tailCur && !out.explicitCur){ out.cur=tailCur; out.explicitCur=true; }

    for(const n of [toks[i+1], toks[i+2], toks[i-1]]){
      if(!n || n.used) continue;
      const nl = clean(n.raw).replace(/\.$/,"");
      if(!out.explicitCur && CUR_WORDS[nl]){ out.cur=CUR_WORDS[nl]; out.explicitCur=true; n.used=true; continue; }
      if(mult===1 && MULT[nl]!==undefined && n===toks[i+1]){
        mult=MULT[nl]; n.used=true;
        if(!out.explicitCur){
          if(IDR_MULT.has(nl)){ out.cur="IDR"; out.explicitCur=true; }
          else if(CNY_MULT.has(nl)){ out.cur="CNY"; out.explicitCur=true; }
        }
      }
    }
    if(sign==="+") out.type="income";
    out.amt = Math.abs(v*mult);
  }

  const rest=[];
  for(const t of toks){
    if(t.used) continue;
    let raw = t.raw;
    if(raw[0]==="+"){ out.type="income"; raw=raw.slice(1); }
    else if(raw[0]==="-" && /[a-z]/i.test(raw)) raw=raw.slice(1);
    const w = t.lc.replace(/[^a-z0-9一-鿿]/g,"");
    if(!w){ if(t.lc!=="+"&&t.lc!=="-") rest.push(raw); continue; }
    if(INCOME_WORDS.has(w)) out.type="income";
    if(!out.cat && KW[w]) out.cat=KW[w];
    if(!out.cat && KW[w.replace(/s$/,"")]) out.cat=KW[w.replace(/s$/,"")];
    if(!CATBY[w]) rest.push(raw);
  }
  if(!out.cat){
    const flat = str.toLowerCase().replace(/[^a-z一-鿿]/g,"");
    for(const c of CATS){ if(c.kw.split(/\s+/).some(k=>k.length>3 && flat.includes(k))){ out.cat=c.id; break; } }
  }
  if(!out.cat) out.cat = out.type==="income" ? "otherinc" : "other";
  if(out.type==="income" && CATBY[out.cat].kind==="expense") out.cat="otherinc";
  if(out.type==="expense" && CATBY[out.cat].kind==="income") out.type="income";

  if(!out.cur) out.cur = (S.s.smart && out.amt!=null) ? (out.amt>=1000 ? "IDR" : "CNY") : S.s.def;
  out.note = rest.join(" ").replace(/\s+/g," ").trim();
  out.ok = out.amt!==null && out.amt>0;
  return out;
}
/** Split a pasted block into one parse result per non-empty line. */
function parseLines(text, fallbackTs){
  return String(text||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean)
    .map(line => ({ line, p: parse(line, fallbackTs) }));
}

/* ============================ data helpers ============================ */
function addTx(d){
  const t = { id:uid(), amt:d.amt, cur:d.cur, type:d.type, cat:d.cat, note:d.note||"", ts:d.ts, rate:(d.rate>0?d.rate:rate()), up:Date.now() };
  S.txs.push(t);
  return t;
}
function removeTx(id){
  const i = S.txs.findIndex(t=>t.id===id);
  if(i<0) return null;
  const [t] = S.txs.splice(i,1);
  S.tomb.push({ id, up:Date.now() });
  if(S.tomb.length>800) S.tomb = S.tomb.slice(-800);
  return t;
}
function restoreTx(t){
  S.txs.push({...t, up:Date.now()});
  S.tomb = S.tomb.filter(x=>x.id!==t.id);
}
const inMonth = (t, anchor) => t.ts>=monthStart(anchor) && t.ts<monthEnd(anchor);
function monthTx(anchor){ return S.txs.filter(t=>inMonth(t,anchor)).sort((a,b)=> b.ts-a.ts || (b.up||0)-(a.up||0)); }
function totals(list){
  let inc=0, out=0;
  for(const t of list){ const v=toBase(t.amt,t.cur,t.rate); if(t.type==="income") inc+=v; else out+=v; }
  return { inc, out, net:inc-out };
}
function byCategory(list){
  const m={};
  for(const t of list){ if(t.type!=="expense") continue; m[t.cat]=(m[t.cat]||0)+toBase(t.amt,t.cur,t.rate); }
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}

/* ============================ view state ============================ */
const V = { tab:"home", anchor:today(), q:"", cat:null, qaDate:null, scope:"month" };
const TABS = [
  {id:"home",  label:"Home",    icon:"home",  title:"Home"},
  {id:"tx",    label:"History", icon:"list",  title:"Transactions"},
  {id:"budget",label:"Budget",  icon:"piggy", title:"Budget"},
  {id:"report",label:"Reports", icon:"chart", title:"Reports"},
  {id:"more",  label:"More",    icon:"grid",  title:"Settings"}
];

/* ============================ render helpers ============================ */
const $ = s => document.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tint = (hex,a) => hex + Math.round(a*255).toString(16).padStart(2,"0");

function draw(){
  applyTheme();
  const tab = TABS.find(t=>t.id===V.tab) || TABS[0];
  $("#pgTitle").textContent = tab.title;
  $("#pgSub").textContent = V.tab==="more"
    ? (SYNC.status==="on" ? "Synced" : "This device only")
    : V.tab==="budget" ? monthLabel(V.anchor)
    : rangeFor(V.scope, V.anchor).label;
  $("#nav").innerHTML = TABS.map(t=>
    `<button data-tab="${t.id}" ${t.id===V.tab?'aria-current="page"':""}><span class="np">${ico(t.icon)}</span>${t.label}</button>`).join("");
  const v = $("#view");
  v.innerHTML = ({home:viewHome, tx:viewTx, budget:viewBudget, report:viewReport, more:viewMore})[V.tab]();
  wire(v);
  window.scrollTo({top:0});
}
function applyTheme(){
  const t = S.s.theme==="auto"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : S.s.theme;
  document.documentElement.dataset.theme = t;
  const m=document.querySelector('meta[name=theme-color]');
  if(m) m.content = t==="dark" ? "#0a0e1c" : "#f5f7fd";
}

/* ---------------- home ---------------- */
function viewHome(){
  const range = rangeFor(V.scope, V.anchor);
  const list = periodTx(range), T = totals(list);
  const prevAnchor = shiftedAnchor(V.scope, V.anchor, -1);
  const prevRange = rangeFor(V.scope, prevAnchor);
  const prev = totals(periodTx(prevRange));
  const cats = byCategory(list);
  const surplus = T.net>=0;
  const denom = T.inc+T.out;
  const inPct = denom? T.inc/denom*100 : 50;

  let delta="";
  if(T.out>0 && prev.out>0){
    const d=(T.out-prev.out)/prev.out*100;
    delta = `<div class="hero-delta ${d>0?"down":""}">${ico(d>0?"arrowUp":"arrowDown")}${Math.abs(Math.round(d))}% spending vs ${periodCompareWord(V.scope)}</div>`;
  }else if(T.out>0){
    delta = `<div class="hero-delta">${ico("trendUp")}${fmtB(T.out/periodElapsedDays(range))} a day so far</div>`;
  }

  return `
  <section class="hero">
    <span class="hero-pill">${surplus?"Surplus":"Deficit"}</span>
    <div class="hero-amt mono">${fmtB(Math.abs(T.net))}</div>
    <div class="hero-cap">${surplus?"left over":"overspent"} ${periodNoun(V.scope)}</div>
    ${delta}
    <div class="hero-split">
      <div class="hero-cell">
        <span class="ar" style="background:var(--hero-fill2);color:var(--hero-in)">${ico("arrowDown")}</span>
        <div><small>In</small><b class="mono">${fmtB(T.inc,true)}</b></div>
      </div>
      <div class="hero-cell">
        <span class="ar" style="background:var(--hero-fill2);color:var(--hero-out)">${ico("arrowUp")}</span>
        <div><small>Out</small><b class="mono">${fmtB(T.out,true)}</b></div>
      </div>
    </div>
    ${denom? `<div class="hero-ratio">
      <div class="lbls"><span style="color:var(--hero-in)">In ${Math.round(inPct)}%</span><span style="color:var(--hero-out)">Out ${100-Math.round(inPct)}%</span></div>
      <div class="track"><i style="width:${inPct}%;background:var(--hero-in)"></i><i style="width:${100-inPct}%;background:var(--hero-out)"></i></div>
    </div>`:""}
    <button class="hero-link" data-go="tx">${list.length} transaction${list.length===1?"":"s"} ${periodNoun(V.scope)} ${ico("chevR")}</button>
  </section>

  ${periodBarHTML()}

  ${quickAddHTML()}

  <div class="qacts">
    <button class="pri" data-sheet="add">${ico("plus")}Add</button>
    <button data-go="budget">${ico("piggy")}Budget</button>
    <button data-go="report">${ico("chart")}Reports</button>
  </div>

  <section class="sec">
    <div class="sec-hd"><h2>Recent</h2>${list.length?`<button data-go="tx">See all</button>`:""}</div>
    ${list.length ? listHTML(list.slice(0,7)) : `<div class="card empty"><b>Nothing yet ${periodNoun(V.scope)}</b>Type an entry above — try <i>lunch 25rmb</i>.</div>`}
  </section>

  ${cats.length ? `<section class="sec">
    <div class="sec-hd"><h2>Where it went</h2><button data-go="report">Reports</button></div>
    ${catBoxHTML(cats, T.out, 6)}
  </section>`:""}`;
}

function quickAddHTML(){
  const d = V.qaDate;
  return `<div class="qa">
    <div class="qa-row">
      ${ico("plus")}
      <input id="qin" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="dinner food 20rmb" value="${esc($("#qin")?$("#qin").value:"")}">
      <button class="qa-date ${d?"set":""}" id="qaDateBtn">${ico("cal")}<span>${d?dayLabel(d):"Today"}</span></button>
      <button class="qa-go" id="qaGo" disabled aria-label="Add">${ico("check")}</button>
    </div>
    <div class="qa-prev" id="qaPrev"></div>
    <input type="date" id="qaDateIn" style="position:absolute;opacity:0;pointer-events:none;width:1px;height:1px">
  </div>
  <div class="examples">
    ${["dinner food 20rmb","kopi 18rb","grab 25k","kemarin nasi goreng 15000","listrik 300rb","+gaji 8000rmb"]
      .map(e=>`<button data-ex="${esc(e)}">${esc(e)}</button>`).join("")}
  </div>`;
}

function listHTML(list){
  const groups=new Map();
  for(const t of list){ const k=dstr(t.ts); if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(t); }
  return [...groups.entries()].map(([k,ts])=>{
    const net = ts.reduce((a,t)=>a+(t.type==="income"?1:-1)*toBase(t.amt,t.cur,t.rate),0);
    return `<div class="daygrp">
      <div class="eyebrow">${esc(dayLabel(fromDstr(k)))}<span class="mono" style="color:${net>=0?"var(--inc-tx)":"var(--muted)"}">${net>0?"+":""}${fmtB(net)}</span></div>
      <div class="rows">${ts.map(rowHTML).join("")}</div>
    </div>`;
  }).join("");
}
function rowHTML(t){
  const c=CATBY[t.cat]||CATBY.other, inc=t.type==="income";
  const alt = t.cur!==S.s.base ? `<span class="amt-sub mono">${esc(fmt(t.amt,t.cur))}</span>` : "";
  return `<button class="row" data-edit="${t.id}">
    <span class="ic" style="background:${tint(c.color,.13)};color:${c.color}">${ico(c.icon)}</span>
    <span class="mid"><b>${esc(t.note || c.label)}</b><small>${esc(c.label)}</small></span>
    <span><span class="amt-pill ${inc?"in":"out"} mono">${inc?"+":"−"}${fmtB(toBase(t.amt,t.cur,t.rate))}</span>${alt}</span>
  </button>`;
}
function catBoxHTML(cats, total, limit){
  const shown = limit? cats.slice(0,limit) : cats;
  const rest = limit? cats.slice(limit) : [];
  const restSum = rest.reduce((a,x)=>a+x[1],0);
  return `<div class="card catbox">
    <div class="tot"><span>Total out</span><b class="mono">${fmtB(total)}</b></div>
    ${shown.map(([id,v])=>{
      const c=CATBY[id]||CATBY.other, pct=total? v/total*100 : 0;
      return `<button class="catrow" data-cat="${id}">
        <span class="ic" style="background:${tint(c.color,.13)};color:${c.color}">${ico(c.icon)}</span>
        <span class="g">
          <span class="t"><b>${esc(c.label)}</b><i class="mono">${fmtB(v)}</i></span>
          <span class="track"><i style="width:${pct}%;background:${c.color}"></i></span>
        </span>
        <span class="pct">${pct<1?"<1":Math.round(pct)}%</span>
      </button>`;
    }).join("")}
    ${rest.length? `<div class="catmore"><span>+${rest.length} more categor${rest.length===1?"y":"ies"}</span><b class="mono">${fmtB(restSum)}</b></div>`:""}
  </div>`;
}

/* ---------------- transactions ---------------- */
function viewTx(){
  const range = rangeFor(V.scope, V.anchor);
  const all = periodTx(range);
  const q = V.q.trim().toLowerCase();
  const list = all.filter(t =>
    (!V.cat || t.cat===V.cat) &&
    (!q || (t.note||"").toLowerCase().includes(q) || CATBY[t.cat].label.toLowerCase().includes(q)));
  const T = totals(list);
  const used = [...new Set(all.map(t=>t.cat))].map(id=>CATBY[id]).filter(Boolean);

  return `
  ${periodBarHTML()}
  <div class="searchbar">${ico("search")}<input id="q" placeholder="Search notes and categories" value="${esc(V.q)}" autocomplete="off"></div>
  ${used.length? `<div class="chiprow">
    <button class="chip" data-filter="" ${!V.cat?'aria-pressed="true"':""}>All</button>
    ${used.map(c=>`<button class="chip" data-filter="${c.id}" ${V.cat===c.id?'aria-pressed="true"':""}><span style="color:${c.color};display:flex">${ico(c.icon)}</span>${esc(c.label)}</button>`).join("")}
  </div>`:""}

  <div class="stats" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat t-in" style="padding:13px 12px">
      <div class="top"><span class="ic" style="background:var(--inc);color:#fff">${ico("arrowDown")}</span></div>
      <div class="big mono" style="font-size:17px;color:var(--inc-tx)">${fmtB(T.inc,true)}</div><div class="sub">In</div></div>
    <div class="stat t-out" style="padding:13px 12px">
      <div class="top"><span class="ic" style="background:var(--exp);color:#fff">${ico("arrowUp")}</span></div>
      <div class="big mono" style="font-size:17px;color:var(--exp-tx)">${fmtB(T.out,true)}</div><div class="sub">Out</div></div>
    <div class="stat t-net" style="padding:13px 12px">
      <div class="top"><span class="ic" style="background:var(--a-violet);color:#fff">${ico("scale")}</span></div>
      <div class="big mono" style="font-size:17px;color:var(--a-violet-tx)">${T.net>=0?"+":""}${fmtB(T.net,true)}</div><div class="sub">Net</div></div>
  </div>

  <div class="qacts" style="grid-template-columns:1fr 1fr">
    <button data-sheet="paste">${ico("layers")}Paste many</button>
    <button data-act="csv">${ico("dl")}Export CSV</button>
  </div>

  <section class="sec">
    <div class="sec-hd"><h2>${list.length} entr${list.length===1?"y":"ies"}</h2></div>
    ${list.length ? listHTML(list) : `<div class="card empty"><b>Nothing found</b>${all.length?"Try clearing the search or filter.":"No transactions "+periodNoun(V.scope)+"."}</div>`}
  </section>`;
}
function monthBarHTML(){
  const atNow = monthStart(V.anchor) >= monthStart(Date.now());
  return `<div class="monthbar"><div class="nav">
    <button data-month="-1" aria-label="Previous month">${ico("chevL")}</button>
    <b>${monthLabel(V.anchor)}</b>
    <button data-month="1" ${atNow?"disabled":""} aria-label="Next month">${ico("chevR")}</button>
  </div></div>`;
}
const SCOPES = [["day","Day"],["week","Week"],["month","Month"],["year","Year"]];
function periodBarHTML(){
  const atNow = rangeFor(V.scope, V.anchor).s >= rangeFor(V.scope, Date.now()).s;
  const label = rangeFor(V.scope, V.anchor).label;
  return `<div class="seg period">
    ${SCOPES.map(([id,lb])=>`<button data-scope="${id}" ${V.scope===id?'aria-pressed="true"':""}>${lb}</button>`).join("")}
  </div>
  <div class="monthbar"><div class="nav">
    <button data-shift="-1" aria-label="Previous period">${ico("chevL")}</button>
    <b>${esc(label)}</b>
    <button data-shift="1" ${atNow?"disabled":""} aria-label="Next period">${ico("chevR")}</button>
  </div></div>`;
}

/* ---------------- budget ---------------- */
function viewBudget(){
  const list = monthTx(V.anchor), T = totals(list);
  const cats = Object.fromEntries(byCategory(list));
  const total = +S.s.budget||0;
  const pct = total? Math.min(100, T.out/total*100) : 0;
  const col = pct>=100?"var(--exp)":pct>=80?"var(--warn)":"var(--inc)";
  const daysIn = daysInMonth(V.anchor);
  const dayNow = daysElapsed(V.anchor);
  const pace = total ? (total/daysIn)*dayNow : 0;

  return `
  ${monthBarHTML()}
  <div class="stats" style="margin-top:14px">
    <div class="stat t-bud">
      <div class="top"><span class="ic" style="background:var(--brand);color:#fff">${ico("target")}</span><span style="color:var(--brand-tx)">Monthly budget</span></div>
      ${total? `
        <div class="big mono" style="color:${col}">${fmtB(total-T.out)}</div>
        <div class="sub">left of ${fmtB(total)} · ${Math.round(pct)}% used</div>
        <div class="track"><i style="width:${pct}%;background:${col}"></i></div>
        <div class="sub" style="margin-top:8px">${
          !pace ? "" :
          T.out>pace ? `Ahead of pace by ${fmtB(T.out-pace)} on day ${dayNow}`
                     : `Under pace by ${fmtB(pace-T.out)} on day ${dayNow}`}</div>`
      : `<div class="big mono" style="color:var(--muted)">Not set</div>
         <div class="sub">Set a monthly cap to track how much is left.</div>`}
      <div class="fld" style="margin:14px 0 0">
        <label>Total budget for the month (${CUR[S.s.base].sym})</label>
        <input id="budTotal" inputmode="decimal" placeholder="0 = off" value="${total||""}">
      </div>
    </div>
  </div>

  <section class="sec">
    <div class="sec-hd"><h2>Per category</h2><span style="font-size:12.5px;color:var(--muted);font-weight:600">Spent / cap</span></div>
    <div class="card">
      ${CATS.filter(c=>c.kind==="expense").map(c=>{
        const spent = cats[c.id]||0, cap = +(S.s.budgets[c.id]||0);
        const p = cap? Math.min(100, spent/cap*100) : 0;
        const cc = p>=100?"var(--exp)":p>=80?"var(--warn)":c.color;
        return `<div class="budrow">
          <span class="ic" style="background:${tint(c.color,.13)};color:${c.color}">${ico(c.icon)}</span>
          <span class="g">
            <span class="t"><b>${esc(c.label)}</b><i class="mono">${spent?fmtB(spent,true):"—"}</i></span>
            <span class="track"><i style="width:${p}%;background:${cc}"></i></span>
          </span>
          <input inputmode="decimal" data-bud="${c.id}" placeholder="—" value="${cap||""}">
        </div>`;
      }).join("")}
    </div>
  </section>`;
}

/* ---------------- reports ---------------- */
function viewReport(){
  const range = rangeFor(V.scope, V.anchor);
  const list = periodTx(range), T = totals(list);
  const cats = byCategory(list);
  const elapsed = periodElapsedDays(range);

  let chartHTML = "";
  if(V.scope==="day"){
    chartHTML = `<div class="card empty"><b>No daily chart for a single day</b>Switch to Week, Month, or Year to see a flow chart.</div>`;
  }else{
    let labels, bucketOf;
    if(V.scope==="week"){
      labels = Array.from({length:7},(_,i)=>{ const d=new Date(range.s); d.setDate(d.getDate()+i); return DOW[d.getDay()]; });
      bucketOf = t => Math.floor((sod(t.ts)-range.s)/DAY);
    }else if(V.scope==="year"){
      labels = MON.slice();
      bucketOf = t => new Date(t.ts).getMonth();
    }else{
      const days = daysInMonth(V.anchor);
      labels = Array.from({length:days},(_,i)=>String(i+1));
      bucketOf = t => new Date(t.ts).getDate()-1;
    }
    const outSeries = new Array(labels.length).fill(0), inSeries = new Array(labels.length).fill(0);
    for(const t of list){
      const b = bucketOf(t);
      if(b<0 || b>=labels.length) continue;
      const v = toBase(t.amt,t.cur,t.rate);
      if(t.type==="income") inSeries[b]+=v; else outSeries[b]+=v;
    }
    chartHTML = `<section class="sec">
      <div class="sec-hd"><h2>${V.scope==="year"?"Monthly flow":"Daily flow"}</h2><span style="font-size:12.5px;color:var(--muted);font-weight:600">${esc(range.label)}</span></div>
      <div class="card chartbox">
        ${flowChart(inSeries, outSeries, labels)}
        <div class="legend2"><span><i style="background:var(--exp)"></i>Out</span><span><i style="background:var(--inc)"></i>In</span></div>
      </div>
    </section>`;
  }

  const notes = {};
  for(const t of list){ if(t.type!=="expense") continue; const k=(t.note||CATBY[t.cat].label).toLowerCase(); notes[k]=(notes[k]||0)+toBase(t.amt,t.cur,t.rate); }
  const topNotes = Object.entries(notes).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // last 6 months of spending
  let monthsHTML = "";
  if(V.scope!=="year"){
    const months=[];
    for(let i=5;i>=0;i--){
      const d=new Date(V.anchor); d.setMonth(d.getMonth()-i,1);
      const tt=totals(monthTx(d.getTime()));
      months.push({label:MON[d.getMonth()], out:tt.out, inc:tt.inc, cur:i===0});
    }
    monthsHTML = `<section class="sec">
      <div class="sec-hd"><h2>Last 6 months</h2></div>
      <div class="card chartbox">${monthsChart(months)}</div>
    </section>`;
  }

  return `
  ${periodBarHTML()}
  <div class="stats" style="grid-template-columns:1fr 1fr;margin-top:14px">
    <div class="stat t-out"><div class="top"><span class="ic" style="background:var(--exp);color:#fff">${ico("arrowUp")}</span><span style="color:var(--exp-tx)">Spent</span></div>
      <div class="big mono" style="font-size:21px;color:var(--exp-tx)">${fmtB(T.out,true)}</div>
      <div class="sub">${fmtB(T.out/elapsed)} a day</div></div>
    <div class="stat t-in"><div class="top"><span class="ic" style="background:var(--inc);color:#fff">${ico("arrowDown")}</span><span style="color:var(--inc-tx)">Earned</span></div>
      <div class="big mono" style="font-size:21px;color:var(--inc-tx)">${fmtB(T.inc,true)}</div>
      <div class="sub">${T.inc? "Spent "+Math.round(T.out/T.inc*100)+"% of it" : "No income logged"}</div></div>
  </div>

  ${chartHTML}

  ${monthsHTML}

  ${cats.length? `<section class="sec">
    <div class="sec-hd"><h2>By category</h2></div>
    ${catBoxHTML(cats, T.out)}
  </section>`:""}

  ${topNotes.length? `<section class="sec">
    <div class="sec-hd"><h2>Biggest habits</h2></div>
    <div class="card catbox">
      ${topNotes.map(([n,v])=>`<div class="catrow"><span class="g"><span class="t"><b>${esc(n)}</b><i class="mono">${fmtB(v)}</i></span>
        <span class="track"><i style="width:${v/topNotes[0][1]*100}%;background:var(--brand)"></i></span></span></div>`).join("")}
    </div>
  </section>`:""}`;
}

function flowChart(inS, outS, labels){
  const days = labels.length;
  const W=380, H=190, PL=42, PR=6, PT=10, PB=24;
  const max = Math.max(...inS, ...outS, 1);
  const x = i => PL + (i/(days-1||1))*(W-PL-PR);
  const y = v => H-PB - (v/max)*(H-PT-PB);
  const path = arr => arr.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ");
  const area = arr => path(arr)+` L${x(days-1).toFixed(1)} ${H-PB} L${PL} ${H-PB} Z`;
  const ticks=[0,.5,1].map(f=>max*f);
  const step = days>20?5:days>10?3:1;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Money in and out over time">
    ${ticks.map(t=>`<line class="grid" x1="${PL}" x2="${W-PR}" y1="${y(t)}" y2="${y(t)}"/>
      <text x="${PL-7}" y="${y(t)+3.5}" text-anchor="end">${esc(fmtB(t,true))}</text>`).join("")}
    <path d="${area(outS)}" fill="var(--exp)" opacity=".10"/>
    <path d="${area(inS)}" fill="var(--inc)" opacity=".10"/>
    <path d="${path(outS)}" fill="none" stroke="var(--exp)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${path(inS)}" fill="none" stroke="var(--inc)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    ${Array.from({length:days},(_,i)=>i).filter(i=>i%step===0||i===days-1)
      .map(i=>`<text x="${x(i)}" y="${H-7}" text-anchor="middle">${esc(labels[i])}</text>`).join("")}
  </svg>`;
}
function monthsChart(months){
  const W=380, H=160, PL=42, PR=6, PT=8, PB=26;
  const max = Math.max(...months.map(m=>m.out), 1);
  const n=months.length, slot=(W-PL-PR)/n, bw=Math.min(30, slot*.55);
  const y = v => H-PB - (v/max)*(H-PT-PB);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Spending over the last six months">
    ${[0,.5,1].map(f=>`<line class="grid" x1="${PL}" x2="${W-PR}" y1="${y(max*f)}" y2="${y(max*f)}"/>
      <text x="${PL-7}" y="${y(max*f)+3.5}" text-anchor="end">${esc(fmtB(max*f,true))}</text>`).join("")}
    ${months.map((m,i)=>{
      const cx=PL+slot*i+slot/2, h=Math.max(m.out>0?3:0,(m.out/max)*(H-PT-PB));
      return `<g><rect x="${cx-bw/2}" y="${y(m.out)}" width="${bw}" height="${h}" rx="5"
        fill="${m.cur?"var(--brand)":"var(--exp)"}" opacity="${m.cur?1:.35}"><title>${esc(m.label)}: ${esc(fmtB(m.out))}</title></rect>
        <text x="${cx}" y="${H-8}" text-anchor="middle" style="font-weight:${m.cur?800:600};fill:${m.cur?"var(--brand)":"var(--faint)"}">${m.label}</text></g>`;
    }).join("")}
  </svg>`;
}

/* ---------------- settings ---------------- */
function viewMore(){
  const n = S.txs.length;
  const first = n? new Date(Math.min(...S.txs.map(t=>t.ts))) : null;
  const dotClass = {on:"on", off:"off", error:"err", connecting:"busy", syncing:"busy"}[SYNC.status]||"off";
  return `
  <div class="setgrp">
    <span class="eyebrow">Money</span>
    <div class="setlist">
      <div class="setrow"><span class="ic">${ico("wallet")}</span>
        <span class="g"><b>Main currency</b><small>Everything is totalled in this</small></span>
        <select id="setBase">${Object.values(CUR).map(c=>`<option value="${c.code}" ${S.s.base===c.code?"selected":""}>${c.sym} ${c.code}</option>`).join("")}</select></div>
      <div class="setrow"><span class="ic">${ico("scale")}</span>
        <span class="g"><b>Exchange rate</b><small>Default for new entries — edit a past entry to fix its own conversion</small></span>
        <input id="setRate" inputmode="decimal" value="${S.s.rate}"></div>
      <button class="setrow" id="setSmart"><span class="ic">${ico("target")}</span>
        <span class="g"><b>Guess the currency</b><small>${S.s.smart?"Under 1,000 → ¥ · 1,000+ → Rp":"Bare numbers use "+CUR[S.s.def].sym+" "+S.s.def}</small></span>
        <span class="switch" aria-pressed="${!!S.s.smart}"><i></i></span></button>
      ${S.s.smart?"":`<div class="setrow"><span class="ic">${ico("card")}</span>
        <span class="g"><b>Default currency</b><small>Used when you don't type one</small></span>
        <select id="setDef">${Object.values(CUR).map(c=>`<option value="${c.code}" ${S.s.def===c.code?"selected":""}>${c.sym} ${c.code}</option>`).join("")}</select></div>`}
    </div>
  </div>

  <div class="setgrp" data-hue="cyan">
    <span class="eyebrow">Sync</span>
    <div class="setlist">
      <button class="setrow" id="setSync"><span class="ic">${ico("cloud")}</span>
        <span class="g"><b>Sync across devices</b><small style="display:flex;align-items:center;gap:6px"><i class="syncdot ${dotClass}"></i>${esc(SYNC.msg)}</small></span>
        <span class="switch" aria-pressed="${!!S.s.sync}"><i></i></span></button>
      <button class="setrow" data-sheet="firebase"><span class="ic">${ico("cog")}</span>
        <span class="g"><b>Firebase settings</b><small>${S.s.fb?"Project "+esc(S.s.fb.projectId||"configured"):"Not configured yet"}</small></span>
        <span class="val">${ico("chevR")}</span></button>
      ${S.s.lastSync? `<div class="setrow"><span class="ic">${ico("clock")}</span>
        <span class="g"><b>Last synced</b><small>${new Date(S.s.lastSync).toLocaleString()}</small></span></div>`:""}
    </div>
  </div>

  <div class="setgrp" data-hue="violet">
    <span class="eyebrow">Your data</span>
    <div class="setlist">
      <button class="setrow" data-act="backup"><span class="ic">${ico("dl")}</span>
        <span class="g"><b>Export backup</b><small>A JSON file with everything</small></span><span class="val">${ico("chevR")}</span></button>
      <button class="setrow" data-act="restore"><span class="ic">${ico("up")}</span>
        <span class="g"><b>Import backup</b><small>Merge or replace from a JSON file</small></span><span class="val">${ico("chevR")}</span></button>
      <button class="setrow" data-act="csv"><span class="ic">${ico("list")}</span>
        <span class="g"><b>Export CSV</b><small>For Excel or Google Sheets</small></span><span class="val">${ico("chevR")}</span></button>
      <button class="setrow danger" data-act="erase"><span class="ic">${ico("trash")}</span>
        <span class="g"><b>Erase everything</b><small>${n} transaction${n===1?"":"s"} on this device</small></span></button>
    </div>
  </div>

  <div class="setgrp" data-hue="amber">
    <span class="eyebrow">Appearance</span>
    <div class="setlist">
      <div class="setrow"><span class="ic">${ico(S.s.theme==="dark"?"moon":"sun")}</span>
        <span class="g"><b>Theme</b><small>Follows your device by default</small></span>
        <select id="setTheme">
          <option value="auto" ${S.s.theme==="auto"?"selected":""}>Automatic</option>
          <option value="light" ${S.s.theme==="light"?"selected":""}>Light</option>
          <option value="dark" ${S.s.theme==="dark"?"selected":""}>Dark</option>
        </select></div>
    </div>
  </div>

  <p style="text-align:center;color:var(--faint);font-size:12.5px;margin:22px 0 0;font-weight:600">
    ${n? `${n} transactions since ${first.getDate()} ${MON[first.getMonth()]} ${first.getFullYear()}` : "No transactions yet"}<br>
    Saved on this device${S.s.sync?" and synced":""}.
  </p>`;
}

/* ============================ event wiring ============================ */
function wire(root){
  root.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  root.querySelectorAll("[data-sheet]").forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));
  root.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openSheet("add", b.dataset.edit));
  root.querySelectorAll("[data-month]").forEach(b=>b.onclick=()=>{
    const d=new Date(V.anchor); d.setMonth(d.getMonth()+ +b.dataset.month, 1); V.anchor=d.getTime(); draw();
  });
  root.querySelectorAll("[data-scope]").forEach(b=>b.onclick=()=>{ V.scope=b.dataset.scope; draw(); });
  root.querySelectorAll("[data-shift]").forEach(b=>b.onclick=()=>{
    V.anchor = shiftedAnchor(V.scope, V.anchor, +b.dataset.shift); draw();
  });
  root.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{ V.cat=b.dataset.filter||null; draw(); });
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{ V.cat=b.dataset.cat; go("tx"); });
  root.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>action(b.dataset.act));
  root.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{
    const i=$("#qin"); i.value=b.dataset.ex; i.focus(); qaPreview();
  });

  const q = root.querySelector("#q");
  if(q) q.oninput = debounce(()=>{ V.q=q.value; const p=q.selectionStart; draw(); const n=$("#q"); if(n){ n.focus(); n.setSelectionRange(p,p); } }, 220);

  const qin = root.querySelector("#qin");
  if(qin){
    qin.oninput = qaPreview;
    qin.onkeydown = e => { if(e.key==="Enter"){ e.preventDefault(); quickAdd(); } };
    root.querySelector("#qaGo").onclick = quickAdd;
    const di = root.querySelector("#qaDateIn");
    root.querySelector("#qaDateBtn").onclick = () => {
      di.value = dstr(V.qaDate||today());
      if(di.showPicker) { try{ di.showPicker(); return; }catch(e){} }
      di.style.position="static"; di.style.opacity="1"; di.style.width="auto"; di.style.height="auto"; di.style.pointerEvents="auto"; di.focus();
    };
    di.onchange = () => {
      V.qaDate = di.value ? fromDstr(di.value) : null;
      const btn=$("#qaDateBtn");
      btn.classList.toggle("set", V.qaDate!==null && V.qaDate!==today());
      btn.querySelector("span").textContent = V.qaDate? dayLabel(V.qaDate):"Today";
      qaPreview();
    };
    qaPreview();
  }

  const bt = root.querySelector("#budTotal");
  if(bt) bt.oninput = debounce(()=>{ S.s.budget = parseNum(bt.value)||0; commit({quiet:true}); refreshBudgetBars(); }, 300);
  root.querySelectorAll("[data-bud]").forEach(inp=>{
    inp.oninput = debounce(()=>{
      const v=parseNum(inp.value)||0;
      if(v) S.s.budgets[inp.dataset.bud]=v; else delete S.s.budgets[inp.dataset.bud];
      commit({quiet:true}); refreshBudgetBars();
    }, 300);
  });

  const bind=(sel,ev,fn)=>{ const n=root.querySelector(sel); if(n) n[ev]=fn; };
  bind("#setBase","onchange",e=>{ S.s.base=e.target.value; commit(); });
  bind("#setDef","onchange",e=>{ S.s.def=e.target.value; commit(); });
  bind("#setTheme","onchange",e=>{ S.s.theme=e.target.value; commit(); });
  bind("#setRate","oninput",debounce(e=>{ const v=parseNum(e.target.value); if(v>0){ S.s.rate=v; commit({quiet:true}); } },400));
  bind("#setSmart","onclick",()=>{ S.s.smart=!S.s.smart; commit(); });
  bind("#setSync","onclick",toggleSync);
}
function refreshBudgetBars(){
  // Update the bars in place so typing in a budget field never loses focus.
  const list = monthTx(V.anchor), T = totals(list), cats = Object.fromEntries(byCategory(list));
  document.querySelectorAll("[data-bud]").forEach(inp=>{
    const cap=+(S.s.budgets[inp.dataset.bud]||0), spent=cats[inp.dataset.bud]||0;
    const bar=inp.parentElement.querySelector(".track i");
    if(!bar) return;
    const p = cap? Math.min(100, spent/cap*100) : 0;
    bar.style.width = p+"%";
    bar.style.background = p>=100?"var(--exp)":p>=80?"var(--warn)":CATBY[inp.dataset.bud].color;
  });
  const tot=+S.s.budget||0, st=document.querySelector(".stat .big");
  if(st && V.tab==="budget" && tot){
    const pct=Math.min(100,T.out/tot*100), col=pct>=100?"var(--exp)":pct>=80?"var(--warn)":"var(--inc)";
    st.textContent = fmtB(tot-T.out); st.style.color=col;
    const bar=document.querySelector(".stat .track i");
    if(bar){ bar.style.width=pct+"%"; bar.style.background=col; }
  }
}
function go(tab){ V.tab=tab; if(tab!=="tx"){ V.q=""; } draw(); }
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

/* ============================ quick add ============================ */
function qaPreview(){
  const inp=$("#qin"), box=$("#qaPrev"), go=$("#qaGo");
  if(!inp||!box) return;
  const p = parse(inp.value, V.qaDate||today());
  go.disabled = !p.ok;
  if(!inp.value.trim() || !p.ok){ box.innerHTML=""; return; }
  const c = CATBY[p.cat];
  const conv = p.cur!==S.s.base ? `<span class="tag">≈ <b>${esc(fmtB(toBase(p.amt,p.cur)))}</b></span>` : "";
  const showDate = p.ts !== today();
  box.innerHTML = `
    <span class="tag money ${p.type==="income"?"in":""}"><b>${p.type==="income"?"+":"−"}${esc(fmt(p.amt,p.cur))}</b></span>
    ${conv}
    <span class="tag"><span style="color:${c.color};display:flex">${ico(c.icon)}</span><b>${esc(c.label)}</b></span>
    ${p.note?`<span class="tag"><b>${esc(p.note)}</b></span>`:""}
    ${showDate?`<span class="tag">${ico("cal")}<b>${esc(dayLabel(p.ts))}</b></span>`:""}`;
}
function quickAdd(){
  const inp=$("#qin");
  const p = parse(inp.value, V.qaDate||today());
  if(!p.ok){ inp.focus(); return; }
  const t = addTx(p);
  inp.value="";
  const r = rangeFor(V.scope, V.anchor);
  if(!(t.ts>=r.s && t.ts<r.e)) V.anchor = t.ts;
  commit();
  toast(`${fmt(t.amt,t.cur)} · ${CATBY[t.cat].label}`, "Undo", ()=>{ removeTx(t.id); commit(); });
  const again=$("#qin"); if(again) again.focus();
}

/* ============================ sheets ============================ */
let sheetState = null;
const ovl=()=>$("#sheetOvl");
function closeSheet(){ ovl().classList.remove("on"); document.body.style.overflow=""; sheetState=null; }
function showSheet(title, body, foot){
  $("#sheetTitle").textContent = title;
  $("#sheetBody").innerHTML = body;
  $("#sheetFoot").innerHTML = foot||"";
  ovl().classList.add("on");
  document.body.style.overflow="hidden";
}
function openSheet(kind, arg){
  if(kind==="add") return sheetAdd(arg);
  if(kind==="paste") return sheetPaste();
  if(kind==="firebase") return sheetFirebase();
}

/* ---- add / edit ---- */
function sheetAdd(editId){
  const t = editId ? S.txs.find(x=>x.id===editId) : null;
  sheetState = {
    id: t?t.id:null,
    type: t?t.type:"expense",
    cur: t?t.cur:(S.s.smart?S.s.def:S.s.def),
    cat: t?t.cat:"other",
    ts: t?t.ts:(V.qaDate||today()),
    rate: t&&t.rate>0 ? t.rate : rate()
  };
  showSheet(t?"Edit transaction":"Add transaction", `
    <div class="fld"><div class="seg out" id="sType">
      <button data-t="expense">Expense</button><button data-t="income">Income</button></div></div>
    <div class="fld"><label>Amount</label>
      <div class="amtfield">
        <input id="sAmt" inputmode="decimal" placeholder="0" value="${t?t.amt:""}">
        <select id="sCur">${Object.values(CUR).map(c=>`<option value="${c.code}">${c.sym} ${c.code}</option>`).join("")}</select>
      </div>
      <div class="hint" id="sConv"></div></div>
    <div class="fld" id="sRateFld" style="display:none"><label>Exchange rate (Rp per ¥1)</label>
      <input id="sRateField" inputmode="decimal" value="${sheetState.rate}"></div>
    <div class="fld"><label>Note</label><input id="sNote" placeholder="e.g. dinner at warung" value="${t?esc(t.note):""}"></div>
    <div class="fld"><label>Date</label><input id="sDate" type="date" value="${dstr(sheetState.ts)}"></div>
    <div class="fld"><label>Category</label><div class="catgrid" id="sCats"></div></div>
  `, `${t?`<button class="btn del" id="sDel">${ico("trash")}</button>`:""}
     <button class="btn sec" data-close>Cancel</button>
     <button class="btn pri" id="sSave">${t?"Save":"Add"}</button>`);

  const amt=$("#sAmt"), cur=$("#sCur"), conv=$("#sConv"), rateFld=$("#sRateFld"), rateInp=$("#sRateField");
  cur.value = sheetState.cur;
  const paintType=()=>{
    $("#sType").className = "seg "+(sheetState.type==="income"?"":"out");
    [...$("#sType").children].forEach(b=>b.setAttribute("aria-pressed", b.dataset.t===sheetState.type));
    paintCats();
  };
  const paintCats=()=>{
    const kind = sheetState.type;
    const opts = CATS.filter(c=>c.kind===kind);
    if(!opts.some(c=>c.id===sheetState.cat)) sheetState.cat = kind==="income"?"otherinc":"other";
    $("#sCats").innerHTML = opts.map(c=>`<button data-c="${c.id}" ${c.id===sheetState.cat?'aria-pressed="true"':""}
      style="${c.id===sheetState.cat?`border-color:${c.color}`:""}">
      <span class="ic" style="background:${tint(c.color,.13)};color:${c.color}">${ico(c.icon)}</span>${esc(c.label)}</button>`).join("");
    $("#sCats").querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ sheetState.cat=b.dataset.c; paintCats(); });
  };
  const curRate=()=>{ const r=parseNum(rateInp.value); return r>0?r:rate(); };
  const paintConv=()=>{
    const v=parseNum(amt.value)||0;
    const showRate = cur.value!==S.s.base;
    rateFld.style.display = showRate?"":"none";
    conv.textContent = (showRate && v)
      ? `≈ ${fmtB(toBase(v,cur.value,curRate()))} at ${new Intl.NumberFormat("en-US").format(curRate())} Rp per ¥1`
      : "";
  };
  $("#sType").onclick=e=>{ const b=e.target.closest("button"); if(!b)return; sheetState.type=b.dataset.t; paintType(); };
  amt.oninput=paintConv; cur.onchange=()=>{ sheetState.cur=cur.value; paintConv(); };
  rateInp.oninput=paintConv;
  paintType(); paintConv();
  setTimeout(()=>{ if(!t) amt.focus(); },120);

  $("#sSave").onclick=()=>{
    const v=parseNum(amt.value);
    if(!v||v<=0){ amt.focus(); amt.style.borderColor="var(--exp)"; setTimeout(()=>amt.style.borderColor="",1000); return; }
    const data={ amt:Math.abs(v), cur:cur.value, type:sheetState.type, cat:sheetState.cat,
                 note:$("#sNote").value.trim(), ts:fromDstr($("#sDate").value||dstr(today())),
                 rate:parseNum(rateInp.value)||rate() };
    if(sheetState.id){
      Object.assign(S.txs.find(x=>x.id===sheetState.id), data, {up:Date.now()});
      closeSheet(); commit(); toast("Saved");
    }else{
      const nt=addTx(data);
      const r = V.tab==="budget" ? {s:monthStart(V.anchor), e:monthEnd(V.anchor)} : rangeFor(V.scope, V.anchor);
      if(!(nt.ts>=r.s && nt.ts<r.e)) V.anchor=nt.ts;
      closeSheet(); commit();
      toast(`${fmt(nt.amt,nt.cur)} · ${CATBY[nt.cat].label}`, "Undo", ()=>{ removeTx(nt.id); commit(); });
    }
  };
  const del=$("#sDel");
  if(del) del.onclick=()=>{
    const t2=removeTx(sheetState.id);
    closeSheet(); commit();
    if(t2) toast("Deleted", "Undo", ()=>{ restoreTx(t2); commit(); });
  };
}

/* ---- bulk paste ---- */
function sheetPaste(){
  showSheet("Paste many at once", `
    <p style="margin:0 0 14px;color:var(--muted);font-size:13.5px;font-weight:500">
      One entry per line, same shorthand as the quick box. Put a date word on any line
      (<b>kemarin</b>, <b>3 hari lalu</b>, <b>12/8</b>) to backdate just that one.</p>
    <div class="fld"><label>Default date for lines without one</label>
      <input id="pDate" type="date" value="${dstr(V.qaDate||today())}"></div>
    <div class="fld"><label>Entries</label>
      <textarea id="pText" spellcheck="false" placeholder="lunch 25rmb&#10;kopi 18rb&#10;kemarin grab 45rb&#10;12/8 hotel 1.2jt"></textarea></div>
    <div id="pPrev"></div>
  `, `<button class="btn sec" data-close>Cancel</button><button class="btn pri" id="pGo" disabled>Add</button>`);

  const ta=$("#pText"), prev=$("#pPrev"), btn=$("#pGo"), dt=$("#pDate");
  const run=()=>{
    const base = dt.value? fromDstr(dt.value) : today();
    const rows = parseLines(ta.value, base);
    const good = rows.filter(r=>r.p.ok);
    btn.disabled = !good.length;
    btn.textContent = good.length? `Add ${good.length}` : "Add";
    if(!rows.length){ prev.innerHTML=""; return; }
    const tot = good.reduce((a,r)=>a+(r.p.type==="income"?1:-1)*toBase(r.p.amt,r.p.cur),0);
    prev.innerHTML = `<div class="paste-prev">${rows.map(({line,p})=>{
      if(!p.ok) return `<div class="p bad"><span class="ic" style="background:var(--exp-bg);color:var(--exp)">${ico("x")}</span>
        <span class="g"><b>${esc(line)}</b><small>No amount found — skipped</small></span></div>`;
      const c=CATBY[p.cat];
      return `<div class="p"><span class="ic" style="background:${tint(c.color,.13)};color:${c.color}">${ico(c.icon)}</span>
        <span class="g"><b>${esc(p.note||c.label)}</b><small>${esc(c.label)} · ${esc(dayLabel(p.ts))}</small></span>
        <span class="amt-pill ${p.type==="income"?"in":"out"} mono">${p.type==="income"?"+":"−"}${esc(fmt(p.amt,p.cur))}</span></div>`;
    }).join("")}</div>
    <p style="text-align:center;color:var(--muted);font-size:13px;font-weight:700;margin:12px 0 0">
      Net ${tot>=0?"+":""}${esc(fmtB(tot))} across ${good.length} entr${good.length===1?"y":"ies"}</p>`;
  };
  ta.oninput=debounce(run,180); dt.onchange=run;
  setTimeout(()=>ta.focus(),120);
  btn.onclick=()=>{
    const base = dt.value? fromDstr(dt.value) : today();
    const good = parseLines(ta.value, base).filter(r=>r.p.ok).map(r=>r.p);
    if(!good.length) return;
    const added = good.map(addTx);
    V.anchor = added[added.length-1].ts;
    closeSheet(); commit();
    toast(`Added ${added.length} entries`, "Undo", ()=>{ added.forEach(t=>removeTx(t.id)); commit(); });
  };
}

/* ---- firebase config ---- */
function sheetFirebase(){
  const cfg = S.s.fb ? JSON.stringify(S.s.fb,null,2) : "";
  showSheet("Firebase settings", `
    <p style="margin:0 0 14px;color:var(--muted);font-size:13.5px;font-weight:500">
      Paste the config object from your Firebase project (Project settings → Your apps → Web app).
      It stays on this device. See <b>README.md</b> for the full setup, including the Firestore rules.</p>
    <div class="fld"><label>Firebase config</label>
      <textarea id="fbText" spellcheck="false" placeholder='{\n  "apiKey": "…",\n  "authDomain": "your-app.firebaseapp.com",\n  "projectId": "your-app",\n  "appId": "…"\n}'>${esc(cfg)}</textarea>
      <div class="hint">These values are safe to keep in a public repo — Firestore rules are what protect your data.</div></div>
    <p style="color:var(--muted);font-size:13px;font-weight:500;margin:0">
      Heads up: Firebase is unreachable from mainland China without a VPN. The app keeps working offline
      and syncs whenever it can get through.</p>
  `, `<button class="btn sec" data-close>Cancel</button><button class="btn pri" id="fbSave">Save</button>`);
  $("#fbSave").onclick=()=>{
    const raw=$("#fbText").value.trim();
    if(!raw){ S.s.fb=null; S.s.sync=false; closeSheet(); commit(); return toast("Firebase config cleared"); }
    let cfgObj=null;
    try{
      cfgObj = JSON.parse(raw);
    }catch(e){
      try{ cfgObj = JSON.parse(raw.replace(/^[^{]*/,"").replace(/;?\s*$/,"").replace(/(\w+)\s*:/g,'"$1":').replace(/'/g,'"')); }
      catch(e2){ return toast("That doesn't look like valid config JSON."); }
    }
    if(!cfgObj || !cfgObj.apiKey || !cfgObj.projectId) return toast("Config needs at least apiKey and projectId.");
    S.s.fb = cfgObj;
    closeSheet(); commit();
    toast("Saved — turn on Sync to connect");
  };
}

/* ============================ actions ============================ */
async function action(kind){
  if(kind==="csv"){
    const q=s=>'"'+String(s==null?"":s).replace(/"/g,'""')+'"';
    const rows=[["date","type","category","note","amount","currency","rate","amount_in_"+S.s.base]];
    [...S.txs].sort((a,b)=>a.ts-b.ts).forEach(t=>
      rows.push([dstr(t.ts),t.type,CATBY[t.cat]?CATBY[t.cat].label:t.cat,t.note||"",t.amt,t.cur,t.cur===S.s.base?"":(t.rate||""),toBase(t.amt,t.cur,t.rate).toFixed(2)]));
    return download(`duit-${dstr(today())}.csv`, rows.map(r=>r.map(q).join(",")).join("\n"), "text/csv");
  }
  if(kind==="backup") return download(`duit-backup-${dstr(today())}.json`, JSON.stringify(S,null,2), "application/json");
  if(kind==="restore") return $("#fileIn").click();
  if(kind==="erase"){
    if(!S.txs.length) return toast("Nothing to erase.");
    if(!confirm(`Erase all ${S.txs.length} transactions on this device?\n\nThis can't be undone — export a backup first if you're unsure.`)) return;
    S.txs.forEach(t=>S.tomb.push({id:t.id, up:Date.now()}));
    S.txs=[]; commit(); toast("Everything erased.");
  }
}
async function download(name, text, mime){
  let host=null;
  try{ if(window.claude && window.claude.use) host = await window.claude.use("downloads"); }catch(e){}
  if(host){
    try{ await host.save({filename:name, data:text}); return toast("Saved "+name); }
    catch(err){
      const c=err&&err.code;
      if(c==="declined") return;
      if(c==="extension_not_enabled" && name.endsWith(".csv")){
        try{ await host.save({filename:name.replace(/\.csv$/,".txt"), data:text}); return toast("Saved as .txt — rename to .csv"); }catch(e){}
      }
      return toast("Couldn't save that file here.");
    }
  }
  const b=new Blob([text],{type:mime}), u=URL.createObjectURL(b);
  const a=document.createElement("a"); a.href=u; a.download=name;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(u); a.remove(); },500);
}
$("#fileIn").onchange = e => {
  const f=e.target.files[0]; if(!f) return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const p=JSON.parse(rd.result);
      const incoming=(p.txs||[]).filter(validTx);
      if(!incoming.length){ toast("No transactions in that file."); return; }
      const replace = confirm(`Found ${incoming.length} transactions.\n\nOK — replace everything here\nCancel — merge with what you have`);
      if(replace){
        S.txs.forEach(t=>S.tomb.push({id:t.id, up:Date.now()}));
        S.txs = incoming.map(t=>({...t, id:String(t.id||uid()), up:Date.now()}));
        if(p.s) Object.assign(S.s, p.s, {sync:S.s.sync, fb:S.s.fb, uid:S.s.uid});
      }else{
        const seen=new Set(S.txs.map(t=>t.id));
        incoming.forEach(t=>{ const id=String(t.id||uid()); if(!seen.has(id)) S.txs.push({...t, id, up:Date.now()}); });
      }
      commit(); toast(`Imported ${incoming.length} transactions`);
    }catch(err){ toast("That file couldn't be read."); }
    e.target.value="";
  };
  rd.readAsText(f);
};

/* ============================ sync ============================ */
function setSyncStatus(status, msg){
  SYNC.status=status; SYNC.msg=msg;
  if(V.tab==="more") draw();
  else $("#pgSub").textContent = V.tab==="more" ? msg : monthLabel(V.anchor);
}
async function toggleSync(){
  if(S.s.sync){
    S.s.sync=false;
    if(SYNC.mod) try{ await SYNC.mod.disconnect(); }catch(e){}
    setSyncStatus("off","Off");
    return commit();
  }
  if(!S.s.fb) return openSheet("firebase");
  S.s.sync=true; persist();
  await startSync(true);
  commit();
}
async function startSync(interactive){
  if(!S.s.fb || !S.s.sync) return;
  setSyncStatus("connecting","Connecting…");
  try{
    if(!SYNC.mod) SYNC.mod = await import("./sync.js");
    const res = await SYNC.mod.connect(S.s.fb, {
      interactive,
      onStatus:(st,msg)=>setSyncStatus(st,msg),
      onRemote:mergeRemote
    });
    if(res && res.uid){ S.s.uid=res.uid; persist(); }
    queueSync();
  }catch(err){
    console.error(err);
    setSyncStatus("error", (err&&err.message) ? String(err.message).slice(0,60) : "Couldn't connect");
  }
}
/** Last-write-wins on `up`; tombstones delete. Local stays authoritative for the UI. */
function mergeRemote(remoteTxs, remoteTomb){
  let changed=false;
  const byId = new Map(S.txs.map(t=>[t.id,t]));
  for(const r of remoteTxs||[]){
    if(!validTx(r)) continue;
    const mine = byId.get(r.id);
    if(!mine){ S.txs.push(r); byId.set(r.id,r); changed=true; }
    else if((r.up||0) > (mine.up||0)){ Object.assign(mine, r); changed=true; }
  }
  for(const d of remoteTomb||[]){
    const mine = byId.get(d.id);
    if(mine && (d.up||0) >= (mine.up||0)){
      S.txs = S.txs.filter(t=>t.id!==d.id);
      byId.delete(d.id);
      if(!S.tomb.some(x=>x.id===d.id)) S.tomb.push(d);
      changed=true;
    }
  }
  if(changed){ S.s.lastSync=Date.now(); persist(); draw(); }
}
let syncTimer;
function queueSync(){
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async ()=>{
    if(!S.s.sync || !SYNC.mod) return;
    try{
      await SYNC.mod.push(S.txs, S.tomb);
      S.s.lastSync=Date.now(); persist();
    }catch(err){ console.warn("sync push failed", err); }
  }, 900);
}

/* ============================ toast ============================ */
let toastTimer, toastFn=null;
function toast(msg, actionLabel, fn){
  const box=$("#toast"), act=$("#toastAct");
  $("#toastMsg").textContent=msg;
  toastFn=fn||null;
  act.textContent = fn?(actionLabel||"Undo"):"";
  act.style.display = fn?"block":"none";
  box.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>box.classList.remove("on"), fn?5200:2400);
}
$("#toastAct").onclick=()=>{ if(toastFn){ toastFn(); toastFn=null; } $("#toast").classList.remove("on"); };

/* ============================ boot ============================ */
$("#mark").innerHTML = ico("wallet");
$("#btnAdd").innerHTML = ico("plus");
$("#btnSettings").innerHTML = ico("cog");
$("#btnAdd").onclick = ()=>openSheet("add");
$("#btnSettings").onclick = ()=>go("more");
document.querySelectorAll("[data-close]").forEach(b=>{ b.innerHTML=ico("x"); b.onclick=closeSheet; });
ovl().addEventListener("click", e=>{ if(e.target===ovl()) closeSheet(); });
document.addEventListener("keydown", e=>{
  if(e.key==="Escape") closeSheet();
  if(e.key==="/" && document.activeElement===document.body){ const i=$("#qin"); if(i){ e.preventDefault(); i.focus(); } }
});
$("#nav").addEventListener("click", e=>{ const b=e.target.closest("[data-tab]"); if(b) go(b.dataset.tab); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ()=>{ if(S.s.theme==="auto") applyTheme(); });
window.addEventListener("beforeunload", ()=>{ clearTimeout(saveTimer); try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} });

draw();
if(S.s.sync && S.s.fb) startSync(false);
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
