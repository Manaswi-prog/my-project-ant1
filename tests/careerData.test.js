/**
 * @file careerData.test.js
 * @description Unit tests for the career data engine and heuristic fallback logic.
 */
import { describe, it, expect } from 'vitest';
import { careerDB, adjustScore, getCareerData } from '../src/careerData.js';

describe('careerDB Structure', () => {
  const interests = ['Design', 'Coding', 'Business', 'AI', 'Marketing', 'Other'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  it('contains exactly 18 unique career paths', () => {
    let count = 0;
    interests.forEach(interest => {
      skillLevels.forEach(level => {
        const path = careerDB[interest]?.[level];
        expect(path, `Missing path for ${interest}/${level}`).toBeDefined();
        if (path) count++;
      });
    });
    expect(count).toBe(18);
  });

  it('every path has exactly 7 required skills', () => {
    interests.forEach(interest => {
      skillLevels.forEach(level => {
        const path = careerDB[interest]?.[level];
        if (path) expect(path.skills).toHaveLength(7);
      });
    });
  });

  it('every path has exactly 3 skill gaps', () => {
    interests.forEach(interest => {
      skillLevels.forEach(level => {
        const path = careerDB[interest]?.[level];
        if (path) expect(path.gaps).toHaveLength(3);
      });
    });
  });

  it('every path has exactly 5 roadmap steps', () => {
    interests.forEach(interest => {
      skillLevels.forEach(level => {
        const path = careerDB[interest]?.[level];
        if (path) expect(path.roadmap).toHaveLength(5);
      });
    });
  });

  it('all gap levels are valid enum values', () => {
    const validLevels = ['low', 'med', 'high'];
    interests.forEach(interest => {
      skillLevels.forEach(level => {
        const path = careerDB[interest]?.[level];
        if (path) {
          path.gaps.forEach(gap => {
            expect(validLevels).toContain(gap.l);
            expect(gap.p).toBeGreaterThanOrEqual(0);
            expect(gap.p).toBeLessThanOrEqual(100);
          });
        }
      });
    });
  });
});

describe('adjustScore()', () => {
  it('adds 4 points when timeProxy >= 20 hours', () => {
    expect(adjustScore(80, 25)).toBe(84);
  });

  it('subtracts 8 points when timeProxy <= 5 hours', () => {
    expect(adjustScore(80, 3)).toBe(72);
  });

  it('does not change score for mid-range time', () => {
    expect(adjustScore(80, 10)).toBe(80);
  });

  it('clamps upper bound to 99', () => {
    expect(adjustScore(98, 30)).toBe(99);
  });

  it('clamps lower bound to 70', () => {
    expect(adjustScore(75, 2)).toBe(70);
  });
});

describe('getCareerData()', () => {
  it('returns a valid career object for an AI role', () => {
    const data = getCareerData('Data Analyst', 'AI Researcher', 'Python, SQL', 24);
    expect(data).toBeDefined();
    expect(data.career).toBeDefined();
    expect(data.skills).toBeInstanceOf(Array);
    expect(data.gaps).toBeInstanceOf(Array);
    expect(data.roadmap).toBeInstanceOf(Array);
    expect(data.match).toBeGreaterThan(0);
    expect(data.match).toBeLessThanOrEqual(100);
  });

  it('returns a valid career object for a design role', () => {
    const data = getCareerData('Junior Designer', 'Design Director', 'Figma, UI', 12);
    expect(data.career).toBeDefined();
    expect(data.skills.length).toBeGreaterThan(0);
  });

  it('falls back to Other/Beginner for unknown inputs', () => {
    const data = getCareerData('unknown-xyz', 'mystery-abc', '', 6);
    expect(data).toBeDefined();
    expect(data.career).toBe('Technical Project Manager');
  });
});
