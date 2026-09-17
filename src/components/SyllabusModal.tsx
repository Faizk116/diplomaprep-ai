import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { X, BookOpen, CheckCircle, FileText, Award, Loader2 } from 'lucide-react';
import { curriculumService, SyllabusBlueprint } from '../api/services';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose, subjects }) => {
  const [blueprint, setBlueprint] = useState<SyllabusBlueprint | null>(null);

  useEffect(() => {
    if (isOpen && !blueprint) {
      curriculumService.getSyllabusBlueprint()
        .then(bp => setBlueprint(bp))
        .catch(err => console.error('Failed to fetch syllabus blueprint:', err));
    }
  }, [isOpen, blueprint]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                MSBTE 'I' Scheme Syllabus Blueprint
              </h3>
              <p className="text-xs text-slate-500">Curriculum weightage &amp; Bloom's cognitive distribution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Exam Rubric Overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
              <Award className="w-4 h-4 text-amber-500" />
              Examination Pattern (Theory + Online/MCQ Scheme)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Theory Paper</span>
                <p className="font-extrabold text-sm text-slate-800">70 Marks</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Passing Marks</span>
                <p className="font-extrabold text-sm text-emerald-600">28 Marks (40%)</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Progressive (PA)</span>
                <p className="font-extrabold text-sm text-slate-800">30 Marks</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Exam Duration</span>
                <p className="font-extrabold text-sm text-blue-600">2 Hours</p>
              </div>
            </div>
          </div>

          {/* Subject Units Breakdown */}
          {subjects.map((subj) => (
            <div key={subj.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-slate-900 flex justify-between items-center">
                <span>{subj.title} ({subj.code})</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  70 Marks Total Weightage
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {subj.units.map((u) => (
                  <div key={u.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-800 text-xs">
                        Unit {u.number}: {u.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {u.topics.join(' • ')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900">{u.weightageMarks} Marks</span>
                      <p className="text-[10px] text-slate-400">~{u.totalQuestions} Question Bank</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Cognitive Taxonomy Distribution */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 text-blue-950">
            <h4 className="font-bold mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Bloom's Cognitive Taxonomy Specification
            </h4>
            <p className="text-[11px] text-blue-900 leading-relaxed">
              • <strong>R-Level (Remembering)</strong>: ~20-25% definitions, standard terms, and formulas.<br />
              • <strong>U-Level (Understanding)</strong>: ~40-45% explanations, comparative differences, and diagrams.<br />
              • <strong>A-Level (Application)</strong>: ~30-35% real-life case studies, fault diagnosis, and calculations.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
