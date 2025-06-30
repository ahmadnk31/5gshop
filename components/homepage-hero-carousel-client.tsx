"use client";
import { useState, useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import Image from 'next/image';

function PlayPauseButton({ playing, onClick }: { playing: boolean, onClick: () => void }) {
  return (
    <button
      className="absolute left-4 bottom-4 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition"
      onClick={onClick}
      aria-label={playing ? 'Pause carousel' : 'Play carousel'}
      type="button"
    >
      {playing ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="2" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="2" fill="currentColor"/></svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 4l15 8-15 8V4z" fill="currentColor"/></svg>
      )}
    </button>
  );
}

export default function HomepageHeroCarouselClient({ items }: { items: any[] }) {
  const [playing, setPlaying] = useState(true);
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on('select', onSelect);
    onSelect();
    return () => { api.off('select', onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (api.selectedScrollSnap() === items.length - 1) {
          api.scrollTo(0); // loop to start
        } else {
          api.scrollNext();
        }
      }, 3500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api, playing, items.length]);

  return (
    <section
      className="relative animate-gradient-x bg-[length:200%_200%]"
      style={{
        background: 'linear-gradient(120deg, #16A34A 0%, #2563EB 50%, #14B8A6 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 8s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
      <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 lg:py-12">
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <Carousel setApi={setApi} opts={{ loop: true }} className="relative">
            <CarouselContent>
              {items.map((item, idx) => (
                <CarouselItem key={item.type + '-' + item.id} className="flex flex-col items-center justify-center text-center p-0 min-h-[350px] sm:min-h-[420px] lg:min-h-[500px] relative">
                  <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                      src={item.imageUrl || '/logo.svg'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className={`transition-transform duration-700 ${selectedIndex === idx ? 'fade-in' : ''}`}
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      {...(item.blurDataURL ? { placeholder: 'blur', blurDataURL: item.blurDataURL } : {})}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
                  </div>
                  <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 py-8">
                    <span className={`inline-block px-3 py-1 mb-4 rounded-full bg-white/80 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow ${selectedIndex === idx ? 'fade-in' : ''}`}>{item.type}</span>
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${selectedIndex === idx ? 'fade-in' : ''}`}>{item.name}</h2>
                    {item.subtitle && (
                      <p className={`mb-3 text-base sm:text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${selectedIndex === idx ? 'fade-in' : ''}`}>{item.subtitle}</p>
                    )}
                    <Button asChild variant="secondary" size="lg" className={`mt-2 ${selectedIndex === idx ? 'fade-in' : ''}`}>
                      <Link href={item.link}>
                        {item.cta || (item.type === 'accessory' ? 'Shop Accessory' : item.type === 'part' ? 'View Part' : 'View Device')}
                      </Link>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="z-30" />
            <CarouselNext className="z-30" />
            <PlayPauseButton playing={playing} onClick={() => setPlaying(p => !p)} />
          </Carousel>
        </div>
      </div>
    </section>
  );
} 