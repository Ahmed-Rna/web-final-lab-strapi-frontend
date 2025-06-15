'use client'
import React from 'react'
import Slider from './Slider'

export default function SliderWrapper({ categories }) {
  return <Slider categories={categories || []} />
}
