"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for sequenced animations
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Badge animation with bounce
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Split headline animation with 3D perspective
      const headlineText = headlineRef.current;
      if (headlineText) {
        const lines = headlineText.querySelectorAll(".headline-line");
        tl.fromTo(
          lines,
          {
            opacity: 0,
            y: 120,
            rotateX: -80,
            transformOrigin: "center top",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.4"
        );

        // Character animation for primary text
        const primaryText = headlineText.querySelector(".text-primary");
        if (primaryText) {
          gsap.to(primaryText, {
            backgroundPosition: "200% center",
            duration: 3,
            repeat: -1,
            ease: "none",
          });
        }
      }

      // Subheadline animation with blur reveal
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
        "-=0.8"
      );

      // CTA buttons with scale and glow
      tl.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      // Stats animation with count up effect
      tl.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Scroll indicator floating animation with glow pulse
      const scrollIndicator = scrollIndicatorRef.current;
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          y: 15,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
        gsap.to(scrollIndicator.querySelector(".scroll-glow"), {
          opacity: 0.3,
          scale: 1.5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Parallax effect on scroll
      gsap.to(".hero-bg", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Floating orbs animation
      gsap.to(".floating-orb", {
        y: -30,
        x: 15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random",
        },
      });

      // Orbit animation
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      // Gradient mesh animation
      gsap.to(".gradient-mesh", {
        backgroundPosition: "100% 100%",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    // Magnetic button effect
    const magneticBtn = magneticBtnRef.current;
    if (magneticBtn) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = magneticBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magneticBtn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const handleMouseLeave = () => {
        gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      };
      magneticBtn.addEventListener("mousemove", handleMouseMove);
      magneticBtn.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        magneticBtn.removeEventListener("mousemove", handleMouseMove);
        magneticBtn.removeEventListener("mouseleave", handleMouseLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 hero-bg">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/85 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/20" />
        <div className="absolute inset-0 gradient-mesh bg-gradient-to-br from-primary/10 via-transparent to-accent/10" style={{ backgroundSize: "400% 400%" }} />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="floating-orb absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="floating-orb absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Orbiting Ring */}
      <div ref={orbitRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 shadow-lg shadow-primary/50" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary/60 rounded-full -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary/40 rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary/40 rounded-full -translate-y-1/2" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full mb-10 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-sm font-bold text-primary tracking-wide uppercase">
              Trusted by 50,000+ Athletes Worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] mb-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="headline-line block overflow-hidden">
              <span className="inline-block">TRAIN HARDER.</span>
            </span>
            <span className="headline-line block overflow-hidden">
              <span className="inline-block text-primary bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text" style={{ backgroundSize: "200% 100%" }}>
                RECOVER SMARTER.
              </span>
            </span>
            <span className="headline-line block overflow-hidden">
              <span className="inline-block">DOMINATE.</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto mb-14 leading-relaxed font-medium"
          >
            The ultimate workout tracking platform built for <span className="text-foreground font-bold">elite athletes</span>.
            Track every rep, analyze your progress, and unlock your full potential
            with <span className="text-primary font-bold">AI-powered insights</span>.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
          >
            <Link href="/sign-up">
              <Button
                ref={magneticBtnRef}
                size="lg"
                className="relative h-16 px-10 text-lg font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-500 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-lg font-bold group border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="relative mr-3">
                <Play className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto"
          >
            {[
              { value: "50K+", label: "Active Athletes" },
              { value: "2M+", label: "Workouts Logged" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "4.9", label: "App Store Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="relative inline-block">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="absolute -inset-4 bg-primary/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground cursor-pointer"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
        <div className="relative">
          <div className="scroll-glow absolute inset-0 bg-primary/20 rounded-full" />
          <div className="relative w-10 h-10 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
