// Utility functions for the image measurement tool

import type { Point, MeasurementUnit } from '../types';

/**
 * Calculate the distance between two points in pixels
 */
export function calculatePixelDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert pixels to real-world units using calibration
 */
export function pixelsToUnits(pixels: number, pixelsPerUnit: number): number {
  if (pixelsPerUnit === 0) return 0;
  return pixels / pixelsPerUnit;
}

/**
 * Convert between measurement units
 */
export function convertUnits(value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit): number {
  if (fromUnit === toUnit) return value;

  // Convert to mm first (base unit)
  let valueInMm: number;
  switch (fromUnit) {
    case 'mm':
      valueInMm = value;
      break;
    case 'cm':
      valueInMm = value * 10;
      break;
    case 'inches':
      valueInMm = value * 25.4;
      break;
  }

  // Convert from mm to target unit
  switch (toUnit) {
    case 'mm':
      return valueInMm;
    case 'cm':
      return valueInMm / 10;
    case 'inches':
      return valueInMm / 25.4;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a point label based on type and index
 */
export function generatePointLabel(type: 'calibration' | 'measurement', index: number): string {
  const prefix = type === 'calibration' ? 'C' : 'M';
  return `${prefix}${index + 1}`;
}

/**
 * Format a distance value for display
 */
export function formatDistance(distance: number, unit: MeasurementUnit): string {
  const rounded = Math.round(distance * 100) / 100; // Round to 2 decimal places
  return `${rounded} ${unit}`;
}

/**
 * Check if a file is a supported image format
 */
export function isSupportedImageFormat(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return supportedTypes.includes(file.type);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
