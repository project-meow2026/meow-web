'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductAccordionProps {
  description: string;
  specifications?: Record<string, string>;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  description,
  specifications,
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'care'>('desc');

  const defaultSpecs = {
    'Sole Material': 'Ultra-lightweight shock-absorbing EVA',
    'Insole': 'Anatomical contoured cork footbed with deep heel cup',
    'Upper': 'Breathable water-resistant Vegan Nubuck',
    'Closure': 'Adjustable matte antique metal pin buckles',
    'Fit': 'True to size (Choose one size up if between sizes)',
    'Origin': 'Handcrafted in Kerala, India',
  };

  const specs = specifications && Object.keys(specifications).length > 0 ? specifications : defaultSpecs;

  const tabs = [
    { id: 'desc', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'care', label: 'Care Instructions' },
  ];

  return (
    <div className="pt-6 border-t border-meow-border space-y-4">
      {/* Tab Switcher Headers */}
      <div className="flex items-center gap-6 border-b border-meow-border overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-meow-dark text-meow-dark'
                  : 'text-meow-subtle hover:text-meow-dark'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="text-xs text-meow-muted leading-relaxed min-h-[100px] pt-2">
        {activeTab === 'desc' && (
          <div className="space-y-3">
            <p>{description}</p>
            <p>
              Engineered with MEOW anatomical support, each pair adapts to the shape of your stride over time, reducing foot fatigue and supporting optimal spine posture.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="divide-y divide-meow-border border border-meow-border rounded-lg overflow-hidden">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between p-3 text-xs">
                <span className="font-semibold text-meow-dark uppercase tracking-wider">{key}</span>
                <span className="text-meow-muted text-right">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-2.5">
            <p>
              • <strong>Free Express Shipping:</strong> Complimentarily delivered across India within 3–5 business days.
            </p>
            <p>
              • <strong>7-Day Easy Exchange:</strong> In case of sizing or fit concerns, we offer a hassle-free exchange concierge via WhatsApp.
            </p>
            <p>
              • <strong>Packaging:</strong> Shipped in 100% recyclable, plastic-free MEOW luxury shoe boxes.
            </p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-2.5">
            <p>
              • Wipe clean with a soft, damp microfiber cloth after exposure to dirt or dust.
            </p>
            <p>
              • Allow cork footbeds to air dry naturally in a cool, shaded environment. Avoid prolonged direct midday sun or heaters.
            </p>
            <p>
              • Treat upper straps periodically with non-silicone suede or nubuck protector.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
