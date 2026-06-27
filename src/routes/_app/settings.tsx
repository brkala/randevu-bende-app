import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <p className="text-slate-500">Ayarlar sayfası yapım aşamasındadır.</p>
    </main>
  );
}
