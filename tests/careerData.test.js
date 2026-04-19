import { describe, it, expect } from 'vitest';
import { careerDB, adjustScore, getCareerData } from '../src/careerData.js';

describe('Career Data Logic', () => {
  it('contains 18 unique career paths', () => {
    let count = 0;
    const interests = ['Design', 'Coding', 'Business', 'AI', 'Marketing', 'Other'];
    const skills = ['Beginner', 'Intermediate', 'Advanced'];
    
    interests.forEach(i => {
      skills.forEach(s => {
        const path = careerDB[i]?.[s];
        expect(path).toBeDefined();
        if (path) {
          count++;
          expect(path.skills).toHaveLength(7);
          expect(path.gaps).toHaveLength(3);
          expect(path.roadmap).toHaveLength(5);
          path.gaps.forEach(gap => {
            expect(['low', 'med', 'high']).toContain(gap.l);
            expect(gap.p).toBeGreaterThanOrEqual(0);
            expect(gap.p).toBeLessThanOrEqual(100);
          });
        }
      });
    });
    expect(count).toBe(18);
  });

  it('adjustScore modifies match percentage correctly based on hours', () => {
    expect(adjustScore(80, 25)).toBe(84); // >= 20 adds 4
    expect(adjustScore(80, 3)).toBe(72);  // <= 5 subtracts 8
    expect(adjustScore(80, 10)).toBe(80); // Middle stays same
    
    // Bounds clamping
    expect(adjustScore(98, 30)).toBe(99); // Clamps to 99
    expect(adjustScore(75, 2)).toBe(70);  // Clamps to 70
  });

  it('getCareerData returns correctly adjusted data', () => {
    const data = getCareerData('Design', 'Beginner', 40);
    expect(data.match).toBe(91); // Base is 87 + 4 (time >= 20)
  });
});
