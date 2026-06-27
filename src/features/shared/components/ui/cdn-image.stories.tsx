import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { CdnImage } from './cdn-image';

const meta = {
  title: 'UI/CdnImage',
  component: CdnImage,
  args: {
    fileKey: 'test/sample.jpg',
    alt: 'Sample image',
    width: 200,
    height: 200,
  },
  argTypes: {
    format: {
      options: ['auto', 'webp', 'avif'],
      control: { type: 'select' },
    },
    quality: {
      control: { type: 'number', min: 1, max: 100 },
    },
  },
} satisfies Meta<typeof CdnImage>;

export default meta;

type Story = StoryObj<typeof CdnImage>;

export const Playground: Story = {};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">CdnImage Gallery</h1>
        <p className="text-fg-muted">
          Cloudflare R2 image with automatic resizing and format optimization. Requires{' '}
          <code className="text-xs bg-bg-subtle px-1 py-0.5 rounded">VITE_R2_PUBLIC_DOMAIN</code>{' '}
          and <code className="text-xs bg-bg-subtle px-1 py-0.5 rounded">VITE_R2_RESIZING</code> env
          vars.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Fixed Size</h2>
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">100×100</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage fileKey="test/photo.jpg" width={100} height={100} alt="Small" />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">200×200</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage fileKey="test/photo.jpg" width={200} height={200} alt="Medium" />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">300×300</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage fileKey="test/photo.jpg" width={300} height={300} alt="Large" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          With Responsive Widths
        </h2>
        <div className="border border-border-default rounded-l2 overflow-hidden max-w-md">
          <CdnImage
            fileKey="test/hero.jpg"
            width={800}
            height={400}
            responsiveWidths={[400, 800, 1200]}
            alt="Responsive"
            className="w-full"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          Format Options
        </h2>
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">Auto</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage
                fileKey="test/photo.jpg"
                width={150}
                height={150}
                format="auto"
                alt="Auto"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">WebP</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage
                fileKey="test/photo.jpg"
                width={150}
                height={150}
                format="webp"
                alt="WebP"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">AVIF</span>
            <div className="border border-border-default rounded-l2 overflow-hidden">
              <CdnImage
                fileKey="test/photo.jpg"
                width={150}
                height={150}
                format="avif"
                alt="AVIF"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
