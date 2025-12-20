
import React from 'react';
import { Match } from '../types';
import { ExternalLink, Star, FileText, Code, MessageSquare, Database, GraduationCap, Rocket, Trophy, BookOpen, Share2, Globe } from 'lucide-react';

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const getIcon = () => {
    const s = (match.source || 'Unknown').toLowerCase();
    if (s.includes('github') || s.includes('gitlab') || s.includes('bitbucket')) return <Code size={16} className="text-purple-400" />;
    if (s.includes('arxiv') || s.includes('scholar') || s.includes('ieee') || s.includes('acm') || s.includes('researchgate') || s.includes('springer')) return <GraduationCap size={16} className="text-indigo-400" />;
    if (s.includes('product hunt') || s.includes('crunchbase') || s.includes('angellist') || s.includes('wellfound') || s.includes('y-combinator')) return <Rocket size={16} className="text-emerald-400" />;
    if (s.includes('devpost') || s.includes('hackerearth') || s.includes('hackerrank') || s.includes('kaggle')) return <Trophy size={16} className="text-yellow-400" />;
    if (s.includes('medium') || s.includes('substack')) return <BookOpen size={16} className="text-slate-400" />;
    if (s.includes('reddit') || s.includes('hacker news')) return <Share2 size={16} className="text-orange-400" />;
    if (s.includes('stackoverflow')) return <MessageSquare size={16} className="text-orange-500" />;
    if (s.includes('local')) return <Database size={16} className="text-blue-400" />;
    return <Globe size={16} className="text-slate-500" />;
  };

  const getSeverityColor = (sim: number) => {
    const s = sim || 0;
    if (s > 0.8) return 'text-red-400 bg-red-400/10 border-red-400/30';
    if (s > 0.5) return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-xs font-mono text-slate-400 uppercase truncate max-w-[120px]">{match.source || 'Unknown Source'}</span>
          {match.metadata?.year && (
            <span className="text-[10px] text-slate-600 font-mono">({match.metadata.year})</span>
          )}
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityColor(match.similarity)}`}>
          {Math.round((match.similarity || 0) * 100)}% Match
        </div>
      </div>
      
      <h4 className="text-sm font-semibold mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{match.title || 'Untitled Match'}</h4>
      <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
        {match.description || 'No description provided.'}
      </p>

      {match.metadata?.classification && (
        <div className="flex gap-2 mb-3">
          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase">
            {match.metadata.classification.type}
          </span>
          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">
            {match.metadata.classification.focus}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {(match.metadata?.stars !== undefined || match.metadata?.citations !== undefined) && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Star size={12} /> {match.metadata?.stars || match.metadata?.citations || 0}
            </div>
          )}
          <span className="text-[10px] text-slate-600 font-mono">{match.matchType || 'General'}</span>
        </div>
        
        {match.url && (
          <a 
            href={match.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
