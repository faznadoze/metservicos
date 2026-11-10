import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LogoLoaderProps {
  onComplete: () => void;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLParagraphElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  // SVG group references
  const structureGroupRef = useRef<SVGGElement>(null);
  const panelsGroupRef = useRef<SVGGElement>(null);
  const sunGroupRef = useRef<SVGGElement>(null);

  const finishLoader = () => {
    try {
      sessionStorage.setItem('met_intro_seen', '1');
    } catch {
      // Ignore storage error
    }
    onComplete();
  };

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        finishLoader();
        return;
      }

      // Master timeline with exactly 3s duration for the loading progress
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: finishLoader,
          });
        },
      });

      // 1. Progress counter object (0 to 100) running for 3 seconds
      const progressObj = { value: 0 };

      tl.to(
        progressObj,
        {
          value: 100,
          duration: 3.0,
          ease: 'power1.inOut',
          onUpdate: () => {
            const current = Math.round(progressObj.value);
            if (percentTextRef.current) {
              percentTextRef.current.textContent = `${current}%`;
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${progressObj.value}%`;
            }
          },
        },
        0
      );

      // 2. Initial setup of logo elements
      gsap.set(structureGroupRef.current, { autoAlpha: 0, scale: 0.9, y: 14, transformOrigin: 'center bottom' });
      gsap.set('.loader-panel-cell', { autoAlpha: 0, scale: 0.3, transformOrigin: 'center center' });
      gsap.set(sunGroupRef.current, { autoAlpha: 0, scale: 0.2, x: 10, y: 16, transformOrigin: '40px 40px' });

      // 3. Logo formation animation
      // Step A: Foundation Structure (Roof & 'M' house base) forms between 0.1s and 0.9s
      tl.to(
        structureGroupRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        0.1
      );

      // Step B: Photovoltaic panels assemble with smooth stagger between 0.7s and 1.6s
      tl.to(
        '.loader-panel-cell',
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.32,
          stagger: {
            each: 0.045,
            from: 'start',
          },
          ease: 'back.out(1.8)',
        },
        0.75
      );

      // Step C: O SOL APARECENDO POR ÚLTIMO (The Sun appears last between 1.6s and 2.5s)
      tl.to(
        sunGroupRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.95,
          ease: 'back.out(1.5)',
        },
        1.65
      );

      // Step D: Subtle sun aura pulse to celebrate completion
      tl.to(
        sunGroupRef.current,
        {
          scale: 1.05,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        },
        2.6
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Carregando MeT Serviços"
      className="fixed inset-0 z-50 overflow-hidden bg-white select-none"
    >
      {/* Centro da tela: Animação do logo se formando */}
      <div
        ref={logoWrapperRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
      >
        <svg
          viewBox="0 0 134.001 122.63"
          className="w-[134px] h-[122.63px] sm:w-[150px] sm:h-[138px] md:w-[168px] md:h-[154px] overflow-visible drop-shadow-[0_10px_24px_rgba(27,46,81,0.06)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. O SOL (Aparecendo por último na timeline) */}
          <g ref={sunGroupRef} id="loader-sun">
            {/* Sun Disc Body */}
            <path
              d="M19.6293 57.2507C32.3568 44.5241 45.0837 31.7965 57.8107 19.0694C53.1244 16.8947 47.7951 15.9542 42.2889 16.6179C26.5211 18.5186 15.2797 32.8417 17.1804 48.6094C17.551 51.6836 18.3958 54.5845 19.6293 57.2507Z"
              fill="#FBAE17"
            />
            {/* Sun Rays Set 1 */}
            <path
              d="M35.466 16.5683L30.9447 2.90827C30.8899 2.74306 30.9794 2.56402 31.145 2.51044C32.6645 2.01861 34.2389 1.59167 35.8338 1.23897C36.0036 1.2014 36.1719 1.31034 36.2084 1.48039L39.2292 15.5484C39.2653 15.7169 39.1585 15.8817 38.9904 15.9193C37.9214 16.1582 36.8707 16.4428 35.8588 16.7673C35.6948 16.8199 35.5201 16.7317 35.466 16.5683ZM58.1383 17.5075C57.1764 17.0959 56.1869 16.7308 55.1892 16.4194C55.0251 16.368 54.9324 16.1956 54.982 16.0308L59.129 2.25267C59.1791 2.08584 59.3557 1.99075 59.5219 2.04216C61.0999 2.52914 62.6642 3.10637 64.1815 3.76143C64.3413 3.83046 64.4137 4.01742 64.3436 4.17669L58.5483 17.3468C58.4791 17.5043 58.2965 17.5753 58.1383 17.5075ZM20.0797 28.0065L8.16667 19.9362C8.0225 19.8385 7.98457 19.6417 8.08326 19.4984C9.0317 18.1202 10.065 16.7886 11.1607 15.5333C11.2752 15.4023 11.4752 15.3904 11.6054 15.5058L22.376 25.0476C22.5047 25.1616 22.5166 25.357 22.4039 25.4869C21.7337 26.2605 21.099 27.0784 20.5124 27.9246C20.4142 28.0658 20.2221 28.1029 20.0797 28.0065ZM15.0227 46.7677L0.0101917 47.062L0.009292 47.0158C-0.0243241 45.3001 0.033381 43.5666 0.180609 41.8581C0.195529 41.6848 0.349767 41.557 0.523061 41.5732L14.8503 42.904C15.0218 42.92 15.1469 43.0708 15.1327 43.2423C15.0364 44.395 14.9992 45.5638 15.0218 46.7215L15.0227 46.7677Z"
              fill="#FBAE17"
            />
            {/* Sun Rays Set 2 */}
            <path
              d="M48.714 15.1385C47.6906 15.0478 46.6514 15.0069 45.6165 15.017C45.4444 15.0186 45.303 14.8829 45.2997 14.7109L45.1924 9.24009L44.6565 0.343334C44.6461 0.168423 44.7809 0.018856 44.956 0.0113029L45.0116 0.00896835C46.7371 -0.0248299 48.4767 0.0377312 50.1875 0.195026C50.3608 0.211025 50.4876 0.366161 50.4705 0.539276L49.0538 14.8583C49.0369 15.0296 48.8853 15.1538 48.714 15.1385ZM26.7519 21.0391L18.1874 9.4763C18.0839 9.33662 18.1132 9.13833 18.2537 9.03587C19.5932 8.05867 21.0052 7.14708 22.4586 6.32106C22.61 6.23495 22.8027 6.28978 22.8875 6.4415L29.9086 19.0015C29.9926 19.1516 29.9392 19.34 29.79 19.4256C28.8904 19.941 28.0171 20.5045 27.1872 21.1053C27.0478 21.2061 26.8544 21.1774 26.7519 21.0391ZM15.9682 36.8923L2.12683 32.9617C1.95947 32.9142 1.86168 32.7392 1.91021 32.5721C2.37221 30.9863 2.92013 29.4185 3.54212 27.9031C3.60827 27.742 3.79379 27.6664 3.95432 27.7334L17.2271 33.2898C17.3858 33.3563 17.4601 33.5375 17.3954 33.6968C17.0017 34.6644 16.6522 35.665 16.3536 36.6787C16.3049 36.8437 16.1338 36.9394 15.9682 36.8923ZM2.31109 60.8776C1.81116 59.3237 1.38692 57.7261 1.04752 56.1199C1.01157 55.9495 1.1223 55.7825 1.29272 55.7476L15.3901 52.8669C15.5587 52.8324 15.7223 52.9406 15.7584 53.1089C15.9811 54.1486 16.2553 55.1814 16.5756 56.1868C16.6278 56.3507 16.5395 56.5257 16.3761 56.5794L2.70873 61.0789C2.54334 61.1332 2.3643 61.0432 2.31109 60.8776Z"
              fill="#F9CE19"
            />
          </g>

          {/* 2. ESTRUTURA PRINCIPAL (Casa & Letra M) */}
          <g ref={structureGroupRef} id="loader-structure">
            {/* Telhado & Contorno */}
            <path
              d="M124.369 70.5422C120.676 70.5368 116.982 70.5188 113.29 70.5152C110.919 70.5134 110.043 71.1822 109.91 73.2603V117.736L88.529 117.74V70.2456H102.055V60.2507H26.8013L71.1385 15.9134C73.0387 17.8207 75.1473 19.9437 77.2631 22.0614C80.6283 25.4284 84.0043 28.781 87.3551 32.1624C88.2342 33.0486 89.2031 33.5861 90.4327 33.0846C91.6785 32.5758 91.9427 31.4972 91.923 30.2515C91.887 27.8786 91.9122 25.5039 91.9122 23.0429H101.276V24.4415C101.276 30.9238 101.307 37.4079 101.255 43.892C101.242 45.3967 101.7 46.5346 102.774 47.5988C110.058 54.8236 117.299 62.0914 124.55 69.3468C124.863 69.6596 125.162 69.9885 125.607 70.4577C125.064 70.4955 124.716 70.5422 124.369 70.5422ZM132.478 70.4631C123.988 61.9494 115.488 53.4448 106.968 44.9616C106.369 44.3648 106.117 43.777 106.121 42.9267C106.153 35.7864 106.141 28.6462 106.137 21.5077C106.137 18.9586 105.353 18.1551 102.865 18.1533C98.639 18.1479 94.4109 18.1461 90.1846 18.1551C87.9645 18.1587 87.1304 18.9766 87.0927 21.1805C87.0729 22.3454 87.0891 23.5121 87.0891 24.9933C86.6325 24.5727 86.4294 24.3965 86.2388 24.206C81.8274 19.7963 77.4123 15.3921 73.0117 10.9717C71.4136 9.36457 70.3242 9.32323 68.7351 10.9123C52.2884 27.3573 19.359 60.2507 19.359 60.2507V70.2456H77.6874V122.629C77.6874 122.629 111.927 122.638 112.337 122.609C113.653 122.516 114.446 121.82 114.676 120.511C114.76 120.032 114.755 119.532 114.755 119.041C114.759 104.967 114.757 90.8916 114.757 76.816V75.3563C120.25 75.3563 125.539 75.324 130.826 75.3779C132.302 75.3941 133.382 74.9644 134.001 73.5874V72.356C133.495 71.7215 133.046 71.033 132.478 70.4631Z"
              fill="#1B2E51"
            />
            {/* Letra M Base */}
            <path
              d="M54.0589 77.959L43.8969 94.3067L30.997 73.5546H19.359V122.63H30.0155V90.8013L43.6864 111.553H43.967L57.7782 90.5909V122.63H68.4349V86.88L54.0589 77.959Z"
              fill="#1B2E51"
            />
          </g>

          {/* 3. CÉLULAS FOTOVOLTAICAS (Painéis Solares) */}
          <g ref={panelsGroupRef} id="loader-panels">
            <path className="loader-panel-cell" d="M59.466 73.5547H56.7959L56.2757 74.3915L58.2042 75.5882L59.466 73.5547Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M68.4341 79.2301V78.5535L66.2951 77.2261L64.7795 79.6682L67.2218 81.1838L68.4341 79.2301Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M65.7315 76.8764L63.2892 75.3608L61.7738 77.8031L64.2161 79.3187L65.7315 76.8764Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M62.7258 75.0111L60.3788 73.5547H60.2471L58.7681 75.9378L61.2104 77.4534L62.7258 75.0111Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M63.6297 73.5546H61.6368L63.0756 74.4475L63.6297 73.5546Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M68.4336 74.3901L68.1598 74.2203L66.6442 76.6624L68.4336 77.7728V74.3901Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M67.5963 73.8705L67.0872 73.5546H64.4096L63.6385 74.7972L66.0807 76.3128L67.5963 73.8705Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M68.4344 85.9392V82.7168L67.436 82.0971L65.9204 84.5394L68.3627 86.055L68.4344 85.9392Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M66.8724 81.7475L64.4302 80.2319L62.9147 82.6742L65.3568 84.1898L66.8724 81.7475Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M63.8668 79.8822L61.4245 78.3666L59.9091 80.8089L62.3512 82.3245L63.8668 79.8822Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M60.8611 78.0169L58.4188 76.5013L56.9034 78.9436L59.3455 80.4592L60.8611 78.0169Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M57.8552 76.1517L55.9263 74.9548L54.4089 77.3958L56.3396 78.594L57.8552 76.1517Z" fill="#0582E8" />
            <path className="loader-panel-cell" d="M68.4339 80.4881L67.7852 81.5336L68.4339 81.9361V80.4881Z" fill="#0582E8" />
          </g>
        </svg>
      </div>

      {/* Canto inferior direito: Texto com % do progresso saindo 10% da tela na vertical e na horizontal */}
      <div
        className="pointer-events-none select-none absolute right-0 bottom-0 translate-x-[10%] translate-y-[10%] flex flex-col justify-center leading-none text-right whitespace-nowrap"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <p
          ref={percentTextRef}
          className="font-semibold italic text-[#D1D5DB] opacity-65 text-[140px] sm:text-[170px] md:text-[200px] lg:text-[230px] tracking-[-0.09em] leading-none"
        >
          0%
        </p>
      </div>

      {/* Base da tela: Barra de progresso com gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-slate-100 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#1B2E51] via-[#4A72B2] via-75% to-[#85A1D6] rounded-r-sm transition-[width] duration-75 ease-linear"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
};
