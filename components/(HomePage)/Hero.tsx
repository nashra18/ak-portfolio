import GeometrySlice from "./GeometrySlice";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  icon: string;
  download?: boolean;
};

function TextLink({ href, children, icon, download }: TextLinkProps) {
  return (
    <a
      href={href}
      download={download}
      className="group inline-flex w-fit items-center gap-2 text-base font-medium outline-offset-[6px] focus-visible:outline-2 focus-visible:outline-[#f04427]"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-[#171717] transition-transform duration-500 motion-reduce:transition-none group-hover:scale-x-0 group-focus-visible:scale-x-0" />
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[#f04427] transition-transform duration-500 motion-reduce:transition-none group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
      <span
        aria-hidden
        className="transition-transform duration-500 motion-reduce:transition-none group-hover:translate-x-1 group-focus-visible:translate-x-1"
      >
        {icon}
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <header className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#faf9f6] text-[#171717]">
      <div className="relative z-10 flex flex-col justify-start px-6 pt-12 sm:pt-16 md:px-12 lg:flex-1 lg:justify-center lg:pt-0">
        <p className="mb-5 font-[family-name:var(--font-mono)] text-xs tracking-[0.18em] text-[#77736e] uppercase md:mb-8">
          Backend Developer
        </p>

        <h1
          aria-label="Asad Khan"
          className="select-none leading-[0.85] tracking-[-0.055em] text-[clamp(4rem,21vw,9rem)] lg:text-[clamp(6rem,11vw,13rem)]"
        >
          <span aria-hidden className="block font-extrabold">
            ASAD
          </span>
          <span aria-hidden className="block pl-[0.62em] font-extralight">
            KHAN
            <span className="ml-[0.04em] inline-block size-[0.13em] rounded-full bg-[#f04427]" />
          </span>
        </h1>

        <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-[#77736e] md:mt-10 md:text-lg">
          I build backend systems with Java &amp; Spring Boot, focusing on performance, security, and products people
          actually use.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
          <TextLink href="#projects" icon="→">
            View Projects
          </TextLink>
          <TextLink href="/resume.pdf" icon="↓" download>
            Resume
          </TextLink>
        </div>
      </div>

      <div className="my-10 lg:my-0">
        <GeometrySlice />
      </div>

      <div className="relative z-10 mt-auto h-px w-full bg-[#d8d4ce]" />
    </header>
  );
}