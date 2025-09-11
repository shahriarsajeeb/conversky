import { Database, MessageSquare, Settings, Shield } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Personal Memory",
    description: "Store your info securely on device for truly personalized conversations",
    shadowColor: "shadow-indigo-100",
  },
  {
    icon: MessageSquare,
    title: "Smart Conversations", 
    description: "Choose Email Reply, Work & Business, or Personal Chat modes",
    shadowColor: "shadow-blue-100",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays local - no cloud storage, complete privacy",
    shadowColor: "shadow-emerald-100",
  },
  {
    icon: Settings,
    title: "Custom Preferences",
    description: "Pick your AI model, response tone, and conversation length",
    shadowColor: "shadow-purple-100",
  },
];

export function Features() {
  return (
    <section className="py-32 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,30%,97%)] to-[hsl(220,40%,98%)]"></div>
      
      {/* Gradient shadows in background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-20 space-y-6">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-slate-900">
            Powerful features for
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">smarter conversations</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need for intelligent, private AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Simple card design with colored shadows */}
              <div className={`relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-80 ${feature.shadowColor} hover:${feature.shadowColor.replace('100', '200')}`}>
                <div className="text-center space-y-6">
                  {/* Simple icon container */}
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-slate-600" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}