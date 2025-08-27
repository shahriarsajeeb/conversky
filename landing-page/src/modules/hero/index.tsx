import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
// import heroMockup from "@/assets/hero-mockup.png";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[hsl(270,70%,65%)] via-[hsl(220,80%,70%)] to-[hsl(320,70%,75%)] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container px-4 mx-auto min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-10">
            <div className="space-y-6">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Conversky
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed">
                Your personal AI assistant, always with you
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="ghost" size="lg" className="group">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Download on App Store
              </Button>
              <Button variant="ghost" size="lg" className="group">
                <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get it on Google Play
              </Button>
            </div>

            <div className="text-white/80 text-lg font-medium">
              No signup required • Privacy first
            </div>
          </div>

          {/* Right Content - 3D iPhone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glassmorphism frame with 3D effect */}
              <div className="relative group">
                <div
                  className="bg-gradient-glass backdrop-blur-glass border border-white/20 rounded-3xl p-8 shadow-glass transition-all duration-700 hover:scale-105"
                  style={{
                    transform: 'perspective(1000px) rotateY(12deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* <img
                    src={heroMockup}
                    alt="Conversky app interface mockup showing AI assistant features"
                    className="w-80 md:w-96 lg:w-[420px] drop-shadow-2xl"
                  /> */}
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}