
import React, { useState, useEffect } from 'react';
import { FACULTIES, NOTICES, RESOURCES, MILESTONES } from './constants.tsx';
import { Faculty, Message } from './types';
import { getGeminiResponse } from './services/geminiService';

// --- Helper Components ---

const Navbar: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'about', label: 'About' },
    { id: 'essentials', label: 'Essentials' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">CS</div>
          <span className="font-bold text-xl tracking-tight hidden md:block">KPT CS Department</span>
          <span className="font-bold text-xl tracking-tight md:hidden">KPT CS</span>
        </div>
        <div className="flex space-x-1 md:space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-10">
    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{title}</h2>
    {subtitle && <p className="text-slate-500 max-w-2xl">{subtitle}</p>}
  </div>
);

const FacultyCard: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  const [imgError, setImgError] = useState(false);
  const placeholder = `https://picsum.photos/seed/${faculty.id}/300/300`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <div className="w-24 h-24 mb-4 relative">
        <img 
          src={!imgError && faculty.image ? faculty.image : placeholder}
          alt={faculty.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full border-2 border-indigo-50"
        />
        {faculty.category === 'HOD' && (
          <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOD</span>
        )}
      </div>
      <h3 className="font-bold text-lg text-slate-900">{faculty.name}</h3>
      <p className="text-indigo-600 text-sm font-medium mb-3">{faculty.role}</p>
      
      {faculty.description && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-3 italic">"{faculty.description}"</p>
      )}

      {faculty.interests && (
        <div className="flex flex-wrap justify-center gap-1 mt-auto">
          {faculty.interests.map(item => (
            <span key={item} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{item}</span>
          ))}
        </div>
      )}

      {faculty.subjects && (
        <div className="mt-auto pt-4 border-t border-slate-50 w-full text-left">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Expertise</p>
          <ul className="text-xs text-slate-600 space-y-0.5">
            {faculty.subjects.map(s => <li key={s}>• {s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am the KPT CS Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getGeminiResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🤖</div>
              <div>
                <p className="font-bold leading-tight">CS Assistant</p>
                <p className="text-[10px] opacity-80">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-none flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 flex space-x-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform"
        >
          💬
        </button>
      )}
    </div>
  );
};

// --- View Components ---

const HomeView: React.FC = () => (
  <div className="space-y-16 animate-in fade-in duration-700">
    {/* Hero */}
    <div className="text-center py-10 md:py-20">
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
        Designing the <span className="text-indigo-600">Future</span> <br /> One Byte at a Time
      </h1>
      <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto mb-10">
        Empowering students with industry-relevant skills in Software Development, AI, and Cyber Security at the heart of Mangaluru's premier polytechnic.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">40+</div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Years Legacy</p>
            <p className="text-xs text-slate-500">Established 1985</p>
          </div>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">100%</div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Placement Support</p>
            <p className="text-xs text-slate-500">Dedicated cell</p>
          </div>
        </div>
      </div>
    </div>

    {/* Mission & Vision */}
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
        <p className="text-indigo-50 leading-relaxed">
          To provide high-quality technical education in Computer Science that prepares students for the dynamic needs of the global IT industry while fostering innovation and ethical practices.
        </p>
      </div>
      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-6">👁️</div>
        <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
        <p className="text-slate-300 leading-relaxed">
          To be recognized as a center of excellence in technical education, producing globally competitive computer professionals who contribute meaningfully to society through technology.
        </p>
      </div>
    </div>
  </div>
);

const FacultyView: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredFaculties = FACULTIES.filter(f => {
    const categoryMatch = filter === 'ALL' || f.category === filter;
    const searchMatch = searchTerm === '' || f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        title="Department Faculty" 
        subtitle="Meet the experienced educators and industry experts who lead our academic programs."
      />
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input 
            type="search"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-shadow"
            aria-label="Search faculty by name"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'HOD', 'PERMANENT', 'GUEST'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredFaculties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculties.map(faculty => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="font-bold text-lg text-slate-700">No Faculty Found</p>
          <p className="text-sm text-slate-500 mt-2">Please try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

const AboutView: React.FC = () => (
  <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
    <SectionHeader title="About the Department" />
    
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-12">
      <p className="text-slate-600 leading-relaxed mb-6">
        The Computer Science Department at KPT Mangaluru has been a cornerstone of technical education in the region since its inception. We offer a comprehensive three-year diploma program that bridges the gap between academic theory and practical application.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-1">State-of-the-Art Labs</h4>
          <p className="text-xs text-slate-500">Equipped with the latest hardware and high-speed internet connectivity.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-1">Skill Development</h4>
          <p className="text-xs text-slate-500">Workshops on coding, web development, and cyber security.</p>
        </div>
      </div>
    </div>

    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">📜</span>
      <span>Our Journey</span>
    </h3>
    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
      {MILESTONES.map((m, idx) => (
        <div key={idx} className="relative pl-8">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600"></div>
          <span className="text-sm font-bold text-indigo-600">{m.year}</span>
          <p className="text-slate-700 mt-1">{m.event}</p>
        </div>
      ))}
    </div>
  </div>
);

const EssentialsView: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('ERROR');
      return;
    }
    setFormStatus('SUCCESS');
    // In real app, send data to API
    setTimeout(() => {
      setFormStatus('IDLE');
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-12">
        {/* Notice Board */}
        <div>
          <SectionHeader title="Notice Board" subtitle="Latest departmental announcements and academic updates." />
          <div className="space-y-4">
            {NOTICES.map(notice => (
              <div key={notice.id} className={`p-5 rounded-2xl border ${notice.important ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'} transition-all hover:scale-[1.01]`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{notice.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{notice.date}</span>
                </div>
                <p className="text-sm text-slate-600">{notice.description}</p>
                {notice.important && <span className="inline-block mt-3 px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold rounded">URGENT</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <SectionHeader title="Academics & Resources" />
          <div className="grid sm:grid-cols-2 gap-4">
            {RESOURCES.map(res => (
              <a 
                key={res.id} 
                href={res.url}
                className="flex items-center p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center mr-4">📂</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{res.title}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{res.type}</p>
                </div>
                <span className="text-indigo-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-24">
          <h3 className="text-xl font-bold mb-6">Contact Us</h3>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Message</label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="How can we help?"
              />
            </div>
            <button 
              type="submit"
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                formStatus === 'SUCCESS' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {formStatus === 'SUCCESS' ? 'Message Sent!' : 'Send Message'}
            </button>
            {formStatus === 'ERROR' && <p className="text-rose-400 text-xs text-center">Please fill all fields.</p>}
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Office Address</p>
            <p className="text-sm text-slate-300">
              Karnataka (Govt) Polytechnic,<br />
              Kadri Hills, Mangaluru - 575004
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'faculty': return <FacultyView />;
      case 'about': return <AboutView />;
      case 'essentials': return <EssentialsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 grayscale opacity-60">
            <div className="w-6 h-6 bg-slate-400 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">CS</div>
            <span className="font-bold text-slate-500">KPT CS Dept. © 2024</span>
          </div>
          <div className="flex space-x-6 text-sm text-slate-400">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Alumni Portal</a>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;
