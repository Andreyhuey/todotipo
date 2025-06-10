import DesignCase from '@/components/design-cases/design-case';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';
import { Metadata } from 'next';
import React from 'react';

export function generateMetadata(): Metadata {
  return getMetadata(routes.designCase());
}

export default function page() {
  return <DesignCase />;
}
