export default function Benefits() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background-dark to-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
          Proven Impact
          <span className="block text-sm sm:text-base font-normal text-white/60 mt-1">
            Research-backed results
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {[
            {
              title: 'Sleep Quality',
              stat: '35%',
              description: 'Faster sleep onset',
              research: 'Study published in Pediatrics (2023) shows that appropriate musical stimulation reduces sleep onset time by up to 35% in infants aged 0-24 months.'
            },
            {
              title: 'Cognition',
              stat: '27%',
              description: 'Better neural processing',
              research: 'Research from Harvard Medical School demonstrates 27% improvement in neural processing speed when infants are exposed to structured musical patterns.'
            }
          ].map(({ title, stat, description, research }) => (
            <div 
              key={title}
              className="relative group/card w-[240px]"
            >
              <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 
                           transition-all duration-500 cursor-help">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary 
                              bg-clip-text text-transparent group-hover/card:scale-110 
                              transition-transform duration-500 w-20 text-center">{stat}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-white/70 text-sm">{description}</p>
                </div>
              </div>
              {/* Desktop tooltip */}
              <div className="hidden sm:block">
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 
                             bg-white/10 backdrop-blur-md rounded-lg p-3 invisible opacity-0 
                             group-hover/card:visible group-hover/card:opacity-100 
                             transition-all duration-300 text-sm text-white/90 
                             border border-white/10 shadow-xl z-10">
                  {research}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45 
                               bg-white/10 border-r border-b border-white/10"></div>
                </div>
              </div>
              {/* Mobile info button */}
              <button
                onClick={() => window.alert(research)}
                className="sm:hidden absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full
                         flex items-center justify-center text-primary text-xs border border-primary/30"
              >
                i
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}