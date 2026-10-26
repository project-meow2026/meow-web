'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeChart = [
    { uk: '4', eu: '37', us: '6', footLengthCm: '23.0 cm' },
    { uk: '5', eu: '38', us: '7', footLengthCm: '23.8 cm' },
    { uk: '6', eu: '39', us: '8', footLengthCm: '24.5 cm' },
    { uk: '7', eu: '40', us: '9', footLengthCm: '25.3 cm' },
    { uk: '8', eu: '41', us: '10', footLengthCm: '26.0 cm' },
    { uk: '9', eu: '42', us: '11', footLengthCm: '26.8 cm' },
    { uk: '10', eu: '43', us: '12', footLengthCm: '27.5 cm' },
    { uk: '11', eu: '44', us: '13', footLengthCm: '28.3 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-meow-border">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-meow-dark" />
            <h3 className="font-editorial text-2xl font-medium text-meow-dark">
              MEOW Footwear Size Guide
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-meow-muted hover:text-meow-dark">
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <p className="text-xs text-meow-muted leading-relaxed">
          MEOW footbeds are contoured to natural foot anatomy. If you are between sizes, we recommend selecting one size up for optimum arch and heel-cup placement.
        </p>

        {/* Size Chart Table */}
        <div className="overflow-x-auto border border-meow-border rounded-lg">
          <table className="w-full text-xs text-left divide-y divide-meow-border">
            <thead className="bg-[#FAF9F6] text-meow-dark uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">UK / IND</th>
                <th className="px-4 py-3">EU</th>
                <th className="px-4 py-3">US (Women)</th>
                <th className="px-4 py-3">Foot Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meow-border">
              {sizeChart.map((row) => (
                <tr key={row.uk} className="hover:bg-meow-surface">
                  <td className="px-4 py-2.5 font-bold text-meow-dark">{row.uk}</td>
                  <td className="px-4 py-2.5 text-meow-muted">{row.eu}</td>
                  <td className="px-4 py-2.5 text-meow-muted">{row.us}</td>
                  <td className="px-4 py-2.5 font-mono text-meow-dark">{row.footLengthCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-[11px] text-meow-subtle border-t border-meow-border flex items-center justify-between">
          <span>Need custom sizing assistance?</span>
          <a
            href="https://wa.me/919876543210?text=Hi%20MEOW%20team,%20I%20need%20help%20choosing%20my%20size"
            target="_blank"
            rel="noopener noreferrer"
            className="text-meow-dark font-semibold underline"
          >
            Ask Concierge on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
