export type ToolCategory = 
  | 'scanner' 
  | 'pdf' 
  | 'image' 
  | 'office' 
  | 'ai' 
  | 'productivity';

export interface ToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isPopular?: boolean;
  isNew?: boolean;
  path: string;
  tags: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface QuadCorners {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

export type FilterPreset = 
  | 'original' 
  | 'magic' 
  | 'auto' 
  | 'lighten' 
  | 'enhance' 
  | 'grayscale' 
  | 'bw' 
  | 'document'
  | 'color_enhance';

export interface FilterSettings {
  preset: FilterPreset;
  brightness: number; // -50 to 50
  contrast: number;   // -50 to 50
  sharpness: number;  // 0 to 5
}

export interface ScannedPage {
  id: string;
  originalDataUrl: string;
  croppedDataUrl: string;
  enhancedDataUrl: string;
  corners: QuadCorners;
  rotation: number; // 0, 90, 180, 270
  filterSettings: FilterSettings;
  ocrText?: string;
  createdAt: number;
}

export interface MetaData {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
}
