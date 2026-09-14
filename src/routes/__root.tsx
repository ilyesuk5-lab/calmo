import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { StoreProvider } from "@/lib/store-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">الصفحة غير موجودة</h2>
        <Link to="/" className="mt-6 inline-block btn-gold rounded-md px-5 py-2">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">حدث خطأ ما</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 btn-gold rounded-md px-5 py-2"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CALMO — Thé aux herbes | شاي الأعشاب الفاخر للاسترخاء وراحة القولون" },
      { name: "description", content: "CALMO شاي أعشاب جزائري فاخر وطبيعي 100%، خالٍ من الكافيين، مهدئ للأعصاب ومريح للقولون والهضم. متوفر للتوصيل لجميع الـ 58 ولاية." },
      { property: "og:title", content: "CALMO — Thé aux herbes | شاي الأعشاب الفاخر للاسترخاء وراحة القولون" },
      { property: "og:description", content: "CALMO شاي أعشاب جزائري فاخر وطبيعي 100%، خالٍ من الكافيين، مهدئ للأعصاب ومريح للقولون والهضم. متوفر للتوصيل لجميع الـ 58 ولاية." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "CALMO — Thé aux herbes | شاي الأعشاب الفاخر للاسترخاء وراحة القولون" },
      { name: "twitter:description", content: "CALMO شاي أعشاب جزائري فاخر وطبيعي 100%، خالٍ من الكافيين، مهدئ للأعصاب ومريح للقولون والهضم. متوفر للتوصيل لجميع الـ 58 ولاية." },
      { property: "og:image", content: "/calmo-desert-hero.jpg" },
      { name: "twitter:image", content: "/calmo-desert-hero.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Outlet />
        <Toaster position="bottom-left" richColors duration={3000} />
      </StoreProvider>
    </QueryClientProvider>
  );
}
