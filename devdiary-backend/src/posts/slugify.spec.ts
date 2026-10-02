import { slugify } from './slugify';

describe('slugify', () => {
  it('removes accents and punctuation', () => {
    expect(slugify('Olá, Mundo! Automação com IA')).toBe(
      'ola-mundo-automacao-com-ia',
    );
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Next.js 16--  ')).toBe('next-js-16');
  });

  it('returns an empty string when nothing is left', () => {
    expect(slugify('!!!')).toBe('');
  });
});
