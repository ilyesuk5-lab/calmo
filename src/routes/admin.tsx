import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, ShoppingBag, Settings as SettingsIcon, Tag,
  LogOut, Loader2, Search, Lock, FileText, Layers, Trash2, Plus, Home,
  Pencil, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { WILAYAS } from "@/lib/wilayas";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASSWORD = "calmo2024";
const AUTH_KEY = "calmo_admin_auth";

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  promo_code_used: string | null;
  discount_applied: number;
  status: string;
  notes: string | null;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const fmtDZD = (n: number) => `${n.toLocaleString("fr-DZ")} دج`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleString("ar-DZ", { dateStyle: "short", timeStyle: "short" });

/* ---------- password gate ---------- */
function PasswordGate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onOk();
    } else {
      setErr("كلمة المرور غير صحيحة");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink p-4">
      <form onSubmit={submit} className="bg-card rounded-3xl p-8 shadow-2xl w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-center">CALMO Admin</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">لوحة تحكم المدير</p>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }}
               placeholder="كلمة المرور"
               className="w-full mt-6 border rounded-md px-3 py-3 bg-background" />
        {err && <p className="text-xs text-destructive mt-2">{err}</p>}
        <button type="submit" className="btn-gold w-full mt-4 rounded-md py-3">دخول</button>
      </form>
    </div>
  );
}

