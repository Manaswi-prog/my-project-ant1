/**
 * @file main.js
 * @description Core client-side orchestrator for Pathwise AI. Handles form inputs, Gemini API execution, and results rendering.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCareerData } from "./careerData.js";
import { initRadarChart, updateRadarChart } from "./radar.js";
import { saveSession, getSessions, clearHistory } from "./firebase.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/** 
 * Unique anonymous user ID bound to LocalStorage 
 * @type {string} 
 */
let userId = localStorage.getItem('pw_user_id');
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem('pw_user_id', userId);
}

document.addEventListener('DOMContentLoaded', () => {
    
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
    let state = {
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
      if(!sessionList) return;
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
      state.role = roleInput?.value.trim() || '';
      state.dream = dreamInput?.value.trim() || '';
      state.skills = skillsInput?.value.trim() || '';
      
      if (!state.role || !state.dream) {
        if(errorMsg) errorMsg.textContent = 'Please enter your current role and dream career to continue.';
        return;
      }

      try {
        generateBtn.disabled = true;
        if(demoBtn) demoBtn.disabled = true;
        
        generateBtn.textContent = `Consulting AI...`; // Changed to simple safe text
        generateBtn.setAttribute('aria-busy', 'true');
        if (errorMsg) errorMsg.textContent = '';
        
        // Show shimmer loader
        if(resultSection) {
            resultSection.classList.remove('hidden');
            const inner = document.getElementById('result-card-inner');
            if(inner) {
              inner.textContent = ''; // clear securely
              const classes = ['title', 'width:40%', 'circle', '', '', ''];
              classes.forEach(c => {
                const b = document.createElement('div');
                b.className = `shimmer shimmer-block${c ? ' ' + c.split(':')[0] : ''}`;
                if(c === 'width:40%') b.style.width = '40%';
                inner.appendChild(b);
              });
            }
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
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = buildGeminiPrompt(state.role, state.dream, state.skills, state.time);
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            resultData = JSON.parse(text.replace(/```json|```/g, '').trim());
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
          if(resultSection) resultSection.classList.add('hidden');
        }
        
      } catch (err) {
        console.error('Generation Error:', err);
        if(errorMsg) errorMsg.textContent = 'An error occurred during analysis.';
        resultData = getCareerData(state.role, state.dream, state.skills, state.time);
        renderResult(resultData); // Try Fallback
      } finally {
        generateBtn.disabled = false;
        if(demoBtn) demoBtn.disabled = false;
        generateBtn.textContent = '✦ Regenerate Path';
        generateBtn.removeAttribute('aria-busy');
      }
    };

    if (generateBtn) {
      generateBtn.addEventListener('click', runGeneration);
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
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
        hero3dContent.style.transform = `translateZ(0px)`;
        hero3dHands.style.transform = `translateZ(0px)`;
      });
      hero3dContent.style.transition = 'transform 0.1s ease-out';
      hero3dHands.style.transition = 'transform 0.1s ease-out';
    }

    /**
     * Manipulates the DOM directly and securely to display the final result payload
     * @param {Object} data Schema-compliant JSON data
     */
    function renderResult(data) {
      if (!resultSection) return;
      resultSection.classList.remove('hidden');

      const titleEl = document.getElementById('result-title');
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
        barFill.setAttribute('data-width', `${gap.p}%`);
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

      cloneDown.addEventListener('click', () => {
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

      cloneShare.addEventListener('click', async () => {
         const card = document.getElementById('result-card-inner');
         try {
           const canvasImg = await html2canvas(card, { backgroundColor: '#060608', useCORS: true });
           canvasImg.toBlob(async (blob) => {
             try {
                const item = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([item]);
                alert('Copied to clipboard!');
             } catch(er) {
                alert('Clipboard writing failed. Ensure HTTPS or secure context.');
             }
           });
         } catch(e) {
             console.error(e);
             alert('Failed to generate image.');
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
