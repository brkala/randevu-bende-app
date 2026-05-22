import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';

const getCount = createServerFn({
  method: 'GET',
}).handler(async () => {
  const count = getCookie('count');
  return parseInt(count ?? '0', 10);
});

const updateCount = createServerFn({
  method: 'POST',
})
  .inputValidator((d: number) => d)
  .handler(async ({ data }) => {
    const count = parseInt(getCookie('count') ?? '0', 10);
    setCookie('count', (count + data).toString(), { path: '/' });
  });

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Randevu Bende</h1>
      <p>TanStack Start Build from Scratch</p>
      <button
        type="button"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1 to {state}?
      </button>

      <div style={{ marginTop: '20px' }}>
        <Link
          to="/todos"
          style={{
            color: 'blue',
            textDecoration: 'underline',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          Go to Todo CRUD Feature (E2E Test Demo)
        </Link>

        <Link
          to="/profile"
          style={{
            color: 'green',
            textDecoration: 'underline',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          Giriş Yap / Profilim (Korumalı Alan)
        </Link>
      </div>
    </div>
  );
}
