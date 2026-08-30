import React, { useState } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Megaphone,
  Briefcase,
  PenTool,
  Search,
  Code,
  ShoppingBag,
  Headphones,
  BarChart3,
  Building2,
  Bot,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import {
  Assistant,
  AuthorityLevel,
  UserProfile,
  WorkingStyleIncomplete,
  WorkingStyleRecommendation,
} from '../../types';
import { assistantTemplates } from '../../data/initialData';
import { NavView } from '../Sidebar';

interface CreateAssistantWizardProps {
  userProfile: UserProfile;
  onSaveAssistant: (assistant: Assistant, updateProfile?: Partial<UserProfile>) => void;
  onCancel: () => void;
  onNavigate: (view: NavView) => void;
}

const ASSISTANT_TYPES = [
  {
    id: 'marketing',
    title: 'Marketing Assistant',
    role: 'Digital Marketing & Growth Specialist',
    icon: Megaphone,
    description: 'Specializes in Meta Ads, copywriting, competitor research, and campaign strategy.',
    recommendedSkills: ['Meta Ads Analyst', 'Competitor Research', 'Direct Response Copywriting', 'Landing Page Audit'],
    defaultResponsibilities: [
      'Meta Ads Performance Analysis',
      'Competitor Landing Page Research',
      'High-Converting Ad Copywriting',
      'Content Planning & Repurposing',
      'Weekly Marketing Reporting',
    ],
    defaultMission: 'Help manage and scale digital marketing activities and acquisition channels profitably.',
  },
  {
    id: 'executive',
    title: 'Executive Assistant',
    role: 'Executive & Operations Chief of Staff',
    icon: Briefcase,
    description: 'Organizes executive briefings, inbox drafts, calendar planning, and priority task triage.',
    recommendedSkills: ['Email Drafting', 'Meeting Briefing', 'Task Triage', 'Daily Schedule Planner'],
    defaultResponsibilities: [
      'Drafting executive emails & replies',
      'Daily morning executive briefings',
      'Calendar planning and priority triage',
      'Meeting prep & agenda creation',
    ],
    defaultMission: 'Maximize owner productivity, eliminate administrative noise, and streamline operations.',
  },
  {
    id: 'content',
    title: 'Content Assistant',
    role: 'Content Strategist & Copywriter',
    icon: PenTool,
    description: 'Generates viral hooks, social media captions, newsletters, and multi-format content.',
    recommendedSkills: ['Viral Hook Engine', 'Social Media Captioning', 'Long-form Repurposing', 'Newsletter Drafting'],
    defaultResponsibilities: [
      'Trend & angle research',
      'Social media captions (LinkedIn, IG, X)',
      'Newsletter drafting',
      'Content repurposing',
    ],
    defaultMission: 'Produce consistent, high-converting content aligned with brand positioning.',
  },
  {
    id: 'research',
    title: 'Research Assistant',
    role: 'Market & Deep Research Analyst',
    icon: Search,
    description: 'Performs deep web research, competitor tear-downs, market synthesis, and fact validation.',
    recommendedSkills: ['Deep Web Research', 'Source Verification', 'Competitor Intelligence', 'Executive Synthesis'],
    defaultResponsibilities: [
      'Market research & trend analysis',
      'Competitor feature & pricing tear-downs',
      'Synthesizing long reports into key takeaways',
    ],
    defaultMission: 'Deliver rigorously grounded research reports and actionable competitive intelligence.',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Assistant',
    role: 'Online Store Operations & Conversion Specialist',
    icon: ShoppingBag,
    description: 'Optimizes product descriptions, customer reviews analysis, promotion planning, and stock tracking.',
    recommendedSkills: ['Product Description Master', 'Customer Review Analyzer', 'Promo Planning'],
    defaultResponsibilities: [
      'Product copywriting & SEO titles',
      'Customer review sentiment analysis',
      'Promotional campaign structuring',
    ],
    defaultMission: 'Drive e-commerce conversions, boost average order value, and optimize product listings.',
  },
  {
    id: 'developer',
    title: 'Developer Assistant',
    role: 'Software Architect & Code Assistant',
    icon: Code,
    description: 'Assists with code reviews, API design, architecture troubleshooting, and technical documentation.',
    recommendedSkills: ['Code Review', 'API Architecture', 'Bug Diagnosis', 'Technical Docs'],
    defaultResponsibilities: [
      'Code review & refactoring',
      'API schema and data model design',
      'Technical architecture troubleshooting',
    ],
    defaultMission: 'Accelerate engineering speed, enforce clean architecture, and draft rock-solid technical specs.',
  },
  {
    id: 'support',
    title: 'Customer Support Assistant',
    role: 'Customer Success & Support Specialist',
    icon: Headphones,
    description: 'Drafts helpful support responses, maintains FAQ knowledge, and escalates critical complaints.',
    recommendedSkills: ['Support Ticket Drafting', 'FAQ Knowledge Recall', 'Complaint Resolution'],
    defaultResponsibilities: [
      'Customer inquiry troubleshooting',
      'Drafting empathetic support answers',
      'Identifying repetitive support bottlenecks',
    ],
    defaultMission: 'Provide rapid, accurate, and empathetic assistance to customers 24/7.',
  },
  {
    id: 'data',
    title: 'Data Analyst Assistant',
    role: 'Business Intelligence & Data Analyst',
    icon: BarChart3,
    description: 'Transforms spreadsheets, CSVs, and metrics into actionable business intelligence.',
    recommendedSkills: ['Spreadsheet Analysis', 'Anomaly Detection', 'Cohort Analysis'],
    defaultResponsibilities: [
      'Sales and revenue data synthesis',
      'Anomaly and leakage detection',
      'Weekly KPI scorecard generation',
    ],
    defaultMission: 'Uncover actionable growth levers and revenue leakages through data analysis.',
  },
  {
    id: 'business',
    title: 'Business Assistant',
    role: 'General Business Strategy & Operations',
    icon: Building2,
    description: 'All-around assistant for business strategy, document drafting, and workflow coordination.',
    recommendedSkills: ['Strategic Planning', 'Document Drafting', 'SOP Design'],
    defaultResponsibilities: [
      'Business document drafting',
      'Decision matrix preparation',
      'Operational coordination',
    ],
    defaultMission: 'Support overall business strategy, operations, and growth execution.',
  },
  {
    id: 'custom',
    title: 'Custom Assistant',
    role: 'Custom AI Employee',
    icon: Bot,
    description: 'Build a completely custom assistant from scratch with tailored rules and skills.',
    recommendedSkills: ['Custom Task Workflow', 'Data Processing'],
    defaultResponsibilities: ['Custom Task Execution', 'Workflow Optimization'],
    defaultMission: 'Assist the owner in specialized custom workflows and business processes.',
  },
];

