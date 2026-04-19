# Pathwise AI - Career Intelligence Assistant

**Live Deployment:** [https://pathwise-ai-fc7f9.web.app](https://pathwise-ai-fc7f9.web.app)

Pathwise AI is a dynamic, smart career profiling assistant. It synthesizes a user's current role, target dream career, current skill-set, and timeline to instantly generate highly personalized action plans and live skill-gap analysis.

## Chosen Vertical
**Education & Career Intelligence (EdTech)**. Pathwise AI acts as an accessible, high-level career advisor bridging the gap between current competencies and aspirational roles.

## Approach and Logic
We wanted to create a highly visual, zero-friction experience that delivers actionable results instantly. 
1. **Dynamic Prompting**: We constructed a strict system prompt for Gemini 2.0 Flash that forces the AI to reply in a clean, predictable JSON schema.
2. **Offline Fallback**: In the event of API throttling or offline conditions, the assistant relies on an NLP-inspired heuristic engine (`careerData.js`) that uses regex mapping against user inputs to securely return a closest-match hardcoded path.
3. **Session Memory**: As users generate roadmaps, Firebase Firestore silently logs the outcomes to a user-specific UUID, building a historical context sidebar that users can view anytime they return, guaranteeing practical real-world usability without demanding a heavy login sequence.
4. **Visual Analytics**: We ported the Gemini output JSON data directly into a 2D Canvas engine (`radar.js`) mimicking a cyberpunk radar terminal to show the delta between where a user is and where they need to be.

## How the Solution Works
1. **Input Stage**: The user is greeted by a cinematic 3D Next-Gen UI. They input free-text data describing their professional state.
2. **Analysis Stage**: The data is shipped to Google Gemini 2.0 Flash via standard REST API calls. 
3. **Execution Stage**: Gemini calculates the match probability, synthesizes the core gaps (rating them Low, Med, High priority), and paces a step-by-step roadmap tailored exactly to the user's available time.
4. **Presentation**: The UI parses the response, renders the interactive UI elements with clean vanilla JS DOM manipulation, and saves the payload to Firebase. The user can then export their roadmap via PDF or as a copied image clipboard payload.

## Use of Google Services
* **Google Gemini 2.0 Flash API**: The brains of the operation driving all dynamic decision making.
* **Firebase Firestore**: Schema-locked persistent NoSQL database mapping user sessions.
* **Firebase Hosting**: High-speed, secure global edge deployment infrastructure.

## Assumptions Made
1. **Frictionless Onboarding**: We assumed that demanding a Google/OAuth login up-front for a career tool adds unnecessary friction. Therefore, we generate a persistent `UUID` saved to `localStorage` to identify the user anonymously in Firebase.
2. **Payload Security**: We assumed that an anonymous database could be targeted by scrapers/bad actors, so we strictly locked down the `firestore.rules`. The payload size is tightly constrained, and documents must exactly match the schema fields (role, career, etc.) allowing us to remain safe and efficient.

---
### Evaluation Focus Verification
- **Code Quality**: Vanilla Javascript architecture separated by logical domains (Canvas logic, DB logic, API logic).
- **Security**: Heavily restricted Firebase Security Rules avoiding payload stuffing.
- **Efficiency**: Zero-framework overhead (`0.71 MB` total repository footprint!).
- **Testing**: Jest test suites validating heuristic logic and API state handlers.
- **Accessibility**: ARIA traits (`aria-busy`) and stark contrast neon text ensuring high readability.