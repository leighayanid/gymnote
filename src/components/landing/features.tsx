"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  BarChart3,
  Brain,
  Dumbbell,
  Target,
  Users,
  Zap,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Dumbbell,
    title: "PRECISION TRACKING",
    description:
      "Log every set, rep, and weight with military precision. Our intuitive interface makes tracking your workouts effortless.",
    gradient: "from-violet-600 to-purple-600",
    shadowColor: "shadow-violet-500/25",
  },
  {
    icon: BarChart3,
    title: "ADVANCED ANALYTICS",
    description:
      "Deep dive into your performance data. Visualize trends, identify weaknesses, and optimize your training strategy.",
    gradient: "from-blue-600 to-cyan-500",
    shadowColor: "shadow-blue-500/25",
  },
  {
    icon: Brain,
    title: "AI-POWERED INSIGHTS",
    description:
      "Let artificial intelligence analyze your patterns and deliver personalized recommendations to accelerate your gains.",
    gradient: "from-rose-500 to-pink-500",
    shadowColor: "shadow-rose-500/25",
  },
  {
    icon: Target,
    title: "GOAL SETTING",
    description:
      "Set ambitious targets and track your progress. Our system adapts to keep you challenged and motivated.",
    gradient: "from-orange-500 to-amber-500",
    shadowColor: "shadow-orange-500/25",
  },
  {
    icon: Activity,
    title: "REAL-TIME SYNC",
    description:
      "Your data follows you everywhere. Seamlessly sync across all your devices with offline-first technology.",
    gradient: "from-emerald-500 to-green-500",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    icon: Users,
    title: "COMMUNITY",
    description:
      "Join a community of elite athletes. Share workouts, compete on leaderboards, and push each other to greatness.",
    gradient: "from-purple-500 to-violet-600",
    shadowColor: "shadow-purple-500/25",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation with split text effect
      const headerElements = headerRef.current?.children;
      if (headerElements) {
        gsap.fromTo(
          headerElements,
          {
            opacity: 0,
            y: 60,
            rotateX: -45,
            transformOrigin: "center top",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger animation with 3D perspective
      const cards = cardsRef.current?.querySelectorAll(".feature-card");
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 100,
            rotateY: -15,
            rotateX: 10,
            scale: 0.85,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            stagger: {
              each: 0.12,
              from: "start",
            },
            ease: "power4.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Interactive hover animations
        cards.forEach((card) => {
          const icon = card.querySelector(".feature-icon");
          const glow = card.querySelector(".feature-glow");
          const arrow = card.querySelector(".feature-arrow");
          const content = card.querySelector(".feature-content");

          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -12,
              scale: 1.02,
              duration: 0.4,
              ease: "power3.out",
            });
            gsap.to(icon, {
              scale: 1.15,
              rotate: 8,
              duration: 0.4,
              ease: "power3.out",
            });
            gsap.to(glow, {
              opacity: 1,
              scale: 1.1,
              duration: 0.4,
            });
            gsap.to(arrow, {
              x: 5,
              y: -5,
              opacity: 1,
              duration: 0.3,
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power3.out",
            });
            gsap.to(icon, {
              scale: 1,
              rotate: 0,
              duration: 0.4,
              ease: "power3.out",
            });
            gsap.to(glow, {
              opacity: 0,
              scale: 1,
              duration: 0.4,
            });
            gsap.to(arrow, {
              x: 0,
              y: 0,
              opacity: 0.5,
              duration: 0.3,
            });
          });

          // Tilt effect on mouse move
          card.addEventListener("mousemove", (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = (card as HTMLElement).getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          });
        });
      }

      // Floating background orbs
      gsap.to(".feature-orb", {
        y: -40,
        x: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 1,
          from: "random",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
      <div className="feature-orb absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="feature-orb absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="feature-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 sm:mb-24" style={{ transformStyle: "preserve-3d" }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8">
            EVERYTHING YOU NEED TO
            <span className="block text-primary mt-2">CRUSH YOUR GOALS</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Built by athletes, for athletes. Every feature is designed to help
            you train smarter and achieve <span className="text-foreground font-bold">peak performance</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          style={{ transformStyle: "preserve-3d" }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 lg:p-10 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow effect */}
              <div className={`feature-glow absolute -inset-px bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 blur-xl -z-10`} />

              {/* Card inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div
                className={`feature-icon relative w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl ${feature.shadowColor}`}
              >
                <feature.icon className="w-8 h-8 text-white" />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-50 blur-xl -z-10`} />
              </div>

              {/* Content */}
              <div className="feature-content">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl lg:text-2xl font-black tracking-tight">
                    {feature.title}
                  </h3>
                  <ArrowUpRight className="feature-arrow w-5 h-5 text-muted-foreground opacity-50 transition-all" />
                </div>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  {feature.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.gradient} opacity-5 rounded-tr-3xl rounded-bl-[100px]`} />

              {/* Bottom line accent */}
              <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${feature.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                New features added monthly
              </span>
            </div>
            <div className="w-px h-6 bg-border" />
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              50+ features available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
