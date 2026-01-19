"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#stats", label: "Results" },
  { href: "#testimonials", label: "Athletes" },
  { href: "#pricing", label: "Pricing" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Initial animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo animation with bounce
      tl.fromTo(
        logoRef.current,
        { opacity: 0, x: -40, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
      );

      // Links stagger with slide and fade
      tl.fromTo(
        linksRef.current?.querySelectorAll(".nav-link") || [],
        { opacity: 0, y: -30, rotateX: -45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // CTA buttons
      tl.fromTo(
        ".nav-cta",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, height: 0, y: -20 },
          { opacity: 1, height: "auto", y: 0, duration: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(
          mobileMenuRef.current.querySelectorAll(".mobile-link"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.15,
          }
        );
      } else {
        document.body.style.overflow = "";
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          height: 0,
          y: -10,
          duration: 0.3,
          ease: "power3.in",
        });
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Link hover animation
  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) => {
    const target = e.currentTarget;
    const underline = target.querySelector(".link-underline");
    if (underline) {
      gsap.to(underline, {
        scaleX: entering ? 1 : 0,
        transformOrigin: entering ? "left center" : "right center",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-xl shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            <span className="text-2xl font-black tracking-tight">RYNE</span>
          </div>

          {/* Desktop Navigation */}
          <div
            ref={linksRef}
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={(e) => handleLinkHover(e, true)}
                onMouseLeave={(e) => handleLinkHover(e, false)}
                className={`nav-link relative px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`link-underline absolute bottom-1 left-5 right-5 h-0.5 bg-primary rounded-full transform origin-left ${
                    activeSection === link.href.slice(1) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="nav-cta font-bold hover:bg-primary/5 transition-colors"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="nav-cta font-black px-6 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Training
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2.5 hover:bg-accent rounded-xl transition-colors"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden ${!isOpen && "hidden"}`}
        >
          <div className="py-6 space-y-2 border-t border-border/50">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`mobile-link block px-4 py-4 text-lg font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                  activeSection === link.href.slice(1)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  <ArrowRight className="w-5 h-5 opacity-50" />
                </span>
              </Link>
            ))}
            <div className="pt-6 px-4 space-y-3">
              <Link href="/sign-in" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full font-bold h-12 text-base">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full font-black h-12 text-base">
                  Start Training
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator line */}
      <div
        ref={indicatorRef}
        className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "100%" }}
      />
    </nav>
  );
}
