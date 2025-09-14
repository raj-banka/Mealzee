"use client";
import React from 'react';
import Image from 'next/image';

interface Props extends React.ComponentProps<typeof Image> {
  className?: string;
}

export default function SmartImage({ className = '', alt = '', ...props }: Props) {
  // If width/height are not provided, use `fill` inside a positioned wrapper
  const hasSize = typeof (props as any).width !== 'undefined' && typeof (props as any).height !== 'undefined';
  const src = (props as any).src as string;

  if (!hasSize) {
    // Ensure wrapper is positioned for Image fill
    const wrapperClass = `${className} relative`.trim();
    return (
      <div className={wrapperClass}>
        <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="100%" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Image {...(props as any)} alt={alt} />
    </div>
  );
}
