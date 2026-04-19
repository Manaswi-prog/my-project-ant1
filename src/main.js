import { GoogleGenerativeAI } from "@google/generative-ai";
import { initParticles } from "./particles.js";
import { initCursor } from "./cursor.js";
import { saveSession, getSessions, clearHistory, trackEvent } from "./firebase.js";
import { getCareerData } from "./careerData.js";
import { initRadarChart } from "./radar.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function buildGeminiPrompt(currentRole, dreamCareer, currentSkills, timeAvailable) {
  return `You are Pathwise AI, an expert career counselor with 20 years of experience.

A user has shared their profile:
- Current Role: ${currentRole}
- Dream Career: ${dreamCareer}
- Current Skills: ${currentSkills}
- Time Available: ${timeAvailable} months

Generate a highly personalized career recommendation.
Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble.
Use this exact shape:

{
  "career": "Job Title (2-4 words)",
  "match": 88,
  "desc": "Two compelling sentences about why this career fits them and excitedly framing the path.",
  "skills": ["Skill1","Skill2","Skill3","Skill4","Skill5"],
  "gaps": [
    {"n": "Skill Area Name", "p": 75, "l": "low"},
    {"n": "Skill Area Name", "p": 60, "l": "med"},
    {"n": "Skill Area Name", "p": 45, "l": "high"}
  ],
  "roadmap": [
    {"t": "Step Title", "d": "1-2 actionable sentences specific to this person."},
    {"t": "Step Title", "d": "1-2 actionable sentences specific to this person."},
    {"t": "Step Title", "d": "1-2 actionable sentences specific to this person."}
  ]
}

Rules:
- "match" must be a number between 70 and 99
- "l" values must be exactly: "low", "med", or "high"
- "p" values are percentages (0-100) estimating their current proficiency in the gap
- Adjust roadmap pacing to ${timeAvailable} months timeframe available
- Make recommendations feel genuinely personalized, not generic`;
}

export function typeWriter(element, text, speedMs, callback) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speedMs);
}

