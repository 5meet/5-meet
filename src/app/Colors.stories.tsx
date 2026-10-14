import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

// 컬러 칩 공통 컴포넌트
function ColorChip({ name, hex, className }: { name: string; hex: string; className: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-16 w-32 rounded-lg border border-gray-200 shadow-sm ${className}`} />
      <span className="text-sm font-semibold text-gray-800">{name}</span>
      <span className="text-xs text-gray-500">{hex}</span>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      {/* Primary */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Primary</h3>
        <div className="flex flex-wrap gap-4">
          <ColorChip name="100" hex="#EDFFF5" className="bg-primary-100" />
          <ColorChip name="200" hex="#DFFAEB" className="bg-primary-200" />
          <ColorChip name="300" hex="#C5F1D9" className="bg-primary-300" />
          <ColorChip name="400" hex="#AFEFD1" className="bg-primary-400" />
          <ColorChip name="500" hex="#00BB86" className="bg-primary-500" />
          <ColorChip name="600" hex="#009973" className="bg-primary-600" />
          <ColorChip name="700" hex="#0C7665" className="bg-primary-700" />
        </div>
      </section>

      {/* Gray Scale */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Gray Scale</h3>
        <div className="flex flex-wrap gap-4">
          <ColorChip name="50" hex="#F6F7F9" className="bg-gray-50" />
          <ColorChip name="100" hex="#EDEFF1" className="bg-gray-100" />
          <ColorChip name="200" hex="#DDDDDD" className="bg-gray-200" />
          <ColorChip name="300" hex="#CCCCCC" className="bg-gray-300" />
          <ColorChip name="400" hex="#BBBBBB" className="bg-gray-400" />
          <ColorChip name="500" hex="#A4A4A4" className="bg-gray-500" />
          <ColorChip name="600" hex="#737373" className="bg-gray-600" />
          <ColorChip name="700" hex="#4A4A4A" className="bg-gray-700" />
          <ColorChip name="800" hex="#333333" className="bg-gray-800" />
          <ColorChip name="900" hex="#191919" className="bg-gray-900" />
        </div>
      </section>

      {/* Blue */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Blue</h3>
        <div className="flex flex-wrap gap-4">
          <ColorChip name="100" hex="#D6F9FF" className="bg-blue-100" />
          <ColorChip name="500" hex="#2099FD" className="bg-blue-500" />
          <ColorChip name="600" hex="#337AFF" className="bg-blue-600" />
        </div>
      </section>

      {/* Gradients */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Mint Gradients</h3>
        <div className="flex flex-wrap gap-4">
          <ColorChip name="100" hex="#E9FBF1 → #E9FCFC" className="bg-mint-gradient-100" />
          <ColorChip name="200" hex="#DEF8EA → #D9F6F4" className="bg-mint-gradient-200" />
          <ColorChip name="500" hex="#17DA71 → #08DDF0" className="bg-mint-gradient-500" />
          <ColorChip name="600" hex="#00D361 → #00B9DE" className="bg-mint-gradient-600" />
        </div>
      </section>
    </div>
  ),
};