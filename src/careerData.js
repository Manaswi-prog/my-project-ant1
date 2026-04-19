export const careerDB = {
  Design: {
    Beginner: {
      career: 'UI/UX Designer',
      match: 87,
      desc: "An incredible entry point into digital design. You'll focus on user flow and visual composition, combining empathy with creativity to build interfaces people love.",
      skills: ['Figma', 'Wireframing', 'Color Theory', 'Typography', 'Prototyping', 'User Research', 'Interaction Design'],
      gaps: [
        { n: 'Advanced Auto Layout', p: 80, l: 'high' },
        { n: 'Design Systems', p: 60, l: 'med' },
        { n: 'CSS Fundamentals', p: 40, l: 'low' }
      ],
      roadmap: [
        { t: 'Learn Figma Basics', d: 'Master frames, constraints, and basic tools in Figma.' },
        { t: 'Study UI Principles', d: 'Understand spacing, typography, and contrast.' },
        { t: 'Copy Work', d: 'Recreate 5 popular apps to build muscle memory.' },
        { t: 'First Project', d: 'Design a simple mobile app from scratch.' },
        { t: 'Build Portfolio', d: 'Publish your case studies on Behance.' }
      ]
    },
    Intermediate: {
      career: 'Product Designer',
      match: 91,
      desc: "Move beyond pure visuals to solve strategic business problems. You'll drive the entire product cycle from discovery to high-fidelity implementation.",
      skills: ['Design Systems', 'Prototyping', 'User Testing', 'Figma', 'Agile', 'Journey Mapping', 'Business Strategy'],
      gaps: [
        { n: 'Quantitative Testing', p: 70, l: 'high' },
        { n: 'Leadership', p: 50, l: 'med' },
        { n: 'HTML/CSS/JS', p: 30, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Design Systems', d: 'Learn to build scalable token architectures.' },
        { t: 'Data Driven Design', d: 'Implement A/B testing methodologies.' },
        { t: 'Cross-functional Comms', d: 'Improve how you handoff to engineering.' },
        { t: 'Advanced Prototyping', d: 'Use tools like Principle or Protopie.' },
        { t: 'Mentorship', d: 'Start mentoring junior designers.' }
      ]
    },
    Advanced: {
      career: 'Design Director',
      match: 94,
      desc: 'Lead teams and define the visual language of an entire organization. You will focus on scaling team culture, visionary roadmaps, and executive influence.',
      skills: ['Team Leadership', 'Design Strategy', 'Executive Comms', 'Resource Allocation', 'Mentorship', 'Brand Identity', 'Design Ops'],
      gaps: [
        { n: 'Budget Management', p: 40, l: 'med' },
        { n: 'Public Speaking', p: 55, l: 'high' },
        { n: 'Organizational Design', p: 30, l: 'low' }
      ],
      roadmap: [
        { t: 'Establish ROI of Design', d: 'Learn to map design metrics to business churn/growth.' },
        { t: 'Design Ops Setup', d: 'Standardize tooling and hiring pipelines.' },
        { t: 'Build the Culture', d: 'Run regular critiques and inspire the team.' },
        { t: 'Manage Up', d: 'Align tightly with the VP of Eng and Product.' },
        { t: 'Industry Presence', d: 'Speak at conferences or write thought leadership.' }
      ]
    }
  },
  Coding: {
    Beginner: {
      career: 'Frontend Developer',
      match: 88,
      desc: "The fastest way to build things you can see and interact with. You'll master the web trio and modern frameworks to craft engaging user experiences.",
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'APIs'],
      gaps: [
        { n: 'State Management', p: 65, l: 'high' },
        { n: 'Performance Tuning', p: 40, l: 'med' },
        { n: 'Testing', p: 25, l: 'low' }
      ],
      roadmap: [
        { t: 'Master JavaScript Foundations', d: 'Understand scope, closures, and async/await deeply.' },
        { t: 'Learn a Framework', d: 'Build projects using React or Vue.' },
        { t: 'CSS Architecture', d: 'Learn Tailwind or CSS Modules for scalability.' },
        { t: 'Consume APIs', d: 'Fetch and display data dynamically.' },
        { t: 'Deploy Projects', d: 'Host apps on Vercel or Netlify.' }
      ]
    },
    Intermediate: {
      career: 'Full-Stack Engineer',
      match: 92,
      desc: "Bridge the gap between client and server. You'll handle databases, APIs, and complex frontend architectures, making you incredibly versatile.",
      skills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Docker', 'TypeScript', 'CI/CD'],
      gaps: [
        { n: 'Microservices', p: 50, l: 'med' },
        { n: 'System Design', p: 60, l: 'high' },
        { n: 'DevOps', p: 35, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Backend Logic', d: 'Build robust REST or GraphQL APIs in Node.' },
        { t: 'Database Tuning', d: 'Learn indexing and complex joins in SQL.' },
        { t: 'Adopt TypeScript', d: 'Add strict typing to your entire stack.' },
        { t: 'Containerization', d: 'Learn Docker to standardize environments.' },
        { t: 'Automate Deployments', d: 'Set up GitHub Actions for CI/CD.' }
      ]
    },
    Advanced: {
      career: 'Staff Software Engineer',
      match: 95,
      desc: "Shape the technical direction of the company. You'll solve the hardest scaling problems, mentor seniors, and define best practices.",
      skills: ['System Architecture', 'Distributed Systems', 'Cloud Infrastructure', 'Mentorship', 'Go/Rust', 'K8s', 'Performance Optimization'],
      gaps: [
        { n: 'Cross-Org Influence', p: 45, l: 'high' },
        { n: 'Writing RFCs', p: 30, l: 'med' },
        { n: 'Business Alignment', p: 55, l: 'low' }
      ],
      roadmap: [
        { t: 'Lead Major Architecture', d: 'Design systems handling millions of requests.' },
        { t: 'Improve DevEx', d: 'Build tooling to speed up the whole engineering org.' },
        { t: 'Technical Writing', d: 'Write clear, concise RFCs for structural decisions.' },
        { t: 'Resolve Migrations', d: 'Lead tricky database or framework migrations safely.' },
        { t: 'Sponsor Talent', d: 'Actively mentor and sponsor junior/mid engineers.' }
      ]
    }
  },
  Business: {
    Beginner: {
      career: 'Business Analyst',
      match: 85,
      desc: "Be the bridge between operations and data. You'll identify process improvements and help stakeholders make data-informed decisions.",
      skills: ['Excel', 'SQL', 'Tableau', 'Process Mapping', 'Requirements Gathering', 'Communication', 'Data Analysis'],
      gaps: [
        { n: 'Advanced SQL', p: 70, l: 'high' },
        { n: 'Python for Data', p: 40, l: 'med' },
        { n: 'Financial Modeling', p: 20, l: 'low' }
      ],
      roadmap: [
        { t: 'Master SQL', d: 'Learn to extract exactly what you need from complex DBs.' },
        { t: 'Visualize Data', d: 'Build compelling dashboards in Tableau or PowerBI.' },
        { t: 'Document Processes', d: 'Create clear, actionable operational maps.' },
        { t: 'Stakeholder Comms', d: 'Practice presenting data concisely to non-technical teams.' },
        { t: 'Identify Inefficiencies', d: 'Find one process to automate or optimize.' }
      ]
    },
    Intermediate: {
      career: 'Product Manager',
      match: 90,
      desc: "The CEO of the product. You'll synthesize user needs, technical constraints, and business goals into a winning roadmap.",
      skills: ['User Research', 'Agile', 'Roadmapping', 'Data Analysis', 'Stakeholder Management', 'UX Principles', 'Go-To-Market'],
      gaps: [
        { n: 'Technical Depth', p: 60, l: 'high' },
        { n: 'Financial Forecasting', p: 45, l: 'med' },
        { n: 'Public Speaking', p: 30, l: 'low' }
      ],
      roadmap: [
        { t: 'Deepen User Empathy', d: 'Conduct regular 1:1 user interviews.' },
        { t: 'Ruthless Prioritization', d: 'Master frameworks like RICE or Kano.' },
        { t: 'Drive Execution', d: 'Improve how you run sprints with engineering.' },
        { t: 'Measure Success', d: 'Define clear KPIs for every feature launch.' },
        { t: 'GTM Alignment', d: 'Work closely with marketing for successful launches.' }
      ]
    },
    Advanced: {
      career: 'Chief of Staff / VP Strategy',
      match: 93,
      desc: "Act as the right-hand to the CEO. You'll drive executive alignment, manage the leadership rhythm, and tackle top strategic priorities.",
      skills: ['Executive Communication', 'Strategic Planning', 'M&A', 'Financial Acumen', 'Change Management', 'Operations', 'Leadership'],
      gaps: [
        { n: 'Board Management', p: 40, l: 'high' },
        { n: 'Industry Networking', p: 55, l: 'med' },
        { n: 'Crisis Management', p: 25, l: 'low' }
      ],
      roadmap: [
        { t: 'Optimize the Executive Team', d: 'Revamp how leadership offsites and meetings run.' },
        { t: 'Drive OKRs', d: 'Own the company-wide goal-setting framework.' },
        { t: 'Tackle Special Projects', d: 'Parachute into struggling teams to fix processes.' },
        { t: 'Board Prep', d: 'Assist in crafting narratives for board meetings.' },
        { t: 'Scale Culture', d: 'Ensure company values remain intact during hypergrowth.' }
      ]
    }
  },
  AI: {
    Beginner: {
      career: 'AI/ML Engineer',
      match: 89,
      desc: "Step into the most exciting field in tech. You'll build models, tune algorithms, and extract predictive power from massive datasets.",
      skills: ['Python', 'PyTorch', 'Scikit-Learn', 'SQL', 'Pandas', 'Math/Stats', 'Jupyter'],
      gaps: [
        { n: 'Deep Learning', p: 65, l: 'high' },
        { n: 'MLOps', p: 30, l: 'med' },
        { n: 'Cloud Deployment', p: 15, l: 'low' }
      ],
      roadmap: [
        { t: 'Solidify Python', d: 'Master data manipulation with Pandas & NumPy.' },
        { t: 'ML Fundamentals', d: 'Understand regression, classification, and clustering.' },
        { t: 'Build Toy Models', d: 'Participate in beginner Kaggle competitions.' },
        { t: 'Learn PyTorch', d: 'Build simple neural networks from scratch.' },
        { t: 'Understand Evaluation', d: 'Master metrics like F1, Precision, Recall.' }
      ]
    },
    Intermediate: {
      career: 'LLM / GenAI Engineer',
      match: 93,
      desc: "Ride the wave of generative AI. You'll leverage foundation models, RAG architectures, and fine-tuning to build intelligence into apps.",
      skills: ['LangChain', 'OpenAI APIs', 'Vector DBs', 'Prompt Engineering', 'Python', 'RAG', 'Fine-Tuning'],
      gaps: [
        { n: 'Custom Model Training', p: 50, l: 'high' },
        { n: 'Evaluation Frameworks', p: 40, l: 'med' },
        { n: 'Ethical AI', p: 20, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Prompting', d: 'Learn advanced techniques like Chain of Thought.' },
        { t: 'Build a RAG system', d: 'Implement semantic search with Pinecone/Weaviate.' },
        { t: 'Agentic Workflows', d: 'Use LangChain to build multi-step agents.' },
        { t: 'Fine-tune a Model', d: 'Use PEFT/LoRA to tune Llama on custom data.' },
        { t: 'Optimize Inference', d: 'Learn quantization and vLLM serving.' }
      ]
    },
    Advanced: {
      career: 'AI Research Engineer',
      match: 96,
      desc: "Push the boundaries of human knowledge. You'll invent new model architectures, write papers, and drastically improve foundational capabilities.",
      skills: ['Deep Learning Theory', 'Distributed Training', 'CUDA', 'PyTorch', 'Linear Algebra', 'Research Methods', 'C++'],
      gaps: [
        { n: 'Hardware Optimization', p: 80, l: 'high' },
        { n: 'Academic Writing', p: 60, l: 'med' },
        { n: 'Managing Clusters', p: 40, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Architecture', d: 'Understand the math inside Transformers deeply.' },
        { t: 'Distributed Systems', d: 'Learn Megatron or DeepSpeed for multi-GPU training.' },
        { t: 'Write Custom Kernels', d: 'Use CUDA to speed up novel layers.' },
        { t: 'Publish Research', d: 'Write papers for NeurIPS or ICML.' },
        { t: 'Pioneer Safety', d: 'Develop new alignment and interpretability techniques.' }
      ]
    }
  },
  Marketing: {
    Beginner: {
      career: 'Digital Marketer',
      match: 84,
      desc: "Learn to capture attention in a noisy world. You'll master campaigns, social channels, and basic conversion metrics.",
      skills: ['Social Media', 'SEO Basics', 'Copywriting', 'Google Ads', 'Analytics', 'Email Marketing', 'Canva'],
      gaps: [
        { n: 'Performance Marketing', p: 65, l: 'high' },
        { n: 'Technical SEO', p: 35, l: 'med' },
        { n: 'HTML/CSS', p: 15, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Copywriting', d: 'Learn to write headlines that convert.' },
        { t: 'Understand SEO', d: 'Learn keyword research and on-page optimization.' },
        { t: 'Run Small Campaigns', d: 'Experiment with small budgets on FB/Google Ads.' },
        { t: 'Analyze Traffic', d: 'Get certified in Google Analytics.' },
        { t: 'Build a Newsletter', d: 'Grow an audience from 0 to 1,000.' }
      ]
    },
    Intermediate: {
      career: 'Growth Marketer',
      match: 91,
      desc: "Treat marketing as an engineering problem. You'll run rapid experiments, optimize funnels, and use data to scale user acquisition.",
      skills: ['A/B Testing', 'Funnel Optimization', 'SQL', 'Paid Acquisition', 'Viral Loops', 'Data Analytics', 'CRM'],
      gaps: [
        { n: 'Advanced Statistics', p: 55, l: 'high' },
        { n: 'Product Strategy', p: 40, l: 'med' },
        { n: 'Brand Positioning', p: 25, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Experimentation', d: 'Design statistically significant A/B tests.' },
        { t: 'Learn SQL', d: 'Query your own data instead of waiting for analysts.' },
        { t: 'Optimize Retention', d: 'Move beyond acquisition to lifecycle marketing.' },
        { t: 'Scale Paid Channels', d: 'Manage budgets of $10k+/month profitably.' },
        { t: 'Build Referral Loops', d: 'Engineer product features that drive virality.' }
      ]
    },
    Advanced: {
      career: 'CMO / Head of Marketing',
      match: 92,
      desc: "Drive the entire narrative and revenue engine. You'll manage millions in budget, define brand identity, and align marketing with enterprise goals.",
      skills: ['Brand Strategy', 'Budget Allocation', 'Team Leadership', 'Executive Comms', 'Market Research', 'PR', 'Revenue Ops'],
      gaps: [
        { n: 'Board Presentations', p: 50, l: 'high' },
        { n: 'M&A Marketing', p: 30, l: 'med' },
        { n: 'Crisis PR', p: 20, l: 'low' }
      ],
      roadmap: [
        { t: 'Brand Architecture', d: 'Define the core story that differentiates the company.' },
        { t: 'Build the Team', d: 'Hire and structure specialized marketing leaders.' },
        { t: 'Align Sales & Marketing', d: 'Eliminate friction between leads and closed deals.' },
        { t: 'Media Relations', d: 'Build relationships with top-tier journalists.' },
        { t: 'Board Reporting', d: 'Translate marketing efforts into enterprise value.' }
      ]
    }
  },
  Other: {
    Beginner: {
      career: 'Technical Project Manager',
      match: 82,
      desc: "Bring order to chaos in engineering teams. You'll run sprints, clear blockers, and ensure complex software ships on time.",
      skills: ['Agile/Scrum', 'Jira', 'Communication', 'Risk Management', 'SDLC', 'Scheduling', 'Facilitation'],
      gaps: [
        { n: 'System Architecture', p: 60, l: 'high' },
        { n: 'Budgeting', p: 35, l: 'med' },
        { n: 'Conflict Resolution', p: 20, l: 'low' }
      ],
      roadmap: [
        { t: 'Master Agile', d: 'Get certified as a Scrum Master.' },
        { t: 'Learn the SDLC', d: 'Understand exactly how software goes from idea to prod.' },
        { t: 'Improve Tracking', d: 'Set up efficient Jira boards for your team.' },
        { t: 'Facilitate Rituals', d: 'Run highly effective standups and retrospectives.' },
        { t: 'Identify Risks', d: 'Learn to spot integration delays before they happen.' }
      ]
    },
    Intermediate: {
      career: 'Solutions Architect',
      match: 88,
      desc: "Design the bridge between enterprise clients and your software. You'll map complex architectures and ensure successful integrations.",
      skills: ['System Design', 'Cloud Computing', 'Client Comms', 'API Design', 'Security', 'Pre-sales', 'Data Modeling'],
      gaps: [
        { n: 'Executive Sales', p: 50, l: 'high' },
        { n: 'Advanced DevOps', p: 45, l: 'med' },
        { n: 'Legal/Compliance', p: 25, l: 'low' }
      ],
      roadmap: [
        { t: 'Get Cloud Certified', d: 'Earn AWS Solutions Architect Associate.' },
        { t: 'Master System Diagrams', d: 'Use tools to visualize complex client networks.' },
        { t: 'Improve Pre-sales', d: 'Learn to demo highly technical features simply.' },
        { t: 'Design Scalable APIs', d: 'Understand REST, GraphQL, and webhook patterns.' },
        { t: 'Security Fundamentals', d: 'Learn about SOC2, SSO, and encryption.' }
      ]
    },
    Advanced: {
      career: 'Engineering Manager',
      match: 90,
      desc: "Move from scaling systems to scaling people. You'll build high-performing engineering teams, manage careers, and ensure delivery via culture.",
      skills: ['People Management', 'Recruiting', '1:1s', 'Performance Reviews', 'Technical Strategy', 'Empathy', 'Process Architecture'],
      gaps: [
        { n: 'Managing Managers', p: 55, l: 'high' },
        { n: 'Budget Planning', p: 40, l: 'med' },
        { n: 'Compensation Strategy', p: 30, l: 'low' }
      ],
      roadmap: [
        { t: 'Master the 1:1', d: 'Focus on career growth, not just status updates.' },
        { t: 'Build a Hiring Pipeline', d: 'Improve how your team interviews and closes talent.' },
        { t: 'Performance Management', d: 'Learn to handle PIPs and promotions fairly.' },
        { t: 'Protect the Team', d: 'Shield engineers from corporate noise.' },
        { t: 'Define Tech Debt Strategy', d: 'Balance feature delivery with system health.' }
      ]
    }
  }
};

export function adjustScore(baseScore, hoursPerWeek) {
  let score = baseScore;
  if (hoursPerWeek >= 20) {score = Math.min(99, score + 4);}
  if (hoursPerWeek <= 5)  {score = Math.max(70, score - 8);}
  return score;
}

export function getCareerData(currentRole, dreamCareer, currentSkills, timeAvailable) {
  const combined = `${currentRole} ${dreamCareer} ${currentSkills}`.toLowerCase();
  let interest = 'Other';
  if (combined.match(/design|ux|ui|figma|creative|art/)) {interest = 'Design';}
  else if (combined.match(/code|dev|engineer|react|js|html/)) {interest = 'Coding';}
  else if (combined.match(/business|product|pm|manage|strategy/)) {interest = 'Business';}
  else if (combined.match(/ai|ml|data|python|model/)) {interest = 'AI';}
  else if (combined.match(/market|seo|growth|ads|copy/)) {interest = 'Marketing';}
  
  let skillLevel = 'Beginner';
  if (combined.match(/lead|director|head|senior|advanced|chief/)) {skillLevel = 'Advanced';}
  else if (combined.match(/mid|intermediate|manager/)) {skillLevel = 'Intermediate';}

  const data = careerDB[interest]?.[skillLevel] || careerDB['Other']['Beginner'];
  
  // timeAvailable is in months now (1-60). Convert loosely to map to the old hours impact
  const hoursProxy = timeAvailable > 24 ? 25 : timeAvailable < 3 ? 4 : 10;
  
  return {
    ...data,
    match: adjustScore(data.match, hoursProxy)
  };
}
