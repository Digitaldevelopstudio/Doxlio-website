import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Wrench, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Edit3, 
  Check, 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  Layout, 
  Palette,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
    photoUrl: string;
    showPhoto: boolean;
  };
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    location: string;
    gradYear: string;
    honors: string;
  }[];
  skills: string[];
  languages: {
    id: string;
    name: string;
    level: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
}

const SAMPLE_RESUME: ResumeData = {
  personal: {
    fullName: 'Alexander Vance',
    jobTitle: 'Senior Systems Architect & Engineering Lead',
    email: 'alex.vance@example.com',
    phone: '+1 (415) 890-2341',
    location: 'San Francisco, CA',
    website: 'alexvance.dev',
    linkedin: 'linkedin.com/in/alexandervance',
    summary: 'Accomplished engineering architect with 9+ years of experience building high-throughput client-side productivity software, zero-trust cloud pipelines, and scalable distributed web architectures. Proven record leading multidisciplinary teams to ship mission-critical software.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    showPhoto: true,
  },
  experience: [
    {
      id: '1',
      role: 'Principal Software Architect',
      company: 'Quantum Document Cloud',
      location: 'San Francisco, CA',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: '• Spearheaded client-side high-fidelity document transformation engine reducing server bandwidth by 82%.\n• Architected zero-retention privacy protocols compliant with SOC 2 Type II and GDPR.\n• Mentored 14 senior and staff engineers across core application engineering initiatives.',
    },
    {
      id: '2',
      role: 'Lead Systems Engineer',
      company: 'Apex Data Labs',
      location: 'New York, NY',
      startDate: '2020',
      endDate: '2023',
      current: false,
      description: '• Engineered high-performance document parsing pipeline processing 6M daily files with 99.98% reliability.\n• Reduced frontend cold-start bundle latency from 1.8s to 320ms through modular WebAssembly architecture.\n• Collaborated with product and security leadership to design client-side optical verification.',
    },
    {
      id: '3',
      role: 'Senior Full-Stack Developer',
      company: 'Starlight Interactive',
      location: 'Boston, MA',
      startDate: '2017',
      endDate: '2020',
      current: false,
      description: '• Built responsive SaaS workflow editors utilized by 250,000+ monthly active business professionals.\n• Authored automated unit and integration suites achieving 94% test branch coverage.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      location: 'Stanford, CA',
      gradYear: '2017',
      honors: 'Specialization in Distributed Systems & Security',
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Computer Engineering',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      gradYear: '2015',
      honors: 'Summa Cum Laude, Dean’s Honors List',
    },
  ],
  skills: [
    'System Architecture',
    'TypeScript & React 19',
    'Client-Side Computer Vision',
    'Distributed Systems',
    'WebAssembly / C++',
    'REST & GraphQL APIs',
    'Cloud Security & Privacy',
    'Performance Optimization',
    'CI/CD & DevOps',
  ],
  languages: [
    { id: '1', name: 'English', level: 'Native / Bilingual' },
    { id: '2', name: 'German', level: 'Professional Working' },
    { id: '3', name: 'French', level: 'Intermediate' },
  ],
  certifications: [
    { id: '1', name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', date: '2025' },
    { id: '2', name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2', date: '2024' },
  ],
};

export const ResumeBuilderView: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME);
  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [newSkill, setNewSkill] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Profile photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setResume((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          photoUrl: event.target?.result as string,
          showPhoto: true,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Add / remove work experience
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          role: 'Role Title',
          company: 'Company Name',
          location: 'Location',
          startDate: '2024',
          endDate: 'Present',
          current: true,
          description: '• Key achievement or primary responsibility in this position.',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  // Add / remove education
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: 'Degree / Certificate',
          school: 'Institution / University',
          location: 'City, Country',
          gradYear: '2024',
          honors: '',
        },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Skills
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!newSkill.trim()) return;
    if (!resume.skills.includes(newSkill.trim())) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Languages
  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [...prev.languages, { id: Date.now().toString(), name: 'Language', level: 'Conversational' }],
    }));
  };

  const removeLanguage = (id: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  };

  // Certifications
  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id: Date.now().toString(), name: 'Certificate Name', issuer: 'Issuing Body', date: '2026' }],
    }));
  };

  const removeCertification = (id: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Print & PDF Export
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generate crisp A4 printable PDF using standard dimensions
    const printWin = window.open('', '_blank');
    if (!printWin) {
      handlePrint();
      return;
    }

    const previewHtml = previewRef.current?.innerHTML || '';
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.personal.fullName} - Resume</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background: #fff; }
            .print-wrapper { width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; }
          </style>
          ${styles}
        </head>
        <body>
          <div class="print-wrapper">${previewHtml}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Doxlio Tools</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Resume & CV Builder</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Professional Resume & CV Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Craft modern, ATS-friendly resumes with photo support, 3 professional templates, live preview, and A4 PDF export.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setResume(SAMPLE_RESUME)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Load sample professional data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Load Sample
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Mobile Screen Tab Switcher */}
      <div className="lg:hidden flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'edit'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Details
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================== */}
        {/* LEFT COLUMN: EDITABLE SECTIONS FORM */}
        {/* ==================================================== */}
        <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Template & Color Selector Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 dark:text-white">Template:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  {(['modern', 'executive', 'minimal'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`px-3 py-1 rounded-md capitalize font-semibold transition-colors ${
                        template === t
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Accent:</span>
                <div className="flex items-center gap-1.5">
                  {['#2563eb', '#0f766e', '#4f46e5', '#7c3aed', '#0f172a'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        accentColor === color ? 'scale-115 border-white ring-2 ring-blue-500' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Personal & Contact Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Personal Information & Profile Photo
            </h3>

            {/* Photo Upload & Toggle */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                {resume.personal.photoUrl ? (
                  <img src={resume.personal.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {resume.personal.photoUrl && (
                    <button
                      onClick={() => setResume((prev) => ({ ...prev, personal: { ...prev.personal, photoUrl: '', showPhoto: false } }))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={resume.personal.showPhoto}
                    onChange={(e) => setResume((prev) => ({ ...prev, personal: { ...prev.personal, showPhoto: e.target.checked } }))}
                    className="rounded accent-blue-600"
                  />
                  <span>Show photo on resume layout</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Full Name:</label>
                <input
                  type="text"
                  value={resume.personal.fullName}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, fullName: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Job Title / Headline:</label>
                <input
                  type="text"
                  value={resume.personal.jobTitle}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, jobTitle: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Email:</label>
                <input
                  type="email"
                  value={resume.personal.email}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, email: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Phone:</label>
                <input
                  type="text"
                  value={resume.personal.phone}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, phone: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">Location (City, Country):</label>
                <input
                  type="text"
                  value={resume.personal.location}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, location: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold">LinkedIn / Portfolio:</label>
                <input
                  type="text"
                  value={resume.personal.linkedin}
                  onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, linkedin: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Professional Summary / Bio:</label>
              <textarea
                rows={3}
                value={resume.personal.summary}
                onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, summary: e.target.value } })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-1 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Work Experience */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Work Experience ({resume.experience.length})
              </h3>
              <button
                onClick={addExperience}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>

            <div className="space-y-4">
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Position #{idx + 1}</span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[idx].role = e.target.value;
                        setResume({ ...resume, experience: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[idx].company = e.target.value;
                        setResume({ ...resume, experience: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Start (e.g. 2022)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[idx].startDate = e.target.value;
                        setResume({ ...resume, experience: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="End (e.g. Present)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[idx].endDate = e.target.value;
                        setResume({ ...resume, experience: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Bullet points & impact achievements..."
                    value={exp.description}
                    onChange={(e) => {
                      const next = [...resume.experience];
                      next[idx].description = e.target.value;
                      setResume({ ...resume, experience: next });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Education ({resume.education.length})
              </h3>
              <button
                onClick={addEducation}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {resume.education.map((edu, idx) => (
                <div key={edu.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Degree #{idx + 1}</span>
                    <button onClick={() => removeEducation(edu.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Degree / Major"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[idx].degree = e.target.value;
                        setResume({ ...resume, education: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="University / College"
                      value={edu.school}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[idx].school = e.target.value;
                        setResume({ ...resume, education: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.gradYear}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[idx].gradYear = e.target.value;
                        setResume({ ...resume, education: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Honors / Minor"
                      value={edu.honors}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[idx].honors = e.target.value;
                        setResume({ ...resume, education: next });
                      }}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Skills & Competencies */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              Skills & Expertise ({resume.skills.length})
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Distributed Systems)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Languages & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Languages */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-blue-600" /> Languages
                </span>
                <button onClick={addLanguage} className="text-[11px] text-blue-600 font-semibold hover:underline">
                  + Add
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {resume.languages.map((lang, idx) => (
                  <div key={lang.id} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => {
                        const next = [...resume.languages];
                        next[idx].name = e.target.value;
                        setResume({ ...resume, languages: next });
                      }}
                      className="flex-1 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={lang.level}
                      onChange={(e) => {
                        const next = [...resume.languages];
                        next[idx].level = e.target.value;
                        setResume({ ...resume, languages: next });
                      }}
                      className="w-24 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                    />
                    <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-500">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" /> Certifications
                </span>
                <button onClick={addCertification} className="text-[11px] text-blue-600 font-semibold hover:underline">
                  + Add
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {resume.certifications.map((cert, idx) => (
                  <div key={cert.id} className="space-y-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const next = [...resume.certifications];
                          next[idx].name = e.target.value;
                          setResume({ ...resume, certifications: next });
                        }}
                        className="flex-1 p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px]"
                      />
                      <button onClick={() => removeCertification(cert.id)} className="text-slate-400 hover:text-red-500 pl-2">
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: LIVE REAL-TIME RESUME PREVIEW */}
        {/* ==================================================== */}
        <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-slate-200/80 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-inner flex flex-col items-center">
            {/* Preview Toolbar */}
            <div className="w-full flex items-center justify-between mb-4 text-xs text-slate-600 dark:text-slate-400 px-2">
              <span className="font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" /> Live A4 Sheet Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1 hover:text-blue-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px]">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 hover:text-blue-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Resume Sheet Container (Rendered on white page) */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 w-full max-w-[595px]"
            >
              <div
                ref={previewRef}
                className="w-full bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-10 min-h-[842px] text-left leading-relaxed text-xs border border-slate-200"
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
              >
                {/* ----------------- TEMPLATE 1: MODERN ----------------- */}
                {template === 'modern' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b pb-6" style={{ borderColor: `${accentColor}30` }}>
                      <div className="space-y-1 flex-1">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                          {resume.personal.fullName || 'Your Full Name'}
                        </h2>
                        <p className="text-sm font-bold" style={{ color: accentColor }}>
                          {resume.personal.jobTitle || 'Headline'}
                        </p>
                        <p className="text-[11px] text-slate-500 pt-1">
                          {[resume.personal.email, resume.personal.phone, resume.personal.location, resume.personal.linkedin].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      {resume.personal.showPhoto && resume.personal.photoUrl && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 shadow-sm" style={{ borderColor: accentColor }}>
                          <img src={resume.personal.photoUrl} alt="Portrait" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {resume.personal.summary && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Executive Profile
                        </h4>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {resume.personal.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {resume.experience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1" style={{ borderColor: `${accentColor}25` }}>
                          Work Experience
                        </h4>
                        <div className="space-y-4">
                          {resume.experience.map((exp) => (
                            <div key={exp.id} className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-slate-900 text-[12px]">{exp.role}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{exp.startDate} – {exp.endDate}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600">{exp.company} {exp.location ? `· ${exp.location}` : ''}</div>
                              <p className="text-[11px] text-slate-600 whitespace-pre-line pt-0.5 leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resume.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1" style={{ borderColor: `${accentColor}25` }}>
                          Education
                        </h4>
                        <div className="space-y-2">
                          {resume.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                              <div>
                                <span className="font-bold text-slate-900">{edu.degree}</span>
                                <div className="text-slate-600">{edu.school} {edu.honors ? `(${edu.honors})` : ''}</div>
                              </div>
                              <span className="text-[10px] text-slate-500">{edu.gradYear}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills & Competencies */}
                    {resume.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Core Competencies
                        </h4>
                        <p className="text-[11px] text-slate-700 leading-normal">
                          {resume.skills.join('  •  ')}
                        </p>
                      </div>
                    )}

                    {/* Languages & Certifications */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      {resume.languages.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Languages</h4>
                          <div className="text-[10px] text-slate-600 space-y-0.5">
                            {resume.languages.map((l) => (
                              <div key={l.id}><strong>{l.name}</strong>: {l.level}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {resume.certifications.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Certifications</h4>
                          <div className="text-[10px] text-slate-600 space-y-0.5">
                            {resume.certifications.map((c) => (
                              <div key={c.id}>• {c.name} ({c.date})</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- TEMPLATE 2: EXECUTIVE ----------------- */}
                {template === 'executive' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-1.5 border-b-2 pb-5" style={{ borderColor: accentColor }}>
                      <h2 className="text-3xl font-serif font-bold text-slate-950">
                        {resume.personal.fullName || 'Your Full Name'}
                      </h2>
                      <p className="text-xs uppercase tracking-widest font-bold" style={{ color: accentColor }}>
                        {resume.personal.jobTitle || 'Executive Title'}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {[resume.personal.email, resume.personal.phone, resume.personal.location, resume.personal.linkedin].filter(Boolean).join('  |  ')}
                      </p>
                    </div>

                    {/* Summary */}
                    {resume.personal.summary && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5">
                          Executive Profile
                        </h4>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {resume.personal.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {resume.experience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5">
                          Professional Experience
                        </h4>
                        <div className="space-y-4">
                          {resume.experience.map((exp) => (
                            <div key={exp.id} className="space-y-0.5">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-slate-900 text-[12px]">{exp.role}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                              </div>
                              <div className="text-[11px] italic text-slate-700">{exp.company}, {exp.location}</div>
                              <p className="text-[11px] text-slate-700 whitespace-pre-line pt-0.5 leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resume.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5">
                          Education & Credentials
                        </h4>
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="flex justify-between text-[11px]">
                            <div>
                              <span className="font-bold text-slate-900">{edu.degree}</span> — {edu.school}
                            </div>
                            <span className="text-[10px] text-slate-500">{edu.gradYear}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resume.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5">
                          Core Competencies
                        </h4>
                        <p className="text-[11px] text-slate-700">
                          {resume.skills.join('  •  ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------- TEMPLATE 3: MINIMAL ----------------- */}
                {template === 'minimal' && (
                  <div className="space-y-5 text-slate-900 font-sans">
                    <div className="border-b pb-4">
                      <h2 className="text-2xl font-bold tracking-tight">
                        {resume.personal.fullName || 'Your Full Name'}
                      </h2>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">
                        {resume.personal.jobTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex flex-wrap gap-2">
                        <span>{resume.personal.email}</span>
                        <span>·</span>
                        <span>{resume.personal.phone}</span>
                        <span>·</span>
                        <span>{resume.personal.location}</span>
                      </div>
                    </div>

                    {resume.personal.summary && (
                      <div className="text-[11px] text-slate-700 leading-relaxed">
                        {resume.personal.summary}
                      </div>
                    )}

                    {resume.experience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Experience
                        </h4>
                        {resume.experience.map((exp) => (
                          <div key={exp.id} className="space-y-0.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-bold">{exp.role} / {exp.company}</span>
                              <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-[10px] text-slate-600 whitespace-pre-line leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Education
                        </h4>
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="flex justify-between text-[11px]">
                            <span><strong>{edu.degree}</strong>, {edu.school}</span>
                            <span className="text-[10px] text-slate-500">{edu.gradYear}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {resume.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Skills
                        </h4>
                        <p className="text-[10px] text-slate-700">
                          {resume.skills.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
