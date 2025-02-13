export type ProductVariants = {
  [key: string]: string[];
}

export type ProductDimensions = {
  length: number;
  width: number;
  height: number;
  unit?: string; // 'cm' or 'in'
}