/* ---------- main shell ---------- */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);
  if (!ready) return null;
  if (!authed) return <PasswordGate onOk={() => setAuthed(true)} />;
  return <AdminShell onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"overview" | "orders" | "settings" | "content" | "sections" | "promo">("overview");
  const items = [
    { key: "overview", label: "الرئيسية", icon: LayoutDashboard },
    { key: "orders", label: "الطلبات", icon: ShoppingBag },
    { key: "sections", label: "الأقسام", icon: Layers },
    { key: "content", label: "النصوص", icon: FileText },
    { key: "settings", label: "الإعدادات", icon: SettingsIcon },
    { key: "promo", label: "الخصم", icon: Tag },
  ] as const;
  const currentLabel = items.find((i) => i.key === tab)?.label ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex bg-ink text-cream w-60 shrink-0 flex-col">
        <div className="px-6 py-5 border-b border-cream/10">
          <div className="text-gold font-black text-xl">CALMO</div>
        </div>
        <nav className="flex-1 py-4">
          {items.map((it) => (
            <button key={it.key} onClick={() => setTab(it.key)}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition ${tab === it.key ? "bg-gold/20 text-gold border-r-4 border-gold" : "hover:bg-cream/5"}`}>
              <it.icon className="w-5 h-5 shrink-0" />
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
        <Link to="/" className="m-3 flex items-center justify-start gap-2 px-3 py-2 rounded-md bg-gold/10 hover:bg-gold/20 text-sm text-gold transition">
          <Home className="w-4 h-4" /><span>الموقع</span>
        </Link>
        <button onClick={onLogout}
                className="m-3 mt-0 flex items-center justify-start gap-2 px-3 py-2 rounded-md bg-cream/10 hover:bg-cream/20 text-sm">
          <LogOut className="w-4 h-4" /><span>خروج</span>
        </button>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-0">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur text-cream border-b border-cream/10 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="md:hidden text-gold font-black text-lg">V</span>
            <h1 className="font-black text-base md:text-lg truncate">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-cream/60">{new Date().toLocaleDateString("ar-DZ")}</span>
          <Link to="/" className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 hover:bg-gold/20 text-xs text-gold transition">
            <Home className="w-3.5 h-3.5" />الموقع
          </Link>
          <button onClick={onLogout}
                  className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream/10 hover:bg-cream/20 text-xs">
            <LogOut className="w-3.5 h-3.5" />خروج
          </button>
          </div>
        </header>

        <div className="p-3 sm:p-5 md:p-6">
          {tab === "overview" && <Overview />}
          {tab === "orders" && <OrdersTab />}
          {tab === "settings" && <SettingsTab />}
          {tab === "content" && <ContentTab />}
          {tab === "sections" && <SectionsTab />}
          {tab === "promo" && <PromoTab />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink/95 backdrop-blur border-t border-cream/10 grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const active = tab === it.key;
          return (
            <button key={it.key} onClick={() => setTab(it.key)}
                    className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition ${active ? "text-gold" : "text-cream/60 hover:text-cream"}`}>
              <it.icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
              <span className="leading-none">{it.label}</span>
              {active && <span className="absolute top-0 w-8 h-0.5 bg-gold rounded-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ---------- overview ---------- */
function Overview() {
  const { settings } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("orders").select("*").neq("status", "deleted").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data ?? []) as Order[]);
      setLoading(false);
    });
  }, []);
  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  const today = new Date().toDateString();
  const todayCount = orders.filter((o) => new Date(o.created_at).toDateString() === today).length;
  const sales = orders
    .filter((o) => ["confirmed", "delivered", "shipped"].includes(o.status))
    .reduce((s, o) => s + o.total_price, 0);
  const byStatus = STATUSES.map((s) => ({ s, n: orders.filter((o) => o.status === s).length }));
  const maxN = Math.max(1, ...byStatus.map((x) => x.n));

  const cards = [
    { label: "إجمالي الطلبات", value: orders.length },
    { label: "طلبات اليوم", value: todayCount },
    { label: "إجمالي المبيعات", value: fmtDZD(sales) },
    { label: "نقرات واتساب", value: settings?.whatsapp_clicks ?? 0 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-2xl p-4 md:p-5">
            <div className="text-[11px] md:text-xs text-muted-foreground">{c.label}</div>
            <div className="text-xl md:text-2xl font-black text-gold mt-1.5 md:mt-2 break-words">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl p-4 md:p-5">
        <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">الطلبات حسب الحالة</h3>
        <div className="space-y-2">
          {byStatus.map((x) => (
            <div key={x.s} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <span className="w-20 md:w-24 shrink-0">{STATUS_AR[x.s]}</span>
              <div className="flex-1 bg-muted rounded-full h-2.5 md:h-3 overflow-hidden">
                <div className="bg-gold h-full transition-all" style={{ width: `${(x.n / maxN) * 100}%` }} />
              </div>
              <span className="w-6 md:w-8 text-left font-bold">{x.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-4 md:p-5">
        <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">آخر 5 طلبات</h3>
        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="border rounded-xl p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold truncate">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.wilaya} • {o.quantity}×</div>
                </div>
                <div className="text-gold font-black whitespace-nowrap">{fmtDZD(o.total_price)}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status]}`}>{STATUS_AR[o.status]}</span>
                <span className="text-[10px] text-muted-foreground">{fmtDate(o.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground text-right">
              <tr><th className="p-2">الاسم</th><th className="p-2">الولاية</th><th className="p-2">الكمية</th><th className="p-2">الإجمالي</th><th className="p-2">الحالة</th><th className="p-2">التاريخ</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.customer_name}</td>
                  <td className="p-2">{o.wilaya}</td>
                  <td className="p-2">{o.quantity}</td>
                  <td className="p-2 font-bold text-gold">{fmtDZD(o.total_price)}</td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>{STATUS_AR[o.status]}</span></td>
                  <td className="p-2 text-xs text-muted-foreground">{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- orders ---------- */
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<string>("");

  // Edit order modal state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWilaya, setEditWilaya] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editTotalPrice, setEditTotalPrice] = useState(0);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "deleted")
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusF && o.status !== statusF) return false;
      if (!qq) return true;
      return (
        o.customer_name.toLowerCase().includes(qq) ||
        o.customer_phone.includes(qq) ||
        o.wilaya.toLowerCase().includes(qq)
      );
    });
  }, [orders, q, statusF]);

  const updateStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("فشل التحديث"); load(); }
    else toast.success("تم تحديث الحالة ✓");
  };

  const openEdit = (o: Order) => {
    setEditingOrder(o);
    setEditName(o.customer_name);
    setEditPhone(o.customer_phone);
    setEditWilaya(o.wilaya);
    setEditQuantity(o.quantity);
    setEditTotalPrice(o.total_price);
  };

  const closeEdit = () => {
    setEditingOrder(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (!editName.trim()) {
      toast.error("يرجى إدخال اسم العميل");
      return;
    }
    if (!editPhone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setSavingEdit(true);
    const updates = {
      customer_name: editName.trim(),
      customer_phone: editPhone.trim(),
      wilaya: editWilaya,
      quantity: editQuantity,
      total_price: editTotalPrice,
    };

    const { error } = await supabase.from("orders").update(updates).eq("id", editingOrder.id);
    setSavingEdit(false);

    if (error) {
      toast.error("فشل حفظ التعديلات: " + error.message);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? { ...o, ...updates } : o))
      );
      toast.success("تم تحديث بيانات الطلب بنجاح ✓");
      setEditingOrder(null);
    }
  };

  const deleteOrder = async (o: Order) => {
    const confirmMsg = `هل أنت متأكد من حذف طلب "${o.customer_name}" نهائياً؟\nالولاية: ${o.wilaya}\nالمبلغ: ${fmtDZD(o.total_price)}`;
    if (!window.confirm(confirmMsg)) return;

    // Optimistic removal from UI
    setOrders((prev) => prev.filter((item) => item.id !== o.id));

    // 1. Attempt physical delete (works if delete RLS policy is enabled)
    await supabase.from("orders").delete().eq("id", o.id);

    // 2. Mark status as 'deleted' in Supabase (guaranteed to succeed via update policy)
    const { error } = await supabase.from("orders").update({ status: "deleted" }).eq("id", o.id);
    if (error) {
      toast.error("فشل حذف الطلب: " + error.message);
      load();
    } else {
      toast.success("تم حذف الطلب بنجاح ✓");
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="bg-card border rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row gap-2 md:gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث: الاسم، الهاتف، الولاية"
                 className="w-full border rounded-md pr-10 pl-3 py-2.5 bg-background text-sm" />
        </div>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
                className="border rounded-md px-3 py-2.5 bg-background text-sm sm:w-auto">
          <option value="">كل الحالات</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="bg-card border rounded-2xl p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted-foreground text-sm">لا توجد طلبات</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((o) => (
              <div key={o.id} className="bg-card border rounded-2xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{o.customer_name}</div>
                    <a href={`tel:${o.customer_phone}`} className="text-xs text-muted-foreground" dir="ltr">{o.customer_phone}</a>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{o.wilaya} • {o.quantity}× {o.promo_code_used ? `• ${o.promo_code_used}` : ""}</div>
                  </div>
                  <div className="text-gold font-black text-sm whitespace-nowrap">{fmtDZD(o.total_price)}</div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                          className={`text-[11px] px-2 py-1 rounded-full border-0 font-medium ${STATUS_COLOR[o.status]}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
                  </select>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(o)}
                      className="p-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/15 transition cursor-pointer"
                      title="تعديل بيانات الطلب"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteOrder(o)}
                      className="p-1.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/15 transition cursor-pointer"
                      title="حذف الطلب نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{fmtDate(o.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden md:block bg-card border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs text-right">
                  <tr>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3">الولاية</th>
                    <th className="p-3">الكمية</th>
                    <th className="p-3">الإجمالي</th>
                    <th className="p-3">كود الخصم</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-muted/40">
                      <td className="p-3 font-medium">{o.customer_name}</td>
                      <td className="p-3 text-muted-foreground" dir="ltr">{o.customer_phone}</td>
                      <td className="p-3">{o.wilaya}</td>
                      <td className="p-3">{o.quantity}</td>
                      <td className="p-3 font-bold text-gold">{fmtDZD(o.total_price)}</td>
                      <td className="p-3 text-xs">{o.promo_code_used || "—"}</td>
                      <td className="p-3">
                        <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border-0 ${STATUS_COLOR[o.status]}`}>
                          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
                        </select>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{fmtDate(o.created_at)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEdit(o)}
                            className="p-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/15 transition cursor-pointer"
                            title="تعديل بيانات الطلب"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOrder(o)}
                            className="p-1.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/15 transition cursor-pointer"
                            title="حذف الطلب نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-gold/30 rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-gold">
                <Pencil className="w-5 h-5" />
                <h3 className="font-black text-lg">تعديل بيانات الطلب</h3>
              </div>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold block mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full border rounded-xl px-3 py-2.5 bg-background text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="05 / 06 / 07 ..."
                  className="w-full border rounded-xl px-3 py-2.5 bg-background text-sm text-right focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">الولاية</label>
                  <select
                    value={editWilaya}
                    onChange={(e) => setEditWilaya(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2.5 bg-background text-sm focus:outline-none focus:border-gold"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">الكمية</label>
                  <input
                    type="number"
                    min={1}
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Math.max(1, +e.target.value))}
                    className="w-full border rounded-xl px-3 py-2.5 bg-background text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">المبلغ الإجمالي (دج)</label>
                <input
                  type="number"
                  min={0}
                  value={editTotalPrice}
                  onChange={(e) => setEditTotalPrice(+e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 bg-background text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn-gold flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingEdit && <Loader2 className="w-4 h-4 animate-spin" />}
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2.5 rounded-xl border hover:bg-muted font-medium transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- settings ---------- */
function SettingsTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [price, setPrice] = useState(settings?.price ?? 2500);
  const [price30, setPrice30] = useState(settings?.price_30 ?? 1500);
  const [phone, setPhone] = useState(settings?.phone ?? "");
  const [fb, setFb] = useState(settings?.facebook_url ?? "");
  const [ig, setIg] = useState(settings?.instagram_url ?? "");
  useEffect(() => {
    if (!settings) return;
    setPrice(settings.price); setPrice30(settings.price_30); setPhone(settings.phone);
    setFb(settings.facebook_url); setIg(settings.instagram_url);
  }, [settings]);

  const save = async (patch: Partial<NonNullable<typeof settings>>, label: string) => {
    updateLocal(patch);
    const { error } = await supabase.from("settings").update(patch).eq("id", 1);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success(`${label} — تم الحفظ بنجاح ✓`);
  };

  if (!settings) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">سعر العلبة الفردية (20 كيس شاي)</h3>
        <p className="text-xs text-muted-foreground mb-3">السعر بالدينار الجزائري (افتراضي: 2500 دج)</p>
        <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ price }, "سعر العلبة")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">سعر العلبة في عرض الجملة (3 علب فأكثر)</h3>
        <p className="text-xs text-muted-foreground mb-3">السعر بالدينار الجزائري (افتراضي: 2200 دج)</p>
        <input type="number" value={price30} onChange={(e) => setPrice30(+e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ price_30: price30 }, "سعر الجملة")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-3">رقم الهاتف</h3>
        <input value={phone} onChange={(e) => setPhone(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ phone }, "رقم الهاتف")} className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-3">روابط التواصل</h3>
        <label className="text-sm">Facebook URL</label>
        <input value={fb} onChange={(e) => setFb(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background mb-3" />
        <label className="text-sm">Instagram URL</label>
        <input value={ig} onChange={(e) => setIg(e.target.value)}
               className="w-full border rounded-md px-3 py-2 bg-background" />
        <button onClick={() => save({ facebook_url: fb, instagram_url: ig }, "روابط التواصل")}
                className="btn-gold mt-3 rounded-md px-5 py-2">حفظ</button>
      </div>
    </div>
  );
}

/* ---------- content (editable site texts) ---------- */
const CONTENT_FIELDS: { key: keyof import("@/lib/store-context").SiteContent; label: string; long?: boolean }[] = [
  { key: "hero_badge", label: "شارة الهيرو (أعلى العنوان)" },
  { key: "hero_title", label: "العنوان الرئيسي" },
  { key: "hero_subtitle", label: "العنوان الفرعي" },
  { key: "hero_tagline", label: "الشعار القصير" },
  { key: "hero_description", label: "الوصف في الهيرو", long: true },
  { key: "hero_cta", label: "نص زر الطلب الرئيسي" },
  { key: "product_name", label: "اسم المنتج" },
  { key: "product_short_desc", label: "وصف المنتج القصير" },
  { key: "order_title", label: "عنوان قسم الطلب" },
  { key: "order_subtitle", label: "نص أسفل عنوان الطلب" },
  { key: "footer_tagline", label: "شعار الفوتر" },
  { key: "footer_copyright", label: "نص حقوق النشر" },
];

function ContentTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [draft, setDraft] = useState(settings?.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.content) setDraft(settings.content);
  }, [settings]);

  if (!settings || !draft) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  const setField = (k: keyof typeof draft, v: string) =>
    setDraft({ ...draft, [k]: v });

  const saveAll = async () => {
    setSaving(true);
    updateLocal({ content: draft });
    const { error } = await supabase.from("settings").update({ content: draft }).eq("id", 1);
    setSaving(false);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success("تم حفظ النصوص بنجاح ✓");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">تعديل نصوص الموقع</h3>
        <p className="text-xs text-muted-foreground">قم بتحرير النصوص الظاهرة للزوار. التغييرات تظهر مباشرة بعد الحفظ.</p>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-4">
        {CONTENT_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-semibold">{f.label}</label>
            {f.long ? (
              <textarea
                value={(draft[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                rows={3}
                className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm resize-none"
              />
            ) : (
              <input
                value={(draft[f.key] as string) ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={saveAll} disabled={saving}
                className="btn-gold rounded-md px-6 py-3 font-bold disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          حفظ كل التغييرات
        </button>
        <button onClick={() => setDraft(settings.content)}
                className="rounded-md px-6 py-3 border font-bold hover:bg-muted">
          استعادة
        </button>
      </div>
    </div>
  );
}

/* ---------- promo ---------- */
function PromoTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [code, setCode] = useState(settings?.promo_code ?? "");
  const [disc, setDisc] = useState(settings?.promo_discount ?? 10);
  const [active, setActive] = useState(settings?.promo_active ?? true);
  const [usage, setUsage] = useState<number>(0);

  useEffect(() => {
    if (!settings) return;
    setCode(settings.promo_code); setDisc(settings.promo_discount); setActive(settings.promo_active);
  }, [settings]);

  useEffect(() => {
    supabase.from("orders").select("id", { count: "exact", head: true })
      .not("promo_code_used", "is", null)
      .then(({ count }) => setUsage(count ?? 0));
  }, []);

  const save = async () => {
    const patch = { promo_code: code, promo_discount: disc, promo_active: active };
    updateLocal(patch);
    const { error } = await supabase.from("settings").update(patch).eq("id", 1);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success("تم الحفظ بنجاح ✓");
  };

  if (!settings) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  return (
    <div className="max-w-xl space-y-5">
      <div className="bg-card border rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold">حالة كود الخصم</h3>
          <p className="text-xs text-muted-foreground mt-1">{active ? "مفعّل" : "معطّل"}</p>
        </div>
        <button onClick={() => setActive((v) => !v)}
                className={`w-14 h-8 rounded-full transition relative ${active ? "bg-gold" : "bg-muted"}`}>
          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${active ? "right-1" : "right-7"}`} />
        </button>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold">كود الخصم</label>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                 className="w-full mt-1 border rounded-md px-3 py-2 bg-background uppercase" />
        </div>
        <div>
          <label className="text-sm font-semibold">نسبة الخصم (%)</label>
          <input type="number" min={1} max={100} value={disc}
                 onChange={(e) => setDisc(Math.max(1, Math.min(100, +e.target.value)))}
                 className="w-full mt-1 border rounded-md px-3 py-2 bg-background" />
        </div>
        <div className="bg-gold/10 border border-gold/40 rounded-md p-3 text-sm">
          الكود الحالي: <b className="text-gold">{code || "—"}</b> — خصم <b>{disc}%</b>
        </div>
        <button onClick={save} className="btn-gold rounded-md px-6 py-2">حفظ التغييرات</button>
      </div>

      <div className="bg-card border rounded-2xl p-5">
        <div className="text-xs text-muted-foreground">عدد مرات استخدام الكود</div>
        <div className="text-3xl font-black text-gold mt-1">{usage}</div>
      </div>
    </div>
  );
}

