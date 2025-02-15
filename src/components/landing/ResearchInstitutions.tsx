import React from 'react';
import { ArrowRight, Star, Brain, Heart } from 'lucide-react';

const INSTITUTIONS = [
  { name: 'H', text: 'HARVARD RESEARCH', url: 'https://www.gse.harvard.edu/ideas/usable-knowledge/23/03/does-nature-or-nurture-determine-musical-ability', isSerif: true },
  { name: 'UW', text: 'WASHINGTON STUDY', url: 'https://www.washington.edu/news/2016/04/25/music-improves-baby-brain-responses-to-music-and-speech' },
  { name: 'NCBI', text: 'NIH PAPER', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4951961' },
  { name: 'F', text: 'FRONTIERS RESEARCH', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00297' },
  { name: 'AMTA', text: 'STUDY', url: 'https://www.musictherapy.org/assets/1/7/MT_Young_Children_2006.pdf' }
];

export default function ResearchInstitutions() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-[#FFD700]/[0.08] to-background-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/[0.03] via-transparent to-transparent opacity-30"></div>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-6">
          Research is Clear: Music Shapes Your Baby's Mind
          <span className="block text-base sm:text-xl font-normal text-white/60 mt-2">
            Leading institutions confirm the profound impact of early musical exposure
          </span>
        </h2>
        
        {/* Mobile layout */}
        <div className="sm:hidden max-w-3xl mx-auto mb-8">
          <div className="flex justify-center gap-4 mb-4">
            {INSTITUTIONS.slice(0, 2).map((institution) => (
              <InstitutionCard key={institution.name} {...institution} className="w-[5.5rem]" />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {INSTITUTIONS.slice(2).map((institution) => (
              <InstitutionCard key={institution.name} {...institution} className="w-[5.5rem]" />
            ))}
          </div>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-4 max-w-3xl mx-auto mb-12">
          {INSTITUTIONS.map(institution => (
            <InstitutionCard key={institution.name} {...institution} />
          ))}
        </div>
        
        <ResearchSummary />
      </div>
    </section>
  );
}

function InstitutionCard({ name, text, url, isSerif, className }: {
  name: string;
  text: string;
  url: string;
  isSerif?: boolean;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`aspect-square card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                transition-all duration-500 hover:scale-105 relative overflow-hidden
                ${className || ''}`}
      style={{ minHeight: '5.5rem' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
          <div className={`text-lg sm:text-xl mb-1 ${isSerif ? 'font-serif' : 'font-bold'}`}>{name}</div>
          <div className="text-[0.65rem] sm:text-xs font-medium mb-1">{text}</div>
          <ArrowRight className="w-3 h-3 mx-auto mt-2 text-primary/70 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </a>
  );
}

function ResearchSummary() {
  return (
    <div className="max-w-3xl mx-auto text-center relative">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Star className="w-5 h-5" fill="currentColor" />
          <span className="text-xs sm:text-sm font-medium">Research</span>
        </div>
        <div className="w-px h-4 bg-[#FFD700]/20"></div>
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Brain className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-medium">Science</span>
        </div>
        <div className="w-px h-4 bg-[#FFD700]/20"></div>
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Heart className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-medium">Certified</span>
        </div>
      </div>
      <p className="text-base sm:text-lg text-white/80 leading-relaxed">
        Studies show that exposure to complex music before the age of 5 can significantly improve a child's pitch perception. 
        In some cases, it even leads to perfect pitch, a rare auditory skill linked to stronger memory and language abilities.
      </p>
    </div>
  );
}