export const CreateAssistantWizard: React.FC<CreateAssistantWizardProps> = ({
  userProfile,
  onSaveAssistant,
  onCancel,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [createdAssistant, setCreatedAssistant] = useState<Assistant | null>(null);

  // Form State
  const [selectedType, setSelectedType] = useState<string>('marketing');
  const [assistantName, setAssistantName] = useState<string>('ARKA');
  const [assistantRole, setAssistantRole] = useState<string>('Digital Marketing Assistant');
  const [mission, setMission] = useState<string>(
    'Help Pak Ilham manage, analyze, and optimize digital marketing activities profitably.'
  );
  const [worksFor, setWorksFor] = useState<'ME' | 'MY_TEAM' | 'MY_BUSINESS' | 'MY_CLIENTS'>('ME');
  const [language, setLanguage] = useState<'INDONESIAN' | 'ENGLISH' | 'MIXED' | 'OTHER'>('INDONESIAN');

  // User Profile
  const [userName, setUserName] = useState<string>(userProfile.name);
  const [userRole, setUserRole] = useState<string>(userProfile.role);
  const [company, setCompany] = useState<string>(userProfile.company);
  const [industry, setIndustry] = useState<string>(userProfile.industry);
  const [products, setProducts] = useState<string>(userProfile.products);
  const [targetMarket, setTargetMarket] = useState<string>(userProfile.targetMarket);
  const [website, setWebsite] = useState<string>(userProfile.website);
  const [addressStyle, setAddressStyle] = useState<string>(userProfile.addressStyle || 'Pak Ilham');
  const [communicationPref, setCommunicationPref] = useState<'VERY_CONCISE' | 'CONCISE' | 'BALANCED' | 'DETAILED'>(
    userProfile.communicationPref || 'CONCISE'
  );
  const [responseStyles, setResponseStyles] = useState<string[]>(userProfile.responseStyles || [
    'Give recommendation first',
    'Use bullet points',
    'Use tables for comparison',
    'Explain reasoning',
    'Ask before taking actions',
  ]);

  // Responsibilities
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Meta Ads Performance Analysis',
    'Competitor Landing Page Research',
    'High-Converting Ad Copywriting',
    'Content Planning & Repurposing',
    'Weekly Marketing Reporting',
  ]);
  const [customResponsibilityInput, setCustomResponsibilityInput] = useState<string>('');

  // Working Style
  const [incompleteInfo, setIncompleteInfo] = useState<WorkingStyleIncomplete>('ASK_FIRST');
  const [recommendationStyle, setRecommendationStyle] = useState<WorkingStyleRecommendation>('THREE_OPTIONS');

  // Authority Level
  const [authorityLevel, setAuthorityLevel] = useState<AuthorityLevel>('SEMI_AUTONOMOUS');

  // Handler when selecting a type
  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    const found = ASSISTANT_TYPES.find((t) => t.id === typeId);
    if (found) {
      setAssistantRole(found.role);
      setResponsibilities(found.defaultResponsibilities);
      setMission(found.defaultMission);
      if (typeId === 'marketing') setAssistantName('ARKA');
      else if (typeId === 'executive') setAssistantName('SENA');
      else if (typeId === 'research') setAssistantName('NARA');
      else if (typeId === 'content') setAssistantName('VIRA');
      else if (typeId === 'developer') setAssistantName('DEVON');
      else setAssistantName('ALEX');
    }
  };

  const handleAddCustomResponsibility = () => {
    if (customResponsibilityInput.trim()) {
      setResponsibilities([...responsibilities, customResponsibilityInput.trim()]);
      setCustomResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const toggleResponseStyle = (style: string) => {
    if (responseStyles.includes(style)) {
      setResponseStyles(responseStyles.filter((s) => s !== style));
    } else {
      setResponseStyles([...responseStyles, style]);
    }
  };

  const handleCreateAssistant = () => {
    const avatarUrl =
      selectedType === 'marketing'
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
        : selectedType === 'executive'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : selectedType === 'research'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newAssistant: Assistant = {
      id: `asst_${Date.now()}`,
      name: assistantName.trim() || 'ARKA',
      role: assistantRole.trim() || 'AI Assistant',
      mission: mission.trim() || 'Help with business workflows.',
      worksFor,
      language,
      avatar: avatarUrl,
      status: 'TRAINING',
      trainingProgress: 65,
      testScore: 78,
      workingStyle: {
        incompleteInfo,
        recommendationStyle,
        riskBehavior: 'ALWAYS_ASK_APPROVAL',
        confidenceBehavior: 'EXPLAIN_UNCERTAINTY',
      },
      authorityLevel,
      responsibilities,
      hermesConfig: {
        endpoint: 'http://localhost:8080/v1/agents',
        hasApiKey: false,
        isConnected: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProfile: Partial<UserProfile> = {
      name: userName,
      role: userRole,
      company,
      industry,
      products,
      targetMarket,
      website,
      addressStyle,
      communicationPref,
      responseStyles,
    };

    onSaveAssistant(newAssistant, updatedProfile);
    setCreatedAssistant(newAssistant);
    setIsCreated(true);
  };

  // Success Celebration View
  if (isCreated && createdAssistant) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Hiring Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {createdAssistant.name} is Created! 🎉
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            {createdAssistant.name} is now your official {createdAssistant.role}. Now let&apos;s begin structured training.
          </p>
        </div>

        {/* Recommended Next Steps Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-left shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Recommended Next Steps:</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <strong className="text-indigo-950">Teach {createdAssistant.name} about your business</strong>
                <p className="text-indigo-800">Add price lists, value proposition, and communication rules.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <strong className="text-slate-900">Create the first SOP</strong>
                <p className="text-slate-600">Establish standard operating procedures for core tasks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div>
                <strong className="text-slate-900">Run the first test in Test Lab</strong>
                <p className="text-slate-600">Simulate a prompt and calibrate behavior rules.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('training')}
            id="btn-wizard-start-training"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>START TRAINING &rarr;</span>
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            id="btn-wizard-open-workspace"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition"
          >
            Open Assistant Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Wizard Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            STEP {step} OF 7
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: CHOOSE TYPE */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What kind of AI Assistant do you want?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a specialized assistant archetype. You can customize all responsibilities and skills in the next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSISTANT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  id={`type-card-${type.id}`}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{type.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{type.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                      Recommended Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {type.recommendedSkills.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[130px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: IDENTITY */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Assistant Identity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Give your AI employee a name, role, and overarching mission.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assistant Name
              </label>
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="e.g. ARKA"
                id="input-assistant-name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Give your assistant a clean, memorable name.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role Title
              </label>
              <input
                type="text"
                value={assistantRole}
                onChange={(e) => setAssistantRole(e.target.value)}
                placeholder="e.g. Digital Marketing Assistant"
                id="input-assistant-role"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Mission
              </label>
              <textarea
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g. Help me manage and improve digital marketing activities profitably."
                id="input-assistant-mission"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Who does this Assistant work for?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ME', label: 'Me' },
                    { id: 'MY_TEAM', label: 'My Team' },
                    { id: 'MY_BUSINESS', label: 'My Business' },
                    { id: 'MY_CLIENTS', label: 'My Clients' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setWorksFor(option.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                        worksFor === option.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'INDONESIAN', label: 'Bahasa Indonesia' },
                    { id: 'ENGLISH', label: 'English' },
                    { id: 'MIXED', label: 'Mixed (Bilingual)' },
                    { id: 'OTHER', label: 'Other' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLanguage(option.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                        language === option.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ABOUT THE USER */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Introduce yourself to your Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your assistant needs business context and communication preferences to provide tailored work.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Ilham Yogaswara"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  How should assistant address you?
                </label>
                <input
                  type="text"
                  value={addressStyle}
                  onChange={(e) => setAddressStyle(e.target.value)}
                  placeholder="e.g. Pak Ilham"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Business Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. BuildRAB AI Solutions"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Industry / Field
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. SaaS / Construction Tech"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Products / Services Offered & Price
              </label>
              <input
                type="text"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                placeholder="e.g. BuildRAB AI Software (Rp149.000 / month)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Market / Ideal Customer
              </label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="e.g. Contractors, Project Estimators, Developers"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Communication Preference */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Communication Conciseness Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'VERY_CONCISE', label: 'Very Concise' },
                  { id: 'CONCISE', label: 'Concise (Recommended)' },
                  { id: 'BALANCED', label: 'Balanced' },
                  { id: 'DETAILED', label: 'Detailed' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCommunicationPref(p.id as any)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition ${
                      communicationPref === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Style Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Response Style Rules
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Give recommendation first',
                  'Use bullet points',
                  'Use tables for comparison',
                  'Explain reasoning',
                  'Ask before taking actions',
                  'Give concrete examples',
                  'Avoid technical language',
                ].map((style) => {
                  const isChecked = responseStyles.includes(style);
                  return (
                    <div
                      key={style}
                      onClick={() => toggleResponseStyle(style)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs font-medium transition ${
                        isChecked
                          ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                          : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{style}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: JOB RESPONSIBILITIES */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What should this Assistant help you with?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select and customize core responsibilities. Each responsibility becomes a candidate for future skills and SOPs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {responsibilities.map((resp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span>{resp}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveResponsibility(index)}
                    className="text-slate-400 hover:text-red-600 transition p-1"
                    title="Remove responsibility"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Responsibility */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customResponsibilityInput}
                onChange={(e) => setCustomResponsibilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomResponsibility();
                  }
                }}
                placeholder="e.g. Landing Page Conversion Rate Audit"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomResponsibility}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Responsibility</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: WORKING STYLE */}
      {step === 5 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Working Style & Decision Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure how your assistant resolves ambiguity, handles risk, and presents solutions.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. When information is incomplete, should your assistant:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'ASK_FIRST',
                    label: 'A. Ask me first before proceeding',
                    desc: 'Safest approach; avoids making unverified assumptions.',
                  },
                  {
                    id: 'ASSUME_EXPLAIN',
                    label: 'B. Make a reasonable assumption and explain it clearly',
                    desc: 'Faster execution; documents assumptions transparently in the output.',
                  },
                  {
                    id: 'RESEARCH_FIRST',
                    label: 'C. Research external web data first before asking',
                    desc: 'Proactive; checks online sources to fill in gaps automatically.',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setIncompleteInfo(opt.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      incompleteInfo === opt.id
                        ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-xs">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. When providing recommendations:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'BEST_ONE',
                    label: 'A. Give one best recommendation directly',
                    desc: 'Decisive and fast; no multiple choices.',
                  },
                  {
                    id: 'THREE_OPTIONS',
                    label: 'B. Give 3 prioritized options (Recommended)',
                    desc: 'Balanced; shows primary pick with 2 alternatives.',
                  },
                  {
                    id: 'FULL_COMPARISON',
                    label: 'C. Give full comparison matrix with pros/cons',
                    desc: 'Comprehensive; ideal for strategic business evaluations.',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setRecommendationStyle(opt.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      recommendationStyle === opt.id
                        ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-xs">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Built-in Safeguards Summary */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Automatic Safety Guardrails:</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                &bull; <strong>Risk Behavior:</strong> Actions with external impact or ad budget changes always require confirmation.
              </p>
              <p className="text-slate-600 text-[11px]">
                &bull; <strong>Confidence Behavior:</strong> When confidence is low, the assistant will explicitly explain uncertainty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: AUTHORITY LEVEL */}
      {step === 6 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              How much freedom should your Assistant have?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose an authority level. You can fine-tune specific actions individually in the Authority Center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ASSIST MODE */}
            <div
              onClick={() => setAuthorityLevel('ASSIST_MODE')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                authorityLevel === 'ASSIST_MODE'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">ASSIST MODE</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Assistant only researches, analyzes, drafts, and recommends. Never executes external actions.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600">
                <span className="font-semibold text-blue-700">Highest Guardrail</span>
                <p className="text-[10px] text-slate-400">100% read-only drafting</p>
              </div>
            </div>

            {/* SEMI-AUTONOMOUS */}
            <div
              onClick={() => setAuthorityLevel('SEMI_AUTONOMOUS')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between relative ${
                authorityLevel === 'SEMI_AUTONOMOUS'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                Default
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">SEMI-AUTONOMOUS</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Assistant may execute low-risk actions (scheduled reports, data scans). Sensitive actions require approval.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600">
                <span className="font-semibold text-emerald-700">Balanced Productivity</span>
                <p className="text-[10px] text-slate-400">Approval gates on risky tasks</p>
              </div>
            </div>

            {/* AUTONOMOUS */}
            <div
              onClick={() => setAuthorityLevel('AUTONOMOUS')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                authorityLevel === 'AUTONOMOUS'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">AUTONOMOUS</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Assistant may run approved routine workflows automatically. Still restricted from financial & secret changes.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600">
                <span className="font-semibold text-amber-700">Hands-Free Automation</span>
                <p className="text-[10px] text-slate-400">For experienced workflows</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: REVIEW */}
      {step === 7 && (
        <div className="space-y-6 animate-fadeIn bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Review Assistant Blueprint
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify your AI employee blueprint before generating initial skills and memory configuration.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assistant Name</div>
                <div className="text-base font-bold text-slate-900">{assistantName}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</div>
                <div className="text-xs font-semibold text-indigo-700">{assistantRole}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Mission</div>
              <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                &ldquo;{mission}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Working For</span>
                <div className="font-bold text-slate-800">{worksFor}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Language</span>
                <div className="font-bold text-slate-800">{language}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Authority</span>
                <div className="font-bold text-emerald-700">{authorityLevel}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Responsibilities</span>
                <div className="font-bold text-indigo-700">{responsibilities.length} Core Areas</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Core Responsibilities List
              </div>
              <div className="flex flex-wrap gap-1.5">
                {responsibilities.map((r, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            id="btn-wizard-prev"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 font-medium text-xs border border-slate-200 transition"
          >
            Cancel
          </button>
        )}

        {step < 7 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            id="btn-wizard-next"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCreateAssistant}
            id="btn-wizard-submit-create"
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>CREATE ASSISTANT</span>
          </button>
        )}
      </div>
    </div>
  );
};
