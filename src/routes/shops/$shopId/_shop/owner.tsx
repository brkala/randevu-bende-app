import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/shops/$shopId/_shop/owner')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏪 Sahip Paneli</h1>
      <p className="text-slate-600">
        Dükkan yönetimi, çalışanlar, hizmetler ve raporlar burada olacak.
      </p>
    </main>
  );
}
