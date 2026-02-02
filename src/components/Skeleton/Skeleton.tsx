// src/components/Skeleton/Skeleton.tsx
'use client'

import React from 'react'
import styles from './Skeleton.module.css' // создаём отдельные стили

type SkeletonProps = {
  width?: string | number
  height?: string | number
  count?: number
  className?: string
  inline?: boolean
  style?: React.CSSProperties
}

export default function Skeleton({
  width = '100%',
  height = '1em',
  count = 1,
  className = '',
  inline = false,
  style = {},
}: SkeletonProps) {
  const wrapperStyle = inline
    ? { display: 'inline-block', lineHeight: 1 }
    : { display: 'block' }

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...wrapperStyle,
    ...style,
  }

  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <span
            key={i}
            className={`${styles.skeleton} ${className}`}
            style={skeletonStyle}
          />
        ))}
    </>
  )
}
