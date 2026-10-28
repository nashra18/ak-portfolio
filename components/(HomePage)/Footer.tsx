"use client";

import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-footer-display" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-footer-body" });
const DISPLAY = "font-[family-name:var(--font-footer-display)]";

/*
  Palette (same as the Approach section)
  Cream    #F6F7EB  text
  Charcoal #393E41  background
  Coral    #FF8A75  hover and small accents (4.7:1 on charcoal)
*/

type IconProps = React.SVGProps<SVGSVGElement>;

const LinkedInIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LeetCodeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const ArrowIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const EMAIL = "khanasad1907@gmail.com";

const LINKS: { Icon: (p: IconProps) => React.JSX.Element; label: string; cta: string; meta: string; href: string }[] = [
  {
    Icon: LinkedInIcon,
    label: "LinkedIn",
    cta: "Let's Connect",
    meta: "linkedin.com/in/meranaamkhann",
    href: "https://linkedin.com/in/meranaamkhann",
  },
  {
    Icon: GitHubIcon,
    label: "GitHub",
    cta: "GitHub — 6+ projects",
    meta: "github.com/meranaamkhann",
    href: "https://github.com/meranaamkhann",
  },
  {
    Icon: LeetCodeIcon,
    label: "LeetCode Profile",
    cta: "700+ problems solved",
    meta: "leetcode.com/meranaamkhann",
    href: "https://leetcode.com/meranaamkhann",
  },
];

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer
      id="contact"
      className={`${display.variable} ${body.variable} bg-[#393E41] px-5 pb-6 pt-20 font-[family-name:var(--font-footer-body)] text-[#F6F7EB] antialiased md:px-12 md:pt-32 lg:px-16`}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* headline */}
        <p className="flex items-center gap-3 text-[15px] text-[#F6F7EB]/90">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#FF8A75]" />
          Backend developer, open to new projects
        </p>
        <h2
          className={`${DISPLAY} mt-6 text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.88] tracking-[-0.06em]`}
        >
          Say Hello
        </h2>
        <p className={`${DISPLAY} mt-4 text-xl font-semibold tracking-[-0.02em] text-[#FF8A75] md:text-2xl`}>
          Get In Touch
        </p>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-x-12">
          <p className="max-w-[42ch] text-base font-medium leading-[1.65] text-[#F6F7EB]/90 md:col-span-5 md:text-lg">
            Always open to new opportunities, collaborations, and conversations. Feel free to reach out—I&apos;ll get
            back to you soon.
          </p>

          {/* email */}
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-sm text-[#F6F7EB]/80">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className={`${DISPLAY} group mt-2 inline-block break-all text-[clamp(1.5rem,3.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8A75]`}
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_2px] bg-[position:0_100%] bg-no-repeat pb-1 transition-[background-size,color] duration-500 group-hover:bg-[length:0_2px] group-hover:text-[#FF8A75] motion-reduce:transition-none">
                {EMAIL}
              </span>
            </a>
          </div>
        </div>

        {/* profiles */}
        <ul className="mt-16 border-t border-[#F6F7EB]/30 md:mt-24">
          {LINKS.map(({ Icon, label, cta, meta, href }) => (
            <li key={label} className="border-b border-[#F6F7EB]/30">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${cta}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 transition-colors duration-300 hover:text-[#FF8A75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF8A75] motion-reduce:transition-none md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:py-8"
              >
                <span className="flex items-center gap-4">
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                  <span className={`${DISPLAY} text-2xl font-semibold tracking-[-0.04em] md:text-4xl`}>{label}</span>
                </span>
                <span className="col-span-2 row-start-2 text-[15px] leading-[1.5] text-[#F6F7EB]/80 transition-colors duration-300 group-hover:text-[#FF8A75] md:col-span-1 md:row-start-1">
                  {cta}
                  <span className="block text-sm text-[#F6F7EB]/70 transition-colors duration-300 group-hover:text-[#FF8A75]">
                    {meta}
                  </span>
                </span>
                <ArrowIcon
                  aria-hidden="true"
                  className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none md:h-8 md:w-8"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col gap-6 text-[15px] text-[#F6F7EB]/80 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Backend Developer. Java, Spring Boot, REST APIs.
          </p>

          <nav aria-label="Footer" className="flex items-center gap-6">
            {NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="transition-colors duration-300 hover:text-[#FF8A75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8A75] motion-reduce:transition-none"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={toTop}
              className="group flex items-center gap-2 text-[#F6F7EB] transition-colors duration-300 hover:text-[#FF8A75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8A75] motion-reduce:transition-none"
            >
              Back to top
              <ArrowIcon aria-hidden="true" className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}