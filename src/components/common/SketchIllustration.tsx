import React from 'react';

interface SketchIllustrationProps {
  type: 'eva-women' | 'cork-women' | 'dd-women' | 'eva-kids' | 'cork-kids' | 'magic-kids';
  className?: string;
  size?: number;
}

export const SketchIllustration: React.FC<SketchIllustrationProps> = ({
  type,
  className = '',
  size = 180,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-500 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Graphite pencil paper texture filter */}
        <filter id="pencil-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        {/* Soft pencil shadow */}
        <radialGradient id="shadow-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A2A2A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2A2A2A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground pencil hatch shadow */}
      <ellipse cx="100" cy="155" rx="72" ry="14" fill="url(#shadow-gradient)" />
      <path
        d="M 45 156 Q 100 160 155 156"
        stroke="#444"
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeOpacity="0.4"
      />
      <path
        d="M 55 158 Q 100 162 145 158"
        stroke="#444"
        strokeWidth="0.8"
        strokeDasharray="3 4"
        strokeOpacity="0.3"
      />

      {/* SPECIFIC SKETCH BASED ON CATEGORY */}
      {type === 'eva-women' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Sole Profile - Sleek contoured EVA slide */}
          <path
            d="M 38 140 C 40 148, 60 150, 100 150 C 145 150, 162 146, 165 138 C 167 132, 158 126, 148 126 C 130 126, 115 132, 90 132 C 60 132, 45 128, 38 140 Z"
            strokeWidth="2.2"
            fill="#FAF9F6"
          />
          {/* EVA Outsole groove details */}
          <path d="M 46 147 Q 100 152 158 145" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 52 149 L 55 145 M 70 150 L 73 146 M 90 150 L 93 147 M 110 150 L 113 147 M 130 149 L 133 146 M 148 147 L 151 144" strokeWidth="1" strokeOpacity="0.6" />
          {/* Footbed arch curve */}
          <path d="M 48 132 C 70 132, 90 124, 120 125 C 140 126, 155 130, 158 134" strokeWidth="1.5" />
          {/* Wide upper band / slide strap */}
          <path
            d="M 68 130 C 65 105, 80 88, 110 88 C 132 88, 142 102, 140 126"
            strokeWidth="2"
            fill="#F5F3EF"
          />
          {/* Crosshatching on strap */}
          <path d="M 80 94 L 88 126 M 92 90 L 100 126 M 104 90 L 112 126 M 116 93 L 124 126 M 128 98 L 134 126" strokeWidth="0.8" strokeOpacity="0.35" />
          {/* Inner lining curve */}
          <path d="M 78 128 C 82 105, 95 96, 112 96 C 124 96, 132 105, 134 125" strokeWidth="1.2" strokeOpacity="0.6" />
          {/* MEOW branding deboss on insole heel */}
          <path d="M 45 134 Q 52 135 60 134" strokeWidth="1.2" />
        </g>
      )}

      {type === 'cork-women' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Signature Cork Footbed Sandal with Dual Straps & Buckles */}
          {/* Cork Midsole */}
          <path
            d="M 36 138 C 38 147, 55 151, 95 151 C 142 151, 164 146, 168 137 C 170 128, 155 125, 140 124 C 115 122, 95 133, 70 133 C 50 133, 40 127, 36 138 Z"
            strokeWidth="2.2"
            fill="#EFE8DB"
          />
          {/* Stippling / Cork grain marks */}
          <circle cx="50" cy="142" r="0.8" fill="#555" />
          <circle cx="65" cy="144" r="0.8" fill="#555" />
          <circle cx="82" cy="146" r="0.8" fill="#555" />
          <circle cx="105" cy="146" r="0.8" fill="#555" />
          <circle cx="128" cy="143" r="0.8" fill="#555" />
          <circle cx="145" cy="140" r="0.8" fill="#555" />
          <circle cx="75" cy="138" r="0.7" fill="#555" />
          <circle cx="115" cy="140" r="0.7" fill="#555" />
          {/* Deep heel cup & toe grip bar */}
          <path d="M 42 133 C 48 136, 56 136, 62 133" strokeWidth="1.3" />
          <path d="M 145 128 C 150 130, 158 130, 162 128" strokeWidth="1.2" />
          {/* Strap 1 (Front toe strap) */}
          <path d="M 120 125 C 122 108, 134 104, 150 108 C 156 112, 158 120, 158 128" strokeWidth="2" fill="#F4EFEA" />
          <rect x="134" y="103" width="7" height="9" rx="1.5" strokeWidth="1.5" fill="#FFF" />
          <line x1="137.5" y1="103" x2="137.5" y2="112" strokeWidth="1" />
          {/* Strap 2 (Instep strap) */}
          <path d="M 72 130 C 70 100, 84 88, 108 88 C 120 90, 126 102, 125 124" strokeWidth="2" fill="#F4EFEA" />
          <rect x="94" y="86" width="8" height="10" rx="1.5" strokeWidth="1.5" fill="#FFF" />
          <line x1="98" y1="86" x2="98" y2="96" strokeWidth="1" />
          {/* Crosshatch shading */}
          <path d="M 82 105 L 90 125 M 95 100 L 102 125 M 108 102 L 114 125" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
      )}

      {type === 'dd-women' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Double Density Mule with dual-density layer lines */}
          {/* Base Outsole */}
          <path d="M 35 146 C 40 152, 60 153, 100 153 C 145 153, 165 148, 168 142 L 165 137 C 140 142, 60 142, 35 140 Z" strokeWidth="2" fill="#E8E5DF" />
          {/* Second Density Midsole */}
          <path d="M 35 140 C 40 142, 60 142, 100 142 C 140 142, 165 137, 165 133 C 160 128, 130 125, 100 125 C 60 125, 40 130, 35 140 Z" strokeWidth="1.8" fill="#F7F5F0" />
          {/* Double density divider line */}
          <path d="M 37 142 Q 100 145 166 138" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.8" />
          {/* Closed-toe Mule Upper */}
          <path
            d="M 75 128 C 70 102, 85 82, 115 82 C 145 82, 165 105, 166 132 C 166 135, 150 134, 135 133 C 110 131, 90 130, 75 128 Z"
            strokeWidth="2.2"
            fill="#FAF8F5"
          />
          {/* Center seam stitching on mule */}
          <path d="M 115 82 Q 120 105 126 131" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* Side buckle detail */}
          <rect x="88" y="105" width="8" height="12" rx="2" strokeWidth="1.4" fill="#FFF" />
          {/* Shading */}
          <path d="M 130 92 L 140 125 M 140 96 L 148 126 M 150 102 L 156 128" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
      )}

      {type === 'eva-kids' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Playful Kids EVA Clog/Slide */}
          {/* Rounded Cushioned Outsole */}
          <path
            d="M 44 142 C 45 151, 65 152, 100 152 C 135 152, 158 149, 162 142 C 164 134, 152 130, 138 128 C 115 126, 95 130, 75 130 C 55 130, 45 132, 44 142 Z"
            strokeWidth="2.2"
            fill="#F6F7F5"
          />
          {/* Outsole bouncy tread */}
          <path d="M 52 149 Q 100 154 154 147" strokeWidth="1.3" />
          {/* Upper dome */}
          <path
            d="M 68 130 C 65 105, 80 88, 112 88 C 140 88, 158 106, 160 135 C 160 138, 142 135, 125 132 C 100 130, 80 130, 68 130 Z"
            strokeWidth="2.2"
            fill="#FFF"
          />
          {/* Kids breathable perforation holes */}
          <circle cx="100" cy="104" r="3.5" strokeWidth="1.2" fill="#EAE8E4" />
          <circle cx="114" cy="102" r="3.5" strokeWidth="1.2" fill="#EAE8E4" />
          <circle cx="128" cy="106" r="3.5" strokeWidth="1.2" fill="#EAE8E4" />
          <circle cx="106" cy="116" r="3.5" strokeWidth="1.2" fill="#EAE8E4" />
          <circle cx="122" cy="118" r="3.5" strokeWidth="1.2" fill="#EAE8E4" />
          {/* Pivoting heel strap */}
          <path d="M 66 128 C 55 120, 52 108, 62 102 C 72 98, 80 110, 80 126" strokeWidth="1.8" fill="#F0EEEA" />
          <circle cx="78" cy="126" r="3" strokeWidth="1.2" fill="#333" />
        </g>
      )}

      {type === 'cork-kids' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Kids Cork Sandal with Ankle Strap */}
          {/* Cork Midsole */}
          <path
            d="M 40 140 C 42 148, 60 150, 95 150 C 135 150, 158 146, 162 138 C 164 130, 150 126, 138 126 C 115 125, 95 132, 75 132 C 55 132, 44 128, 40 140 Z"
            strokeWidth="2.2"
            fill="#EDE5D8"
          />
          {/* Cork dots */}
          <circle cx="55" cy="144" r="0.7" fill="#666" />
          <circle cx="75" cy="146" r="0.7" fill="#666" />
          <circle cx="100" cy="146" r="0.7" fill="#666" />
          <circle cx="125" cy="144" r="0.7" fill="#666" />
          <circle cx="145" cy="141" r="0.7" fill="#666" />
          {/* Front toe strap */}
          <path d="M 125 126 C 127 112, 138 108, 152 112 C 156 116, 156 122, 155 128" strokeWidth="2" fill="#F7F4F0" />
          {/* Ankle wrap-around strap */}
          <path d="M 52 134 C 48 110, 58 92, 85 92 C 102 92, 114 104, 116 126" strokeWidth="2" fill="#F7F4F0" />
          {/* Hook-and-loop / buckle closure */}
          <rect x="75" y="90" width="14" height="6" rx="2" strokeWidth="1.3" fill="#FFF" />
          <path d="M 60 110 L 68 132 M 72 105 L 80 132" strokeWidth="0.8" strokeOpacity="0.4" />
        </g>
      )}

      {type === 'magic-kids' && (
        <g filter="url(#pencil-texture)" stroke="#222222" strokeLinecap="round" strokeLinejoin="round">
          {/* Magic Craft Active Adventure Shoe */}
          {/* Rugged Multi-Flex Grip Sole */}
          <path
            d="M 38 144 C 42 152, 65 153, 100 153 C 140 153, 162 148, 166 140 C 168 132, 150 126, 135 125 C 110 124, 90 130, 70 130 C 50 130, 42 132, 38 144 Z"
            strokeWidth="2.2"
            fill="#ECE9E2"
          />
          {/* Rugged cleats */}
          <path d="M 45 150 L 50 145 M 65 152 L 70 146 M 90 152 L 95 147 M 115 152 L 120 147 M 138 150 L 142 145" strokeWidth="1.2" />
          {/* Dynamic athletic upper with flexible zig-zag strap */}
          <path
            d="M 55 132 C 55 110, 70 85, 105 85 C 135 85, 158 105, 162 135 C 162 138, 140 132, 120 130 C 95 128, 75 128, 55 132 Z"
            strokeWidth="2"
            fill="#FAF8F5"
          />
          {/* Magic zig-zag straps */}
          <path d="M 78 128 L 92 98 L 108 126 L 122 96 L 138 126" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
          {/* Toe protective bumper */}
          <path d="M 145 136 C 158 132, 164 126, 164 118" strokeWidth="1.6" strokeDasharray="2 2" />
          {/* Pull tab on heel */}
          <path d="M 55 118 C 48 114, 48 106, 54 104" strokeWidth="1.6" fill="none" />
        </g>
      )}

      {/* Outer circular aesthetic border with sketch graphite styling */}
      <circle
        cx="100"
        cy="100"
        r="94"
        stroke="#E2DDD5"
        strokeWidth="1.2"
        strokeDasharray="180 3 120 2"
        className="opacity-70 group-hover:stroke-meow-dark transition-colors duration-500"
      />
    </svg>
  );
};
