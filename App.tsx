
import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Database, History, ChevronRight, Wand2, Plus, Trash2, Github, LayoutDashboard, BrainCircuit, AlertCircle, FileText, MessageSquare, GraduationCap, Rocket, Trophy, Globe, BookOpen, Network, Zap, Target, TrendingUp, AlertTriangle, CloudOff, RefreshCw, Send, Info } from 'lucide-react';
import { analyzeIdea } from './services/geminiService';
import { AnalysisResult, LocalProject } from './types';
import Gauge from './components/Gauge';
import MatchCard from './components/MatchCard';
import LineageMap from './components/LineageMap';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'analysis' | 'admin' | 'history'>('home');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const savedProjects = localStorage.getItem('thief_detector_local_db');
    if (savedProjects) setLocalProjects(JSON.parse(savedProjects));

    const savedHistory = localStorage.getItem('thief_detector_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const saveHistory = (newHistory: AnalysisResult[]) => {
    setHistory(newHistory);
    localStorage.setItem('thief_detector_history', JSON.stringify(newHistory));
  };

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    if (!isOnline) {
      setError("Active connection required for deep scans.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeIdea(idea, localProjects);
      setResult(res);
      saveHistory([res, ...history]);
      setView('analysis');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Engine busy. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const addLocalProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: LocalProject = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      author: formData.get('author') as string,
      date: new Date().toLocaleDateString(),
    };
    const updated = [...localProjects, newProject];
    setLocalProjects(updated);
    localStorage.setItem('thief_detector_local_db', JSON.stringify(updated));
    e.currentTarget.reset();
  };

  const removeHistoryItem = (id: string) => {
    saveHistory(history.filter(h => h.id !== id));
  };

  const startNewAnalysis = () => {
    setIdea('');
    setResult(null);
    setView('home');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Offline Alert */}
      {!isOnline && (
        <div className="bg-amber-600 text-black py-1 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <CloudOff size={12} /> Offline Mode: Local Access Only
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex flex-col cursor-pointer group" onClick={startNewAnalysis}>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Idea<span className="text-blue-500">Thief</span>.</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 ml-10 -mt-1 tracking-widest uppercase">By:Shahrukh Rind</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={startNewAnalysis} className={`text-sm font-medium transition-colors ${view === 'home' || view === 'analysis' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Detector</button>
          <button onClick={() => setView('history')} className={`text-sm font-medium transition-colors ${view === 'history' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>History</button>
          <button onClick={() => setView('admin')} className={`text-sm font-medium transition-colors ${view === 'admin' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Repo</button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {view === 'home' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
                <Zap size={14} className="text-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Flash Turbo Engine Active</span>
              </div>
              <h1 className="text-6xl font-black tracking-tight text-white leading-tight">
                Deep Analysis for <span className="text-blue-500">Unstoppable Ideas.</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Instant originality assessment across GitHub, GitLab, and Bitbucket. Real-time intelligence for elite creators.
              </p>
            </div>

            <div className={`relative bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 focus-within:border-blue-600/50 transition-all ${loading ? 'scanner' : ''}`}>
              <textarea
                placeholder="Example: Real-time stock market forecasting powered by sentiment analysis from decentralized social platforms..."
                className="w-full h-48 bg-transparent text-xl font-medium outline-none resize-none placeholder:text-slate-600"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700 flex items-center gap-1.5"><Zap size={12} /> Instant Scan</span>
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700 flex items-center gap-1.5"><Target size={12} /> Multi-Repo Intel</span>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !idea.trim()}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                >
                  {loading ? (
                    <><RefreshCw className="animate-spin" size={20} /> Analyzing Repos...</>
                  ) : (
                    <><Target size={20} /> Verify Originality</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'analysis' && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
            {/* Header Verdict Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[40px] p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
               
               <div className="flex flex-col lg:flex-row gap-12 items-center relative">
                  <div className="flex-shrink-0">
                    <Gauge value={result.uniquenessScore} size={220} />
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400 uppercase tracking-widest">{result.noveltyLevel}</span>
                      {result.hotZoneAlert && (
                        <span className="px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} /> Hot Zone Detected
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-white italic">"{result.honestVerdict}"</h2>
                      <p className="text-slate-400 text-lg leading-relaxed">{result.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Concept novelty</span>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${result.dimensions?.concept || 0}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Execution novelty</span>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${result.dimensions?.execution || 0}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Domain Transfer</span>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: `${result.dimensions?.domainTransfer || 0}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Network className="text-blue-500" /> Idea Lineage Visualization
                    </h3>
                    <LineageMap lineage={result.lineage} />
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <LayoutDashboard className="text-blue-500" /> Intelligence Feed
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result.matches || []).slice(0, 4).map(m => <MatchCard key={m.id} match={m} />)}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <Wand2 className="text-emerald-500" /> Pivot & Optimization Strategy
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {result.suggestions?.map((sug, i) => (
                        <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex gap-4">
                           <div className="bg-emerald-500/20 w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">{i+1}</div>
                           <p className="text-slate-200 leading-relaxed font-medium">{sug}</p>
                        </div>
                      ))}
                    </div>
                  </section>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                    <h4 className="font-bold flex items-center gap-2 text-blue-400">
                      <BrainCircuit size={18} /> Market Hook & Behavior
                    </h4>
                    <p className="text-sm text-slate-300 italic">"{result.psychology?.marketHook}"</p>
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Critical Failure Risks</span>
                      {(result.psychology?.failureSignals || []).map((sig, i) => (
                        <div key={i} className="flex gap-3 text-xs text-red-400/80 bg-red-400/5 p-3 rounded-xl border border-red-400/10">
                          <AlertCircle size={14} className="flex-shrink-0" /> {sig}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-emerald-400">
                      <TrendingUp size={18} /> Neighborhood Intel
                    </h4>
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Industry Trend</span>
                      <span className="text-xs font-bold text-emerald-400">{result.intel?.industryTrend}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                      <Info size={14} className="inline mr-2 text-blue-400" />
                      {result.intel?.intelDrop}
                    </p>
                  </div>

                  {result.explainability && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Why this score?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{result.explainability}</p>
                    </div>
                  )}

                  {(result.groundingUrls || []).length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Grounding</h4>
                      <div className="flex flex-col gap-2">
                        {result.groundingUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400/70 hover:text-blue-400 truncate underline">
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 pt-12 border-t border-slate-800">
                <button 
                  onClick={startNewAnalysis}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 group"
                >
                  <Search size={20} className="group-hover:scale-110 transition-transform" />
                  New Analysis
                  <ChevronRight size={20} />
                </button>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-8">
            <header className="border-b border-slate-800 pb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Analysis History</h1>
                <p className="text-slate-400">Fast scans cached for local access.</p>
              </div>
              <button onClick={() => saveHistory([])} className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2">
                <Trash2 size={14} /> Clear History
              </button>
            </header>

            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl text-slate-600">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Your analysis history will appear here.</p>
                </div>
              ) : (
                history.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group cursor-pointer"
                    onClick={() => { setResult(item); setView('analysis'); }}
                  >
                    <div className="flex justify-between items-start">
                       <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-mono text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                             <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">{item.noveltyLevel}</span>
                          </div>
                          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">{item.ideaText}</h3>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="text-2xl font-black text-slate-700">{item.uniquenessScore}</span>
                          <button onClick={(e) => { e.stopPropagation(); removeHistoryItem(item.id); }} className="p-2 text-slate-800 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-12">
            <header className="border-b border-slate-800 pb-8">
                <h1 className="text-3xl font-bold">Local Repository</h1>
                <p className="text-slate-400">Register internal projects to prevent local overlap.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <form onSubmit={addLocalProject} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 sticky top-24">
                  <h3 className="font-bold flex items-center gap-2"><Plus size={20} /> Add Project</h3>
                  <input name="title" required placeholder="Project Title" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none" />
                  <input name="author" required placeholder="Author" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none" />
                  <textarea name="description" required placeholder="Description..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm h-32 focus:border-blue-600 outline-none resize-none" />
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all">Register Project</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {localProjects.map(p => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between">
                    <div>
                      <h4 className="font-bold">{p.title}</h4>
                      <p className="text-sm text-slate-400">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 px-6 py-8 text-center bg-slate-950/50">
        <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          &copy; 2025 Idea Thief Detector &bull; Turbo v3.0 &bull; Shahrukh Rind
        </p>
      </footer>
    </div>
  );
};

export default App;