// Ensure execution only runs in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initParticles('particles-canvas');
    initCursor();

    // Side Effects & Session Memory
    let userId = localStorage.getItem('pathwise_uid');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('pathwise_uid', userId);
    }
    
    const sidebar = document.getElementById('session-sidebar');
    const openBtn = document.getElementById('open-sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const clearBtn = document.getElementById('clear-history');
    const sessionList = document.getElementById('session-list');

    const renderSessions = async () => {
      if(!sessionList) return;
      const sessions = await getSessions(userId);
      sessionList.innerHTML = '';
      if (sessions.length === 0) {
        sessionList.innerHTML = '<p style="color:var(--muted);font-size:0.9rem;">No history yet.</p>';
      } else {
        sessions.forEach(s => {
          const div = document.createElement('div');
          div.className = 'session-item ix';
          div.innerHTML = `<h4>${s.careerResult}</h4><p>Match: ${s.matchScore}%</p><p style="margin-top:4px;font-size:0.7rem;">${new Date(s.timestamp?.toMillis() || Date.now()).toLocaleDateString()}</p>`;
          sessionList.appendChild(div);
        });
      }
    };

    openBtn?.addEventListener('click', () => {
      renderSessions();
      sidebar?.classList.add('open');
    });
    closeBtn?.addEventListener('click', () => sidebar?.classList.remove('open'));
    clearBtn?.addEventListener('click', async () => {
      await clearHistory(userId);
      renderSessions();
    });

    const state = {
      role: '',
      dream: '',
      skills: '',
      time: 6
    };

    const roleInput = document.getElementById('current-role');
    const dreamInput = document.getElementById('dream-career');
    const skillsInput = document.getElementById('current-skills');

    roleInput?.addEventListener('input', e => state.role = e.target.value);
    dreamInput?.addEventListener('input', e => state.dream = e.target.value);
    skillsInput?.addEventListener('input', e => state.skills = e.target.value);

    // Time Slider
    const timeSlider = document.getElementById('time-slider');
    const timeDisplay = document.getElementById('time-display');
    if (timeSlider) {
      timeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        state.time = parseInt(val, 10);
        if (timeDisplay) timeDisplay.textContent = val;
        
        // Visual fill gradient
        const pct = ((val - timeSlider.min) / (timeSlider.max - timeSlider.min)) * 100;
        timeSlider.style.setProperty('--pct', `${pct}%`);
      });
    }

    const generateBtn = document.getElementById('generate-btn');
    const demoBtn = document.getElementById('demo-btn');
    const errorMsg = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');

    const runGeneration = async () => {
        if (!state.role || !state.dream || !state.skills) {
          if (errorMsg) {
              errorMsg.textContent = 'Please fill out your current role, dream career, and skills.';
              setTimeout(() => errorMsg.textContent = '', 3000);
          }
          return;
        }

        generateBtn.disabled = true;
        demoBtn.disabled = true;
        generateBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;">↻</span> Consulting AI...`;
        generateBtn.setAttribute('aria-busy', 'true');
        if (errorMsg) errorMsg.textContent = '';
        
        // Show shimmer
        if(resultSection) {
            resultSection.classList.remove('hidden');
            const inner = document.getElementById('result-card-inner');
            inner.innerHTML = `
              <div class="shimmer shimmer-block title"></div>
              <div class="shimmer shimmer-block" style="width:40%"></div>
              <div class="shimmer shimmer-block circle"></div>
              <div class="shimmer shimmer-block"></div>
              <div class="shimmer shimmer-block"></div>
              <div class="shimmer shimmer-block"></div>
            `;
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        let resultData = null;

        try {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (!apiKey) throw new Error("No API Key");

          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          const prompt = buildGeminiPrompt(state.role, state.dream, state.skills, state.time);
          
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          resultData = JSON.parse(text.replace(/```json|```/g, '').trim());
        } catch (err) {
          console.warn('Gemini API failed, using fallback.', err);
          if (errorMsg) {
              errorMsg.textContent = 'Warning: Using offline fallback database.';
              setTimeout(() => errorMsg.textContent = '', 3000);
          }
          resultData = getCareerData(state.role, state.dream, state.skills, state.time);
        }

        if (resultData) {
          renderResult(resultData);
          saveSession({
            userId,
            currentRole: state.role,
            dreamCareer: state.dream,
            currentSkills: state.skills,
            timeAvailable: state.time,
            careerResult: resultData.career,
            matchScore: resultData.match
          });
          trackEvent('career_generated', { 
            career: resultData.career, 
            score: resultData.match 
          });
        } else if (errorMsg) {
          errorMsg.textContent = 'Failed to generate path. Please try again.';
          // Reset shimmer state
          const inner = document.getElementById('result-card-inner');
          inner.innerHTML = `<p>Failed to load.</p>`;
        }

        generateBtn.disabled = false;
        demoBtn.disabled = false;
        generateBtn.innerHTML = '✦ Regenerate Path';
        generateBtn.setAttribute('aria-busy', 'false');
    };

    if (generateBtn) {
      generateBtn.addEventListener('click', runGeneration);
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
         // Auto-fill demo inputs
         if (roleInput) roleInput.value = 'Data Analyst';
         if (dreamInput) dreamInput.value = 'AI Researcher';
         if (skillsInput) skillsInput.value = 'Python, Excel, SQL';
         if (timeSlider) {
            timeSlider.value = 24;
            timeSlider.dispatchEvent(new Event('input'));
         }
         state.role = 'Data Analyst';
         state.dream = 'AI Researcher';
         state.skills = 'Python, Excel, SQL';
         state.time = 24;

         document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
         
         setTimeout(runGeneration, 800);
      });
    }

    // Interactive 3D mouse parallax
    const hero = document.getElementById('hero');
    const hero3dContent = document.querySelector('.hero-content-3d');
    const hero3dHands = document.querySelector('.hero-image-wrap');
    if (hero && hero3dContent && hero3dHands) {
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20; 
        const y = (e.clientY / window.innerHeight - 0.5) * -20; 
        hero3dContent.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(30px)`;
        hero3dHands.style.transform = `rotateY(${x * 0.5}deg) rotateX(${y * 0.5}deg) translateZ(10px)`;
      });
      hero.addEventListener('mouseleave', () => {
        hero3dContent.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`;
        hero3dHands.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`;
      });
      // Add transitions logically
      hero3dContent.style.transition = 'transform 0.1s ease-out';
      hero3dHands.style.transition = 'transform 0.1s ease-out';
    }

    function renderResult(data) {
      if (!resultSection) return;
      resultSection.classList.remove('hidden');

      const inner = document.getElementById('result-card-inner');
      inner.innerHTML = `
          <h2 id="result-title"></h2>
          <div class="match-score">Match: <span id="result-match"></span>%</div>
          <p id="result-desc"></p>
          
          <div class="skills-container">
            <h3>Required Skills</h3>
            <div id="result-skills" class="skills-tags"></div>
          </div>

          <div class="radar-container">
            <h3>Skill Gap Radar</h3>
            <canvas id="radar-chart"></canvas>
          </div>

          <div class="gaps-container">
            <h3>Skill Priorities</h3>
            <div id="result-gaps" class="gaps-list"></div>
          </div>

          <div class="roadmap-container">
            <h3>Actionable Roadmap</h3>
            <div id="result-roadmap" class="roadmap-list"></div>
          </div>
          
          <div class="export-actions" data-html2canvas-ignore="true">
            <button id="download-pdf" class="ix action-btn secondary">Download PDF</button>
            <button id="share-card" class="ix action-btn secondary">Share Card</button>
          </div>
      `;

      const titleEl = document.getElementById('result-title');
      const matchEl = document.getElementById('result-match');
      const descEl = document.getElementById('result-desc');
      const skillsEl = document.getElementById('result-skills');
      const gapsEl = document.getElementById('result-gaps');
      const roadmapEl = document.getElementById('result-roadmap');

      // Clear contents
      titleEl.textContent = '';
      matchEl.textContent = data.match;
      descEl.textContent = data.desc;
      skillsEl.innerHTML = '';
      gapsEl.innerHTML = '';
      roadmapEl.innerHTML = '';

      // Prepare Skills
      data.skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        skillsEl.appendChild(span);
      });

      // Prepare Gaps
      data.gaps.forEach(gap => {
        const item = document.createElement('div');
        item.className = 'gap-item';
        item.innerHTML = `
          <div class="gap-header">
            <span>${gap.n}</span>
            <span>Priority: ${gap.l.toUpperCase()}</span>
          </div>
          <div class="gap-bar-bg">
            <div class="gap-bar-fill" data-width="${gap.p}%"></div>
          </div>
        `;
        gapsEl.appendChild(item);
      });

      // Prepare Roadmap
      data.roadmap.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'roadmap-step';
        item.innerHTML = `
          <h4>${idx + 1}. ${step.t}</h4>
          <p>${step.d}</p>
        `;
        roadmapEl.appendChild(item);
      });

      // Hook up Export Buttons
      document.getElementById('download-pdf').addEventListener('click', () => {
         const doc = new jsPDF();
         const title = data.career;
         const desc = data.desc;
         doc.setFontSize(22);
         doc.text(title, 20, 30);
         doc.setFontSize(12);
         const splitDesc = doc.splitTextToSize(desc, 170);
         doc.text(splitDesc, 20, 45);
         // Add roadmap
         doc.setFontSize(16);
         doc.text("Roadmap", 20, 80);
         doc.setFontSize(10);
         let yOffset = 90;
         data.roadmap.forEach((step, i) => {
             doc.text(`${i+1}. ${step.t}`, 20, yOffset);
             const txt = doc.splitTextToSize(step.d, 160);
             doc.text(txt, 25, yOffset + 6);
             yOffset += 15 + (txt.length * 4);
         });
         doc.save("Pathwise_Roadmap.pdf");
      });

      document.getElementById('share-card').addEventListener('click', async () => {
         const card = document.getElementById('result-card-inner');
         try {
           const canvasImg = await html2canvas(card, { backgroundColor: '#060608', useCORS: true });
           canvasImg.toBlob(async (blob) => {
              try {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                alert("Image copied to clipboard!");
              } catch(e) {
                const a = document.createElement('a');
                a.href = canvasImg.toDataURL();
                a.download = 'Career_Card.png';
                a.click();
              }
           });
         } catch(e) {
           console.warn("Share failed", e);
         }
      });

      // Animate typeWriter
      typeWriter(titleEl, data.career, 40, () => {
        // Init Radar
        initRadarChart('radar-chart', state.skills, data.skills, data.gaps);

        // Animate Skills
        const tags = skillsEl.querySelectorAll('.skill-tag');
        tags.forEach((tag, idx) => {
          setTimeout(() => tag.classList.add('show'), idx * 150);
        });

        // Animate Gaps
        const gapFills = gapsEl.querySelectorAll('.gap-bar-fill');
        gapFills.forEach((fill, idx) => {
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-width');
          }, 200 + (idx * 100));
        });

        // Animate Roadmap
        const steps = roadmapEl.querySelectorAll('.roadmap-step');
        steps.forEach((step, idx) => {
          setTimeout(() => {
            step.classList.add('show');
          }, 300 + (idx * 150));
        });
      });
    }
    
    if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
  });
}
