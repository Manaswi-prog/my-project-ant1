/**
 * @file main.js
 * @description Core client-side orchestrator for Pathwise AI.
 * Handles form inputs, Gemini API requests, results rendering, and session management.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCareerData } from './careerData.js';
import { initRadarChart } from './radar.js';
import { initParticles } from './particles.js';
import { saveSession, getSessions, clearHistory } from './firebase.js';
import { sanitizeInput } from './utils.js';
// NOTE: jsPDF and html2canvas are lazily loaded on-demand inside click handlers
// to avoid bloating the initial page load bundle (~593 KB saved at startup)

/** 
 * Unique anonymous user ID bound to LocalStorage.
 * Falls back to a static value in non-browser environments (e.g. test runners).
 * @type {string} 
 */
let userId = 'anonymous';
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  userId = localStorage.getItem('pw_user_id') || '';
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('pw_user_id', userId);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles('particles-canvas');
    
    // UI Elements Hook
    const generateBtn = document.getElementById('generate-btn');
    const demoBtn = document.getElementById('demo-btn');
    const roleInput = document.getElementById('current-role');
    const dreamInput = document.getElementById('dream-career');
    const skillsInput = document.getElementById('current-skills');
    const timeSlider = document.getElementById('time-slider');
    const timeDisplay = document.getElementById('time-display');
    const errorMsg = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    
    const sessionSidebar = document.getElementById('session-sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sessionList = document.getElementById('session-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    // Core State
    const state = {
      role: '',
      dream: '',
      skills: '',
      time: 6
    };

    /**
     * Toggles the memory sidebar visibility
     */
    if (openSidebarBtn && sessionSidebar) {
      openSidebarBtn.addEventListener('click', () => {
        sessionSidebar.classList.add('open');
        renderSessions();
      });
    }

    if (closeSidebarBtn && sessionSidebar) {
      closeSidebarBtn.addEventListener('click', () => {
        sessionSidebar.classList.remove('open');
      });
    }

    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', async () => {
        await clearHistory(userId);
        renderSessions();
      });
    }

    /**
     * Constructs and renders the session history records securely
     */
    const renderSessions = async () => {
      if(!sessionList) {return;}
      const sessions = await getSessions(userId);
      sessionList.textContent = ''; // SECURITY: Removes all children securely
      
      if (sessions.length === 0) {
        const p = document.createElement('p');
        p.style.color = 'var(--muted)';
        p.style.fontSize = '0.9rem';
        p.textContent = 'No history yet.';
        sessionList.appendChild(p);
      } else {
        sessions.forEach(s => {
          const div = document.createElement('div');
          div.className = 'session-item ix';
          
          const h4 = document.createElement('h4');
          h4.textContent = s.careerResult;
          
          const matchP = document.createElement('p');
          matchP.textContent = `Match: ${s.matchScore}%`;
          
          const dateP = document.createElement('p');
          dateP.style.marginTop = '4px';
          dateP.style.fontSize = '0.7rem';
          dateP.textContent = new Date(s.timestamp?.toMillis() || Date.now()).toLocaleDateString();
          
          div.appendChild(h4);
          div.appendChild(matchP);
          div.appendChild(dateP);
          sessionList.appendChild(div);
        });
      }
    };

    if (timeSlider && timeDisplay) {
      timeSlider.addEventListener('input', (e) => {
        state.time = parseInt(e.target.value, 10);
        timeDisplay.textContent = state.time;
      });
    }

    /**
     * Synthesizes the core inputs into a strict JSON-forcing logic prompt for Gemini
     * @param {string} cr - Current Role
     * @param {string} dc - Dream Career
     * @param {string} sk - Current Skills
     * @param {number} tm - Time Horizon
     * @returns {string} Fully structured prompt
     */
    const buildGeminiPrompt = (cr, dc, sk, tm) => {
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
    };

    /**
     * Core orchestrator: Executes AI call, handles UI logic and delegates rendering.
     */
    const runGeneration = async () => {
      // Sanitize all inputs before processing to prevent XSS injection
      state.role = sanitizeInput(roleInput?.value || '');
      state.dream = sanitizeInput(dreamInput?.value || '');
      state.skills = sanitizeInput(skillsInput?.value || '');
      
      if (!state.role || !state.dream) {
        if(errorMsg) {errorMsg.textContent = 'Please enter your current role and dream career to continue.';}
        return;
      }

      try {
        generateBtn.disabled = true;
        if(demoBtn) {demoBtn.disabled = true;}
        
        generateBtn.textContent = 'Consulting AI...'; // Changed to simple safe text
        generateBtn.setAttribute('aria-busy', 'true');
        if (errorMsg) {errorMsg.textContent = '';}
        
        // Show hacker loader
        if(resultSection) {
            resultSection.classList.remove('hidden');
            const inner = document.getElementById('result-card-inner');
            if(inner) {
              inner.style.display = 'none'; // preserve DOM, just hide it
            }
            
            let loader = document.getElementById('hacker-loader');
            if(!loader) {
                loader = document.createElement('div');
                loader.id = 'hacker-loader';
                loader.className = 'hacker-terminal result-card';
                resultSection.insertBefore(loader, inner);
            }
            loader.style.display = 'block';
            loader.textContent = '';
            
            const lines = [
                "> Initializing neural career pathways...",
                "> Mapping skill vectors to spatial matrix...",
                "> Connecting to Gemini 2.0 interface...",
                "> Calculating gap differentials...",
                "> Assembling temporal roadmap...",
                "> Finalizing personalized output..."
            ];
            
            let currentLine = 0;
            loader.textContent = lines[0];
            
            if(window.hackerInterval) clearInterval(window.hackerInterval);
            window.hackerInterval = setInterval(() => {
                currentLine++;
                if(currentLine < lines.length) {
                    loader.textContent += '\n' + lines[currentLine];
                } else {
                    loader.textContent += '\n> Resolving vectors...';
                    clearInterval(window.hackerInterval);
                }
            }, 300);
            
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        let resultData = null;

        if (!apiKey) {
            console.warn('No Gemini API key found, using fallback data.');
            resultData = getCareerData(state.role, state.dream, state.skills, state.time);
            await new Promise(r => setTimeout(r, 1500)); 
        } else {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = buildGeminiPrompt(state.role, state.dream, state.skills, state.time);
            
            try {
              const result = await model.generateContent(prompt);
              const text = result.response.text();
              resultData = JSON.parse(text.replace(/```json|```/g, '').trim());
            } catch (apiErr) {
              console.warn('Gemini API failed, using offline fallback.', apiErr);
              resultData = getCareerData(state.role, state.dream, state.skills, state.time);
              if (errorMsg) {errorMsg.textContent = 'Using offline data (API unavailable).';}
            }
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
        } else if (errorMsg) {
          errorMsg.textContent = 'Failed to generate path. Please try again.';
          if(resultSection) {resultSection.classList.add('hidden');}
        }
        
      } catch (err) {
        console.error('Generation Error:', err);
        if(errorMsg) {errorMsg.textContent = 'An error occurred during analysis.';}
        resultData = getCareerData(state.role, state.dream, state.skills, state.time);
        renderResult(resultData); // Try Fallback
      } finally {
        generateBtn.disabled = false;
        if(demoBtn) {demoBtn.disabled = false;}
        generateBtn.textContent = '✦ Regenerate Path';
        generateBtn.removeAttribute('aria-busy');
      }
    };

    if (generateBtn) {
      generateBtn.addEventListener('click', runGeneration);
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
         if (roleInput) {roleInput.value = 'Data Analyst';}
         if (dreamInput) {dreamInput.value = 'AI Researcher';}
         if (skillsInput) {skillsInput.value = 'Python, Excel, SQL';}
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

    // Web Speech API Integration
    const micBtns = document.querySelectorAll('.mic-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    micBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!SpeechRecognition) {
          alert("Speech Recognition not supported in this browser. Please use Chrome/Edge.");
          return;
        }

        // Toggle logic: If already listening, stop it.
        if (btn.classList.contains('listening') && btn._recognition) {
          btn._recognition.stop();
          return;
        }

        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        
        const recognition = new SpeechRecognition();
        btn._recognition = recognition; // store reference to permit stopping

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          btn.classList.add('listening');
          targetInput.placeholder = "Listening...";
        };

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          // Append with comma if textarea, otherwise overwrite
          if (targetInput.tagName === 'TEXTAREA' && targetInput.value.trim() !== '') {
            targetInput.value += ', ' + text;
          } else {
            targetInput.value = text;
          }
        };

        recognition.onend = () => {
          btn.classList.remove('listening');
          targetInput.placeholder = "Type or use mic...";
        };

        recognition.onerror = (e) => {
          console.error(e);
          btn.classList.remove('listening');
        };

        recognition.start();
      });
    });

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
        hero3dContent.style.transform = 'translateZ(0px)';
        hero3dHands.style.transform = 'translateZ(0px)';
      });
      hero3dContent.style.transition = 'transform 0.1s ease-out';
      hero3dHands.style.transition = 'transform 0.1s ease-out';
    }

    /**
     * Manipulates the DOM directly and securely to display the final result payload
     * @param {Object} data Schema-compliant JSON data
     */
    function renderResult(data) {
      if (!resultSection) {return;}
      resultSection.classList.remove('hidden');

      if(window.hackerInterval) clearInterval(window.hackerInterval);
      const loader = document.getElementById('hacker-loader');
      if(loader) loader.style.display = 'none';

      const inner = document.getElementById('result-card-inner');
      if(inner) inner.style.display = 'block';

      const titleEl = document.getElementById('result-title');
      if (!titleEl) return; // Prevent crashes if elements don't exist

      const matchEl = document.getElementById('result-match');
      const descEl = document.getElementById('result-desc');
      const skillsEl = document.getElementById('result-skills');
      const gapsEl = document.getElementById('result-gaps');
      const roadmapEl = document.getElementById('result-roadmap');

      // Clear contents securely
      titleEl.textContent = data.career;
      matchEl.textContent = data.match;
      descEl.textContent = data.desc;
      skillsEl.textContent = '';
      gapsEl.textContent = '';
      roadmapEl.textContent = '';

      // Prepare Skills
      data.skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        skillsEl.appendChild(span);
      });

      // Prepare Gaps securely
      data.gaps.forEach(gap => {
        const item = document.createElement('div');
        item.className = 'gap-item';
        
        const header = document.createElement('div');
        header.className = 'gap-header';
        const spanN = document.createElement('span');
        spanN.textContent = gap.n;
        const spanP = document.createElement('span');
        spanP.textContent = `Priority: ${gap.l.toUpperCase()}`;
        header.appendChild(spanN);
        header.appendChild(spanP);

        const barBg = document.createElement('div');
        barBg.className = 'gap-bar-bg';
        const barFill = document.createElement('div');
        barFill.className = 'gap-bar-fill';
        const safeWidth = Math.min(100, Math.max(0, Number(gap.p) || 0));
        barFill.setAttribute('data-width', `${safeWidth}%`);
        barBg.appendChild(barFill);

        item.appendChild(header);
        item.appendChild(barBg);
        gapsEl.appendChild(item);
      });

      // Prepare Roadmap securely
      data.roadmap.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'roadmap-step';
        const h4 = document.createElement('h4');
        h4.textContent = `${idx + 1}. ${step.t}`;
        const p = document.createElement('p');
        p.textContent = step.d;
        
        item.appendChild(h4);
        item.appendChild(p);
        roadmapEl.appendChild(item);
      });

      // Export Buttons 
      const downBtn = document.getElementById('download-pdf');
      const shareBtn = document.getElementById('share-card');
      
      const cloneDown = downBtn.cloneNode(true);
      const cloneShare = shareBtn.cloneNode(true);
      downBtn.parentNode.replaceChild(cloneDown, downBtn);
      shareBtn.parentNode.replaceChild(cloneShare, shareBtn);

      /**
       * Lazily loads jsPDF only when the user requests a download,
       * avoiding a 592KB penalty on initial page load.
       */
      cloneDown.addEventListener('click', async () => {
         cloneDown.textContent = 'Generating PDF...';
         cloneDown.disabled = true;
         try {
           const { default: jsPDF } = await import('jspdf');
           const doc = new jsPDF();
           doc.setFontSize(22);
           doc.text(data.career, 20, 30);
           doc.setFontSize(12);
           const splitDesc = doc.splitTextToSize(data.desc, 170);
           doc.text(splitDesc, 20, 45);
           doc.setFontSize(16);
           doc.text('Roadmap', 20, 80);
           doc.setFontSize(10);
           let yOffset = 90;
           data.roadmap.forEach((step, i) => {
             doc.text(`${i + 1}. ${step.t}`, 20, yOffset);
             const txt = doc.splitTextToSize(step.d, 160);
             doc.text(txt, 25, yOffset + 6);
             yOffset += 15 + (txt.length * 4);
           });
           doc.save('Pathwise_Roadmap.pdf');
         } catch (err) {
           console.error('PDF generation failed:', err);
         } finally {
           cloneDown.textContent = 'Download PDF';
           cloneDown.disabled = false;
         }
      });

      /**
       * Lazily loads html2canvas only when the user requests a share image.
       */
      cloneShare.addEventListener('click', async () => {
         cloneShare.textContent = 'Capturing...';
         cloneShare.disabled = true;
         const card = document.getElementById('result-card-inner');
         try {
           const { default: html2canvas } = await import('html2canvas');
           const canvasImg = await html2canvas(card, { backgroundColor: '#060608', useCORS: true });
           canvasImg.toBlob(async (blob) => {
             try {
               const clipItem = new ClipboardItem({ 'image/png': blob });
               await navigator.clipboard.write([clipItem]);
               cloneShare.textContent = '✓ Copied!';
               setTimeout(() => { cloneShare.textContent = 'Share Card'; }, 2000);
             } catch (er) {
               console.warn('Clipboard write failed:', er);
               cloneShare.textContent = 'Share Card';
             }
           });
         } catch (e) {
           console.error('html2canvas failed:', e);
         } finally {
           cloneShare.disabled = false;
         }
      });

      setTimeout(() => {
        document.querySelectorAll('.gap-bar-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width');
        });
        initRadarChart(data);
      }, 100);
    }
});
