"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, Medal, Timer, TrendingUp, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    icon: TrendingUp,
    value: 127,
    suffix: "%",
    label: "Average Strength Gain",
    description: "Users see significant improvement within 3 months",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
  },
  {
    icon: Timer,
    value: 45,
    suffix: "min",
    label: "Average Session",
    description: "Efficient workouts that fit your busy schedule",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  {
    icon: Flame,
    value: 892,
    suffix: "K",
    label: "Calories Tracked",
    description: "Total calories burned by our community this month",
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
  },
  {
    icon: Medal,
    value: 15,
    suffix: "K+",
    label: "PRs Set This Week",
    description: "Personal records broken across all users",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
];

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    if (inView) {
      gsap.to(countRef.current, {
        value: value,
        duration: 2.5,
        ease: "power3.out",
        onUpdate: () => {
          setCount(Math.round(countRef.current.value));
        },
      });
    }
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {count}
      <span className="text-background/60">{suffix}</span>
    </span>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trigger counter animation when in view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setInView(true),
      });

      // Header animation
      gsap.fromTo(
        ".stats-header",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".stats-header",
            start: "top 85%",
          },
        }
      );

      // Horizontal scroll text - faster and smoother
      gsap.to(".scrolling-text", {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });

      // Stats cards animation with 3D
      gsap.fromTo(
        ".stat-card",
        {
          opacity: 0,
          y: 80,
          rotateX: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".stats-grid",
            start: "top 80%",
          },
        }
      );

      // Hover animations for cards
      const cards = document.querySelectorAll(".stat-card");
      cards.forEach((card) => {
        const icon = card.querySelector(".stat-icon");
        const value = card.querySelector(".stat-value");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.03,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(icon, {
            scale: 1.2,
            rotate: 10,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
          gsap.to(value, {
            scale: 1.05,
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
          gsap.to(value, {
            scale: 1,
            duration: 0.3,
          });
        });
      });

      // Banner pulse animation
      gsap.to(".banner-glow", {
        scale: 1.02,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-28 sm:py-36 overflow-hidden bg-foreground text-background"
      style={{ perspective: "1000px" }}
    >
      {/* Scrolling Background Text */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="scrolling-text inline-flex text-[180px] sm:text-[220px] font-black tracking-tighter">
          <span className="mx-8">RESULTS</span>
          <span className="mx-8">THAT</span>
          <span className="mx-8">SPEAK</span>
          <span className="mx-8">FOR</span>
          <span className="mx-8">THEMSELVES</span>
          <span className="mx-8">RESULTS</span>
          <span className="mx-8">THAT</span>
          <span className="mx-8">SPEAK</span>
          <span className="mx-8">FOR</span>
          <span className="mx-8">THEMSELVES</span>
        </div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="stats-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/20 border border-primary/30 rounded-full mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Proven Results
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
            NUMBERS DON&apos;T LIE
          </h2>
          <p className="text-xl sm:text-2xl text-background/60 max-w-3xl mx-auto font-medium">
            Our athletes are breaking records and transforming their bodies.
            Here&apos;s the <span className="text-background font-bold">proof</span>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" style={{ transformStyle: "preserve-3d" }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card group relative p-8 lg:p-10 bg-background/5 backdrop-blur-sm rounded-3xl border border-background/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className={`stat-icon w-14 h-14 mb-8 rounded-2xl ${stat.bgColor} flex items-center justify-center transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>

              {/* Value */}
              <div className="stat-value text-5xl sm:text-6xl lg:text-7xl font-black text-primary mb-4 transition-transform">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>

              {/* Label */}
              <h3 className="text-xl font-black mb-3 tracking-tight">{stat.label}</h3>
              <p className="text-base text-background/50 leading-relaxed">{stat.description}</p>

              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} opacity-20 rounded-tr-3xl rounded-bl-[80px]`} />
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 relative">
          <div className="banner-glow absolute inset-0 bg-primary rounded-3xl blur-xl opacity-50" />
          <div className="relative p-10 sm:p-12 bg-primary rounded-3xl text-center overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary-foreground mb-4">
                Join the elite. Start seeing results in your first week.
              </p>
              <p className="text-lg text-primary-foreground/80 font-medium">
                Over 50,000 athletes have already transformed their training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
