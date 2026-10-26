// High-resolution hand-drawn pencil-sketch SVG data and graphics for the 6 collections

export interface SketchCategoryDef {
  slug: string;
  title: string;
  sketchType: 'eva-women' | 'cork-women' | 'dd-women' | 'eva-kids' | 'cork-kids' | 'magic-kids';
}

export const SKETCH_COLLECTIONS: SketchCategoryDef[] = [
  { slug: 'eva-for-women', title: 'EVA for Women', sketchType: 'eva-women' },
  { slug: 'cork-inn-for-women', title: 'Cork Inn for Women', sketchType: 'cork-women' },
  { slug: 'double-density-for-women', title: 'Double Density for Women', sketchType: 'dd-women' },
  { slug: 'eva-for-kids', title: 'EVA for Kids', sketchType: 'eva-kids' },
  { slug: 'cork-inn-kids', title: 'Cork Inn for Kids', sketchType: 'cork-kids' },
  { slug: 'magic-craft-for-kids', title: 'Magic Craft for Kids', sketchType: 'magic-kids' },
];
