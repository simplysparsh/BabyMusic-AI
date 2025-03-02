

export default function ProblemSolution() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background-dark/50 to-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8">
          Is Your Baby's Music Helping or Harming?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {/* Problem Side */}
          <div className="card p-6 sm:p-8 bg-red-500/5 border-red-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
            <div className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                <div className="w-24 h-24 bg-red-500/10 rounded-lg transform -rotate-45 group-hover:-rotate-90 transition-transform duration-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                <div className="w-20 h-20 bg-red-500/20 rounded-lg transform rotate-[30deg]"></div>
                <div className="w-20 h-20 bg-red-500/20 rounded-lg transform -rotate-[30deg]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-500/30 rounded-lg animate-pulse">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-red-500/40"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Traditional Content</h3>
            <p className="text-white text-center mb-6">Overstimulating, fast-paced, bright visuals</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Fast-paced cuts hijack attention spans</span>
              </li>
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Overstimulation linked to speech delays</span>
              </li>
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Passive consumption hurts emotional development</span>
              </li>
            </ul>
          </div>

          {/* Solution Side */}
          <div className="card p-6 sm:p-8 bg-green-500/5 border-green-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-green-500/10 rounded-full transform group-hover:scale-110 transition-transform duration-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-500/15 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-75"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-100">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform -rotate-45 -translate-x-4"></div>
                    <div className="absolute w-3 h-6 bg-green-500/40 rounded-full"></div>
                    <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform rotate-45 translate-x-4"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">BabyMusic AI Solution</h3>
            <p className="text-white text-center mb-6">Designed for cognitive and emotional well-being</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Scientifically crafted melodies</span>
              </li>
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Boosts cognition and emotional well-being</span>
              </li>
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Supports deep sleep and relaxation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}