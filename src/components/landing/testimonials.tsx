"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Star, Zap, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Professional Powerlifter",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote:
      "RYNE transformed my training. I've hit PRs I never thought possible. The AI insights helped me identify and fix weaknesses in my form I didn't even know I had.",
    rating: 5,
    stats: "Deadlift: 550 → 705 lbs",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Sarah Chen",
    role: "CrossFit Athlete",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote:
      "As a competitive CrossFit athlete, tracking varied workouts was always a nightmare. RYNE makes it seamless. My performance metrics have skyrocketed since I started.",
    rating: 5,
    stats: "Fran time: 4:12 → 2:58",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    name: "David Rodriguez",
    role: "Olympic Weightlifter",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote:
      "The precision tracking is unmatched. Every kilo, every attempt is logged perfectly. It's like having a world-class coach analyzing every session.",
    rating: 5,
    stats: "Snatch: 125 → 152 kg",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Jessica Williams",
    role: "Fitness Influencer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote:
      "My followers always ask how I stay so consistent. The answer is RYNE. The app keeps me accountable and motivated every single day.",
    rating: 5,
    stats: "500K+ followers inspired",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Mike Thompson",
    role: "Bodybuilder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote:
      "Contest prep has never been easier. I can track everything from macros to muscle measurements. RYNE helped me win my first pro card.",
    rating: 5,
    stats: "Won IFBB Pro Card",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    name: "Emma Davis",
    role: "Marathon Runner",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    quote:
      "Even for endurance athletes, RYNE delivers. The analytics helped me optimize my strength training to complement my running perfectly.",
    rating: 5,
    stats: "Marathon: 3:45 → 3:12",
    gradient: "from-purple-500 to-violet-600",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".testimonials-header > *",
        { opacity: 0, y: 50, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".testimonials-header",
            start: "top 85%",
          },
        }
      );

      // Cards animation with stagger from center
      gsap.fromTo(
        ".testimonial-card",
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotateY: -10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.9,
          stagger: {
            each: 0.1,
            from: "center",
          },
          ease: "power4.out",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 80%",
          },
        }
      );

      // Floating animation for quote icons
      gsap.to(".quote-icon", {
        y: -8,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.4,
          from: "random",
        },
      });

      // Card hover animations
      const cards = document.querySelectorAll(".testimonial-card");
      cards.forEach((card) => {
        const image = card.querySelector(".testimonial-image");
        const quote = card.querySelector(".quote-icon");
        const statsBadge = card.querySelector(".stats-badge");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -15,
            scale: 1.02,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(image, {
            scale: 1.1,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(quote, {
            scale: 1.2,
            rotation: 10,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
          gsap.to(statsBadge, {
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
          gsap.to(image, {
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(quote, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
          });
          gsap.to(statsBadge, {
            scale: 1,
            duration: 0.3,
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/10 to-background" />
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="testimonials-header text-center mb-20" style={{ transformStyle: "preserve-3d" }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
            ATHLETES WHO
            <span className="block text-primary mt-2">DOMINATE</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Don&apos;t just take our word for it. Hear from the <span className="text-foreground font-bold">champions</span> who use
            RYNE to push their limits every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          style={{ transformStyle: "preserve-3d" }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative p-8 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Quote Icon */}
              <div className="quote-icon absolute top-6 right-6 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 mb-8 leading-relaxed text-lg">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Stats Badge */}
              <div className={`stats-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${testimonial.gradient} rounded-full mb-8`}>
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">
                  {testimonial.stats}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-image w-14 h-14 rounded-2xl object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${testimonial.gradient} opacity-5 rounded-bl-3xl rounded-tr-[100px]`} />
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 4).map((t, i) => (
                <img
                  key={i}
                  src={t.image}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm font-bold">+50,000 athletes</span>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9/5 rating</span>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <span className="text-sm font-bold">Trusted by professionals worldwide</span>
        </div>
      </div>
    </section>
  );
}
