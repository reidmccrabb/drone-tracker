'use client';

import { UAType } from '@/types/drone';

interface DroneImageProps {
  uaType: UAType;
  uasId: string;
}

const DRONE_IMAGES: Record<string, { src: string; label: string }> = {
  DJI: {
    src: 'https://pngimg.com/d/mavic_PNG18.png',
    label: 'DJI Mavic 3',
  },
  SKYDIO: {
    src: 'https://cdn.sanity.io/images/mgxz50fq/production-v3-red/0ec05f22ec90d6df897f18101f7d26e11961abc8-5860x2240.png?w=800&fit=max&auto=format',
    label: 'Skydio X10',
  },
  AUTEL: {
    src: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2022/08/18/2022081811469144.webp',
    label: 'Autel EVO II',
  },
  PARROT: {
    src: 'https://www.parrot.com/assets/s3fs-public/styles/lglossless/public/2022-02/desktop_packshot.jpg',
    label: 'Parrot ANAFI Ai',
  },
  WING: {
    src: 'https://framerusercontent.com/images/eDVmxCVdODIwui6bsbdo4CYzyA.webp?width=2230&height=1470',
    label: 'Wing Delivery Drone',
  },
};

function getBrand(uasId: string): string {
  return uasId.split('-')[0].toUpperCase();
}

export function DroneModelViewer({ uaType, uasId }: DroneImageProps) {
  const brand = getBrand(uasId);
  const drone = DRONE_IMAGES[brand] ?? DRONE_IMAGES.DJI;

  return (
    <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={drone.src}
        alt={drone.label}
        className="w-full h-full object-contain p-2"
        loading="eager"
        onError={(e) => {
          // Hide image on load failure
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="absolute bottom-1.5 left-2.5 text-[10px] text-gray-500 font-mono">
        {drone.label}
      </div>
    </div>
  );
}
