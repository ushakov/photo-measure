import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Layer } from 'react-konva';
import type { ImageData } from '../../types';

interface ImageLayerProps {
  image: ImageData;
}

export const ImageLayer: React.FC<ImageLayerProps> = ({ image }) => {
  const [konvaImage, setKonvaImage] = useState<any>(null);

  useEffect(() => {
    if (!image.url) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setKonvaImage(img);
    };
    img.src = image.url;
  }, [image.url]);

  if (!konvaImage) {
    return null;
  }

  return (
    <Layer>
      <KonvaImage
        image={konvaImage}
        x={0}
        y={0}
        width={image.dimensions?.width || konvaImage.width}
        height={image.dimensions?.height || konvaImage.height}
      />
    </Layer>
  );
};
