import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Settings, User } from 'lucide-react';
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from './menu';

const meta = {
  title: 'UI/Menu',
  component: MenuRoot,
} satisfies Meta;

export default meta;

export const Playground: StoryObj = {
  render: () => (
    <div className="flex items-center justify-center min-h-[250px]">
      <MenuRoot>
        <MenuTrigger size="md">Open Menu</MenuTrigger>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="view">View Profile</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
            <MenuSeparator />
            <MenuItem value="help">Help</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </div>
  ),
};

export const Overview: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Menu Gallery</h1>
        <p className="text-fg-muted">Dropdown menus for actions and navigation.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex gap-8 items-start">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">sm</span>
            <MenuRoot>
              <MenuTrigger size="sm">Small</MenuTrigger>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem value="a">Action A</MenuItem>
                  <MenuItem value="b">Action B</MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">md</span>
            <MenuRoot>
              <MenuTrigger size="md">Medium</MenuTrigger>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem value="a">Action A</MenuItem>
                  <MenuItem value="b">Action B</MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">lg</span>
            <MenuRoot>
              <MenuTrigger size="lg">Large</MenuTrigger>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem value="a">Action A</MenuItem>
                  <MenuItem value="b">Action B</MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          With Groups & Icons
        </h2>
        <MenuRoot>
          <MenuTrigger size="sm">
            <User className="size-4" />
            Profile
          </MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <MenuItemGroup id="account">
                <MenuItemGroupLabel>Account</MenuItemGroupLabel>
                <MenuItem value="profile">My Profile</MenuItem>
                <MenuItem value="settings">
                  <Settings className="size-4" />
                  Settings
                </MenuItem>
              </MenuItemGroup>
              <MenuSeparator />
              <MenuItemGroup id="other">
                <MenuItemGroupLabel>Other</MenuItemGroupLabel>
                <MenuItem value="help">Help Center</MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
              </MenuItemGroup>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </section>
    </div>
  ),
};
