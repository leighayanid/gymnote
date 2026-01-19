"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Zap,
  Mail,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "API", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press Kit", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Tutorials", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer fade in
      gsap.fromTo(
        ".footer-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );

      // Brand section animation
      gsap.fromTo(
        ".footer-brand > *",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-brand",
            start: "top 90%",
          },
        }
      );

      // Links stagger
      gsap.fromTo(
        ".footer-link-group",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-links",
            start: "top 90%",
          },
        }
      );

      // Newsletter animation
      gsap.fromTo(
        ".footer-newsletter > *",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-newsletter",
            start: "top 95%",
          },
        }
      );

      // Social links hover animation
      const socialBtns = document.querySelectorAll(".social-link");
      socialBtns.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, {
            scale: 1.15,
            rotate: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Footer links hover
      const footerLinkItems = document.querySelectorAll(".footer-link-item");
      footerLinkItems.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            x: 5,
            duration: 0.2,
            ease: "power2.out",
          });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            x: 0,
            duration: 0.2,
            ease: "power2.out",
          });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-foreground text-background overflow-hidden"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="footer-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          {/* Brand Section */}
          <div className="footer-brand space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <span className="text-4xl font-black tracking-tight">RYNE</span>
            </div>

            <p className="text-background/60 max-w-md text-lg leading-relaxed">
              The ultimate workout tracking platform for elite athletes. Train
              smarter, recover faster, and <span className="text-background font-bold">dominate</span> your competition.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-background/50 hover:text-primary transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">hello@ryne.app</span>
              </div>
              <div className="flex items-center gap-4 text-background/50 hover:text-primary transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="social-link w-12 h-12 bg-background/10 hover:bg-primary rounded-xl flex items-center justify-center transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-background/60 group-hover:text-primary-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-links grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.values(footerLinks).map((section, index) => (
              <div key={index} className="footer-link-group">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6 text-background">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="footer-link-item block text-background/50 hover:text-primary transition-colors text-sm font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter border-t border-background/10 pt-16 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              GET TRAINING TIPS WEEKLY
            </h3>
            <p className="text-background/50 mb-8 text-lg">
              Join 25,000+ athletes receiving our weekly newsletter with workout
              tips, nutrition advice, and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-14 px-5 bg-background/10 border border-background/20 rounded-xl text-background placeholder:text-background/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              <button
                type="submit"
                className="h-14 px-8 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-background/40 flex items-center gap-2">
              © {new Date().getFullYear()} RYNE. Made with
              <Heart className="w-4 h-4 text-primary fill-primary" />
              for athletes worldwide.
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="#"
                className="text-sm text-background/40 hover:text-background transition-colors font-medium"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-background/40 hover:text-background transition-colors font-medium"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-background/40 hover:text-background transition-colors font-medium"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