/* ---------- sections (editable arrays) ---------- */
type SC = import("@/lib/store-context").SiteContent;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-2xl p-5 space-y-3">
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </div>
  );
}

function StringListEditor({
  label, items, onChange, placeholder,
}: { label?: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold">{label}</label>}
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 border rounded-md px-3 py-2 bg-background text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="px-3 rounded-md border hover:bg-destructive hover:text-white transition"
            aria-label="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 text-sm text-gold hover:underline"
      >
        <Plus className="w-4 h-4" /> إضافة
      </button>
    </div>
  );
}

function ObjectListEditor<T extends Record<string, string>>({
  items, fields, onChange, blank,
}: {
  items: T[];
  fields: { key: keyof T; label: string; long?: boolean }[];
  onChange: (v: T[]) => void;
  blank: T;
}) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="border rounded-xl p-3 bg-background space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-destructive hover:bg-destructive/10 rounded-md p-1"
              aria-label="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {fields.map((f) => (
            <div key={String(f.key)}>
              <label className="text-xs font-semibold">{f.label}</label>
              {f.long ? (
                <textarea
                  value={it[f.key] ?? ""}
                  rows={2}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...it, [f.key]: e.target.value };
                    onChange(next);
                  }}
                  className="w-full mt-1 border rounded-md px-2 py-1.5 bg-card text-sm resize-none"
                />
              ) : (
                <input
                  value={it[f.key] ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...it, [f.key]: e.target.value };
                    onChange(next);
                  }}
                  className="w-full mt-1 border rounded-md px-2 py-1.5 bg-card text-sm"
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...blank }])}
        className="flex items-center gap-1.5 text-sm text-gold hover:underline"
      >
        <Plus className="w-4 h-4" /> إضافة عنصر
      </button>
    </div>
  );
}

