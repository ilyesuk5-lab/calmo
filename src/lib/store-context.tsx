import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  hero_description: string;
  hero_cta: string;
  product_name: string;
  product_short_desc: string;
  order_title: string;
  order_subtitle: string;
  footer_tagline: string;
  footer_copyright: string;
  // Editable sections
  hero_badges?: string[];
  benefits_title?: string;
  benefits?: { title: string; desc: string }[];
  ingredients_title?: string;
  ingredients?: { name: string; desc: string }[];
  steps_title?: string;
  steps?: string[];
  before_title?: string;
  after_title?: string;
  before_list?: string[];
  after_list?: string[];
  reviews_title?: string;
  reviews?: { name: string; city: string; text: string }[];
};

export type Settings = {
  id: number;
  price: number;
  price_30: number;
  phone: string;
  facebook_url: string;
  instagram_url: string;
  whatsapp_clicks: number;
  promo_code: string;
  promo_discount: number;
  promo_active: boolean;
  content: SiteContent;
};

type Ctx = {
  settings: Settings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (patch: Partial<Settings>) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
    if (data) setSettings(data as Settings);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        (payload) => {
          if (payload.new) setSettings(payload.new as Settings);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        loading,
        refresh,
        updateLocal: (patch) =>
          setSettings((s) => (s ? { ...s, ...patch } : s)),
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
