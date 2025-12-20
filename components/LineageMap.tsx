
import React from 'react';
import { IdeaLineage } from '../types';
import { GitBranch, GitMerge, GitPullRequest, ArrowRight } from 'lucide-react';

const LineageMap: React.FC<{ lineage: IdeaLineage }> = ({ lineage }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-12 translate-x-12"></div>
      
      <div className="flex flex-col gap-12 relative">
        {/* Ancestors */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <GitMerge size={14} className="text-slate-600" /> Ancestor Concepts
          </h4>
          <div className="flex flex-wrap gap-2">
            {lineage.ancestors.map((anc, i) => (
              <div key={i} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400">
                {anc}
              </div>
            ))}
          </div>
        </div>

        {/* Current Idea Node */}
        <div className="flex items-center gap-4">
          <div className="w-1 bg-gradient-to-b from-slate-800 via-blue-500 to-slate-800 h-12 rounded-full ml-4"></div>
          <div className="flex-1 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
             <span className="text-sm font-bold text-blue-400">Current Idea Analysis Point</span>
          </div>
        </div>

        {/* Siblings */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <GitPullRequest size={14} className="text-amber-500/50" /> Competitive Siblings
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lineage.siblings.map((sib, i) => (
              <div key={i} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200/70">
                {sib}
              </div>
            ))}
          </div>
        </div>

        {/* Unexplored Branches */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <GitBranch size={14} className="text-emerald-500/50" /> Unexplored Branches
          </h4>
          <div className="space-y-2">
            {lineage.unexploredBranches.map((branch, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 group cursor-default">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                {branch}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineageMap;