function SectionsTab() {
  const { settings, updateLocal, refresh } = useStore();
  const [draft, setDraft] = useState<SC | undefined>(settings?.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.content) setDraft(settings.content);
  }, [settings]);

  if (!settings || !draft) return <Loader2 className="w-6 h-6 animate-spin text-gold" />;

  const set = <K extends keyof SC>(k: K, v: SC[K]) => setDraft({ ...draft, [k]: v });

  const saveAll = async () => {
    setSaving(true);
    updateLocal({ content: draft });
    const { error } = await supabase.from("settings").update({ content: draft }).eq("id", 1);
    setSaving(false);
    if (error) { toast.error("فشل الحفظ"); refresh(); }
    else toast.success("تم حفظ الأقسام بنجاح ✓");
  };

  const benefits = draft.benefits ?? [];
  const ingredients = draft.ingredients ?? [];
  const steps = draft.steps ?? [];
  const before = draft.before_list ?? [];
  const after = draft.after_list ?? [];
  const reviews = draft.reviews ?? [];
  const badges = draft.hero_badges ?? [];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-bold mb-1">تعديل أقسام الموقع</h3>
        <p className="text-xs text-muted-foreground">يمكنك إضافة وحذف وتعديل عناصر كل قسم. الأيقونات تُختار تلقائياً.</p>
      </div>

      <SectionCard title="شارات الهيرو (تحت العنوان)">
        <StringListEditor items={badges} onChange={(v) => set("hero_badges", v)} placeholder="مثال: نباتي 100%" />
      </SectionCard>

      <SectionCard title="المميزات (لماذا CALMO؟)">
        <div>
          <label className="text-sm font-semibold">عنوان القسم</label>
          <input
            value={draft.benefits_title ?? ""}
            onChange={(e) => set("benefits_title", e.target.value)}
            placeholder="لماذا CALMO؟"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <ObjectListEditor
          items={benefits}
          fields={[
            { key: "title", label: "العنوان" },
            { key: "desc", label: "الوصف", long: true },
          ]}
          onChange={(v) => set("benefits", v)}
          blank={{ title: "", desc: "" }}
        />
      </SectionCard>

      <SectionCard title="المكونات">
        <div>
          <label className="text-sm font-semibold">عنوان القسم</label>
          <input
            value={draft.ingredients_title ?? ""}
            onChange={(e) => set("ingredients_title", e.target.value)}
            placeholder="مكونات نباتية مختارة بعناية"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <ObjectListEditor
          items={ingredients}
          fields={[
            { key: "name", label: "الاسم" },
            { key: "desc", label: "الوصف", long: true },
          ]}
          onChange={(v) => set("ingredients", v)}
          blank={{ name: "", desc: "" }}
        />
      </SectionCard>

      <SectionCard title="طريقة الاستخدام">
        <div>
          <label className="text-sm font-semibold">عنوان القسم</label>
          <input
            value={draft.steps_title ?? ""}
            onChange={(e) => set("steps_title", e.target.value)}
            placeholder="3 خطوات بسيطة"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <StringListEditor items={steps} onChange={(v) => set("steps", v)} placeholder="مثال: افتح العلبة" />
      </SectionCard>

      <SectionCard title="قبل و بعد">
        <div>
          <label className="text-sm font-semibold">عنوان "قبل"</label>
          <input
            value={draft.before_title ?? ""}
            onChange={(e) => set("before_title", e.target.value)}
            placeholder="قبل الاستخدام"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <StringListEditor label="قائمة (قبل)" items={before} onChange={(v) => set("before_list", v)} />
        <div>
          <label className="text-sm font-semibold">عنوان "بعد"</label>
          <input
            value={draft.after_title ?? ""}
            onChange={(e) => set("after_title", e.target.value)}
            placeholder="بعد 30 يوم"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <StringListEditor label="قائمة (بعد)" items={after} onChange={(v) => set("after_list", v)} />
      </SectionCard>

      <SectionCard title="آراء العملاء">
        <div>
          <label className="text-sm font-semibold">عنوان القسم</label>
          <input
            value={draft.reviews_title ?? ""}
            onChange={(e) => set("reviews_title", e.target.value)}
            placeholder="ماذا يقولون عن CALMO"
            className="w-full mt-1.5 border rounded-md px-3 py-2 bg-background text-sm"
          />
        </div>
        <ObjectListEditor
          items={reviews}
          fields={[
            { key: "name", label: "الاسم" },
            { key: "city", label: "المدينة" },
            { key: "text", label: "الرأي", long: true },
          ]}
          onChange={(v) => set("reviews", v)}
          blank={{ name: "", city: "", text: "" }}
        />
      </SectionCard>

      <div className="sticky bottom-20 md:bottom-4 bg-card border rounded-2xl p-3 flex gap-2 shadow-lg z-20">
        <button onClick={saveAll} disabled={saving}
                className="btn-gold rounded-md px-6 py-3 font-bold disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          حفظ كل التغييرات
        </button>
        <button onClick={() => setDraft(settings.content)}
                className="rounded-md px-6 py-3 border font-bold hover:bg-muted">
          استعادة
        </button>
      </div>
    </div>
  );
}
