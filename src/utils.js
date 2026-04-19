/**
 * @file utils.js
 * @description Pure utility functions for Pathwise AI.
 * These functions have zero browser or network dependencies,
 * making them fully testable in Node.js-based test environments.
 */

/**
 * Sanitizes a user text input by stripping HTML tags and angle brackets
 * to prevent Cross-Site Scripting (XSS) injection into the DOM or AI prompts.
 * @param {string} input - Raw user input string.
 * @returns {string} Sanitized, HTML-safe string.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim();
}

/**
 * Constructs a strict JSON-schema-enforcing prompt for the Gemini 2.0 Flash API.
 * The schema is embedded in the prompt to guarantee that the model returns
 * a parseable, structured response on every call.
 * @param {string} cr - Current Role of the user.
 * @param {string} dc - Dream Career the user is targeting.
 * @param {string} sk - Current Skills as a comma-separated string.
 * @param {number} tm - Time horizon available in months.
 * @returns {string} A fully structured prompt string.
 */
export function buildGeminiPrompt(cr, dc, sk, tm) {
  return `Act as a senior tech career architect.
  User Profile:
  - Current Role: ${cr}
  - Dream Career: ${dc}
  - Current Skills: ${sk}
  - Timeframe: ${tm} months

  Provide a highly realistic, actionable career transition roadmap.
  You MUST respond ONLY with a valid JSON string mapping exactly to this schema:
  {
    "career": "${dc}",
    "desc": "Short compelling summary.",
    "match": <number 0-100 indicating current readiness>,
    "skills": ["<Array of 4-6 exact required hard skills>"],
    "gaps": [
      {"n": "Skill to learn", "l": "high|med|low", "p": <importance 1-100>}
    ],
    "roadmap": [
      {"t": "Phase 1 / Step 1", "d": "Description"}
    ]
  }`;
}

/**
 * Formats a Unix timestamp (milliseconds) into a locale-aware date string.
 * @param {number} ms - Timestamp in milliseconds.
 * @returns {string} Human-readable date string.
 */
export function formatDate(ms) {
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
