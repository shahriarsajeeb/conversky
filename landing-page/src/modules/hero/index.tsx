import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, Lock, MessageSquare, Settings, Sparkles, User } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-[#fbfbfd]
        bg-[radial-gradient(900px_520px_at_-10%_-10%,#e6ecff_0%,transparent_60%),radial-gradient(700px_460px_at_110%_0%,#ffe7eb_0%,transparent_55%)]
      "
    >
      {/* subtle backdrop blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -right-20 top-16 h-[22rem] w-[22rem] rounded-full bg-rose-100/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-16 md:pb-20">
        {/* Use asymmetrical grid so the mockup is smaller */}
        <div className="grid grid-cols-12 items-center gap-10 lg:gap-14">
          {/* LEFT */}
          <div className="col-span-12 md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-sm text-indigo-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Personal AI assistant
            </div>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Conversky
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-600">
              A simple, privacy-first AI assistant that remembers what matters and
              helps you write, plan, and reply—without the clutter.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 rounded-xl cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500">
                Download on the App Store
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-xl cursor-pointer border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              >
                Get it on Google Play
              </Button>
            </div>

            {/* Key points (more data without hype) */}
            <ul className="mt-6 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <Li icon={<Lock className="h-4 w-4 text-emerald-600" />}>
                On-device memory (SecureStore / Keychain)
              </Li>
              <Li icon={<MessageSquare className="h-4 w-4 text-indigo-600" />}>
                Contexted conversations (Email, Work, Personal)
              </Li>
              <Li icon={<CheckCircle className="h-4 w-4 text-sky-600" />}>
                No signup required
              </Li>
              <Li icon={<CheckCircle className="h-4 w-4 text-sky-600" />}>
                Simple preferences: model, tone, length
              </Li>
            </ul>

            {/* mini badges */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>iOS & Android</span>
              <span>Open-source • Local-first</span>
            </div>
          </div>

          {/* RIGHT (smaller mockup) */}
          <div className="col-span-12 md:col-span-5">
            <div className="relative mx-auto w-full max-w-[320px] md:max-w-[360px]">
              <div className="absolute -inset-6 -z-10 rounded-[2.3rem] blur-2xl" />
              <div className="overflow-hidden rounded-[2rem]">
                {/* faux notch bar */}
                <div className="relative aspect-[9/19]">
                  {/* replace with your actual screenshot path */}
                  <Image
                    src={require("../../assets/1.png")}
                    alt="Conversky app screenshot"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

                 {/* feature strip under hero */}
         <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
           <Feature 
             title="Personal Memory" 
             desc="Stored securely on device" 
             icon={<Brain className="h-5 w-5 text-indigo-600" />}
           />
           <Feature 
             title="Smart Chats" 
             desc="Email, Work, Personal & more" 
             icon={<MessageSquare className="h-5 w-5 text-emerald-600" />}
           />
           <Feature 
             title="No Sign-Up" 
             desc="Start instantly" 
             icon={<User className="h-5 w-5 text-sky-600" />}
           />
           <Feature 
             title="Custom Preferences" 
             desc="Model, tone, length" 
             icon={<Settings className="h-5 w-5 text-purple-600" />}
           />
         </div>
      </div>
    </section>
  );
}

function Li({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-lg bg-slate-50 p-2 group-hover:bg-slate-100 transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
