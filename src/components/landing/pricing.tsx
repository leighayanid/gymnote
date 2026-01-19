"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Crown, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "STARTER",
    price: "Free",
    description: "Perfect for beginners starting their fitness journey",
    icon: Zap,
    features: [
      "Basic workout tracking",
      "10 preset exercises",
      "Weekly progress reports",
      "Community access",
      "Mobile app access",
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "PRO",
    price: "$12",
    period: "/month",
    description: "For serious athletes who want to level up",
    icon: Sparkles,
    features: [
      "Unlimited workout tracking",
      "500+ exercises database",
      "Advanced analytics & charts",
      "AI-powered insights",
      "Custom exercise creation",
      "Progress photos",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: true,
    gradient: "from-primary to-primary/80",
  },
  {
    name: "ELITE",
    price: "$29",
    period: "/month",
    description: "Maximum power for competitive athletes",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Personal coach dashboard",
      "Team management (up to 20)",
      "Competition prep tools",
      "Video form analysis",
      "1-on-1 coaching calls",
      "White-label options",
      "API access",
    ],
    cta: "Go Elite",
    popular: false,
    gradient: "from-amber-500 to-orange-500",
  },
];

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".pricing-header > *",
        { opacity: 0, y: 50, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".pricing-header",
            start: "top 85%",
          },
        }
      );

      // Cards animation with scale pop
      gsap.fromTo(
        ".pricing-card",
        {
          opacity: 0,
          y: 100,
          scale: 0.85,
          rotateX: 15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 80%",
          },
        }
      );

      // Popular card special animation
      gsap.to(".popular-glow", {
        scale: 1.05,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Popular badge pulse
      gsap.to(".popular-badge", {
        scale: 1.08,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Card hover animations
      const cards = document.querySelectorAll(".pricing-card");
      cards.forEach((card) => {
        const icon = card.querySelector(".pricing-icon");
        const btn = card.querySelector(".pricing-btn");
        const features = card.querySelectorAll(".feature-item");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -20,
            scale: 1.03,
            duration: 0.5,
            ease: "power3.out",
          });
          gsap.to(icon, {
            scale: 1.15,
            rotate: 10,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
          gsap.to(features, {
            x: 5,
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
          });
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.4,
          });
          gsap.to(features, {
            x: 0,
            duration: 0.3,
            stagger: 0.02,
          });
        });
      });

      // Floating orbs
      gsap.to(".pricing-orb", {
        y: -30,
        x: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.8,
          from: "random",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="pricing-orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="pricing-orb absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pricing-header text-center mb-20" style={{ transformStyle: "preserve-3d" }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6">
            INVEST IN YOUR
            <span className="block text-primary mt-2">PERFORMANCE</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Choose the plan that matches your ambition. All plans include a
            <span className="text-foreground font-bold"> 14-day free trial</span>. No credit card required.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start" style={{ transformStyle: "preserve-3d" }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative rounded-3xl transition-all duration-500 ${
                plan.popular
                  ? "bg-foreground text-background md:-mt-8 md:mb-8"
                  : "bg-card border border-border/50"
              }`}
            >
              {/* Popular glow effect */}
              {plan.popular && (
                <div className="popular-glow absolute -inset-1 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-3xl blur-xl opacity-40 -z-10" />
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="popular-badge absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-primary-foreground text-sm font-black uppercase tracking-wider rounded-full shadow-lg shadow-primary/30">
                  Most Popular
                </div>
              )}

              <div className="p-8 lg:p-10">
                {/* Icon */}
                <div
                  className={`pricing-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-br " + plan.gradient + " text-white"
                  } shadow-lg`}
                >
                  <plan.icon className="w-7 h-7" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-black tracking-tight mb-3">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-6xl lg:text-7xl font-black">{plan.price}</span>
                  {plan.period && (
                    <span
                      className={`text-lg font-medium ${
                        plan.popular ? "text-background/60" : "text-muted-foreground"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  className={`text-base mb-8 ${
                    plan.popular ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                {/* CTA Button */}
                <Link href="/sign-up" className="block mb-10">
                  <Button
                    className={`pricing-btn w-full font-black h-14 text-base group ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
                        : "bg-gradient-to-r " + plan.gradient + " text-white hover:opacity-90"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="feature-item flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular
                            ? "bg-primary/20"
                            : "bg-gradient-to-br " + plan.gradient + " opacity-20"
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 ${
                            plan.popular ? "text-primary" : "text-foreground"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-base ${
                          plan.popular ? "text-background/80" : "text-muted-foreground"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corner accent */}
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${plan.gradient} opacity-5 rounded-tr-3xl rounded-bl-[120px]`}
              />
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="font-bold">14-day free trial</span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="font-bold">No credit card required</span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="font-bold">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
