import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Button } from './button';
import { TooltipContent, TooltipPositioner, TooltipRoot, TooltipTrigger } from './tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: TooltipRoot,
} satisfies Meta;

export default meta;

export const Playground: StoryObj = {
  render: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <TooltipRoot openDelay={0}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Hover me
          </Button>
        </TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent>Hello, I am a tooltip!</TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </div>
  ),
};

export const Overview: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Tooltip Gallery</h1>
        <p className="text-fg-muted">Tooltip display on hover/focus.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Basic Tooltip</h2>
        <div className="flex gap-4 items-center">
          <TooltipRoot openDelay={0}>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm">
                Hover
              </Button>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>Default tooltip</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>

          <TooltipRoot openDelay={0}>
            <TooltipTrigger asChild>
              <Button variant="accent" size="sm">
                Info
              </Button>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>Accent button tooltip</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>

          <TooltipRoot openDelay={0}>
            <TooltipTrigger asChild>
              <Button variant="error" size="sm">
                Danger
              </Button>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>This will delete something</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">With Icons</h2>
        <div className="flex gap-4 items-center">
          <TooltipRoot openDelay={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Help"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>Help</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>

          <TooltipRoot openDelay={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Security"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipPositioner>
              <TooltipContent>Security settings</TooltipContent>
            </TooltipPositioner>
          </TooltipRoot>
        </div>
      </section>
    </div>
  ),
};
