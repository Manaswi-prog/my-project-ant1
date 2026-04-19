import { describe, it, expect, vi } from 'vitest';
import { buildGeminiPrompt, typeWriter } from '../src/main.js';

describe('Utils', () => {
  it('buildGeminiPrompt constructs prompt with variables correctly', () => {
    const prompt = buildGeminiPrompt('AI', 'Intermediate', 15);
    expect(prompt).toContain('AI');
    expect(prompt).toContain('Intermediate');
    expect(prompt).toContain('15');
    expect(prompt).toContain('"skills"');
    expect(prompt).toContain('"roadmap"');
  });

  it('typeWriter completes correctly', () => {
    vi.useFakeTimers();
    const el = { textContent: '' };
    const cb = vi.fn();
    
    typeWriter(el, 'Test', 10, cb);
    
    // Advance timers
    vi.advanceTimersByTime(45);
    
    expect(cb).toHaveBeenCalled();
    expect(el.textContent).toBe('Test');
    
    vi.useRealTimers();
  });
});
