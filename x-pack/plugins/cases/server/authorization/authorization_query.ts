/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { remove } from 'lodash';

export function getClassFilter(savedObjectType: string, classNames: string[]): string {
  const firstQueryItem =
    classNames.length > 0 ? `${savedObjectType}.attributes.class: ${classNames[0]}` : '';

  const reducesQuery = classNames.slice(1).reduce<string>((query, className) => {
    ensureFieldIsSafeForQuery('class', className);
    return `${query} OR ${savedObjectType}.attributes.class: ${className}`;
  }, firstQueryItem);

  return `(${reducesQuery})`;
}

export function ensureFieldIsSafeForQuery(field: string, value: string): boolean {
  const invalid = value.match(/([>=<\*:()]+|\s+)/g);
  if (invalid) {
    const whitespace = remove(invalid, (chars) => chars.trim().length === 0);
    const errors = [];
    if (whitespace.length) {
      errors.push(`whitespace`);
    }
    if (invalid.length) {
      errors.push(`invalid character${invalid.length > 1 ? `s` : ``}: ${invalid?.join(`, `)}`);
    }
    throw new Error(`expected ${field} not to include ${errors.join(' and ')}`);
  }
  return true;
}
