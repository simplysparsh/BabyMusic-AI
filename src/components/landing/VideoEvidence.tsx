import React from 'react';

export default function VideoEvidence() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16 relative z-10">
      <div className="card p-3 sm:p-4 bg-red-500/5 border-red-500/10 max-w-lg mx-auto">
        <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-75"></span>
          Research: Impact on Development
        </h3>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 mb-2" style={{ maxHeight: '160px' }}>
          <iframe
            src="https://www.youtube.com/embed/YEFptHp0AmM?rel=0&modestbranding=1&showinfo=0&controls=1&fs=0&playsinline=1"
            title="The Impact of Overstimulating Content on Child Development"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
        <p className="text-white/60 text-xs italic">
          Research shows that fast-paced, overstimulating content can negatively impact attention spans
          and cognitive development in young children.
        </p>
      </div>
    </div>
  );
}