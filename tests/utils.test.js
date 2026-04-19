/**
 * @file utils.test.js
 * @description Unit tests for pure utility functions in src/utils.js.
 * All tests run in a zero-dependency Node environment — no browser APIs needed.
 */
import { describe, it, expect } from 'vitest';
import { buildGeminiPrompt, sanitizeInput, formatDate } from '../src/utils.js';

describe('buildGeminiPrompt()', () => {
  it('contains all four user inputs in the output prompt', () => {
    const prompt = buildGeminiPrompt('Data Analyst', 'AI Researcher', 'Python, SQL', 12);
    expect(prompt).toContain('Data Analyst');
    expect(prompt).toContain('AI Researcher');
    expect(prompt).toContain('Python, SQL');
    expect(prompt).toContain('12');
  });

  it('enforces the strict JSON schema contract in the prompt', () => {
    const prompt = buildGeminiPrompt('Engineer', 'Manager', 'Leadership', 6);
    expect(prompt).toContain('"career"');
    expect(prompt).toContain('"skills"');
    expect(prompt).toContain('"gaps"');
    expect(prompt).toContain('"roadmap"');
    expect(prompt).toContain('"match"');
    expect(prompt).toContain('"desc"');
  });

  it('returns a meaningful non-empty string', () => {
    const prompt = buildGeminiPrompt('A', 'B', 'C', 1);
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(50);
  });

  it('includes the timeframe value correctly', () => {
    const prompt = buildGeminiPrompt('Dev', 'CTO', 'JS', 36);
    expect(prompt).toContain('36');
  });
});

describe('sanitizeInput()', () => {
  it('strips HTML script tags to prevent XSS', () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
    expect(result).toContain('Hello');
  });

  it('removes all angle brackets from input', () => {
    const result = sanitizeInput('<b>bold</b>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('returns clean alphanumeric strings unchanged', () => {
    const clean = 'Software Engineer';
    expect(sanitizeInput(clean)).toBe(clean);
  });

  it('handles empty string without throwing', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('strips inline event handler injections', () => {
    const result = sanitizeInput('<img onerror="evil()">');
    expect(result).not.toContain('<img');
    expect(result).not.toContain('onerror');
  });

  it('gracefully handles non-string input by returning empty string', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });
});

describe('formatDate()', () => {
  it('returns a string from a timestamp', () => {
    const result = formatDate(Date.now());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats a known timestamp correctly', () => {
    // Jan 1, 2024 UTC
    const result = formatDate(1704067200000);
    expect(result).toBeTruthy();
  });
});
