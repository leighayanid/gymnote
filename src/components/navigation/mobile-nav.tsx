"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Home, Dumbbell, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/workout",
    icon: Dumbbell,
    label: "Workout",
  },
  {
    href: "/history",
    icon: History,
    label: "History",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  const activeIndex = navItems.findIndex((item) =>
    pathname.startsWith(item.href)
  );

  // Initial mount animation
  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 }
      );

      // Stagger nav items
      gsap.fromTo(
        ".nav-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1.7)",
          delay: 0.4,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Animate indicator on route change
  useEffect(() => {
    if (!mounted || activeIndex === -1 || !indicatorRef.current) return;

    const activeItem = itemRefs.current[activeIndex];
    if (!activeItem) return;

    const navRect = navRef.current?.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (navRect) {
      const offsetLeft = itemRect.left - navRect.left;

      gsap.to(indicatorRef.current, {
        x: offsetLeft,
        width: itemRect.width,
        duration: 0.4,
        ease: "power3.out",
      });

      // Animate the active icon
      gsap.fromTo(
        activeItem.querySelector(".nav-icon"),
        { scale: 0.8 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }
  }, [pathname, activeIndex, mounted]);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-50 opacity-0"
      style={{ willChange: "transform" }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />

      {/* Gradient glow */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative h-20 pb-safe">
        {/* Animated indicator */}
        <div
          ref={indicatorRef}
          className="absolute top-2 h-14 rounded-2xl bg-primary/10 border border-primary/20 transition-opacity duration-300"
          style={{
            opacity: activeIndex !== -1 ? 1 : 0,
            width: "25%",
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-md" />
        </div>

        <div className="relative flex h-full items-center justify-around px-2">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={cn(
                  "nav-item relative flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs transition-all duration-300 rounded-2xl opacity-0",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "nav-icon h-6 w-6 transition-all duration-300",
                      isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-semibold transition-all duration-300",
                    isActive ? "text-[11px]" : "text-[10px]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
