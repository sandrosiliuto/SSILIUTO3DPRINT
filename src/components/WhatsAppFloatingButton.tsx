export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/34618514254?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20una%20escultura%203D%20personalizada"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp con SSILIUTOIMPRESION3D (+34 618 514 254)"
      className="fixed bottom-5 right-5 z-40 group inline-flex items-center gap-3 rounded-full border border-[#00F5FF]/70 bg-[#0A0A0F] p-3.5 md:px-4 md:py-3 text-white whatsapp-neon-halo hover:border-[#B4FF39] transition-colors"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 fill-[#B4FF39] shrink-0"
        aria-hidden="true"
      >
        <path d="M16 3C8.83 3 3 8.83 3 16c0 2.49.71 4.91 2.05 7.01L3.3 28.7l5.86-1.69A12.93 12.93 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.62c-2.16 0-4.27-.58-6.11-1.67l-.44-.26-3.48 1 1-3.39-.28-.45A10.57 10.57 0 0 1 5.38 16C5.38 10.14 10.14 5.38 16 5.38S26.62 10.14 26.62 16 21.86 26.62 16 26.62zm5.82-7.92c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1.01 1.24-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.88-.77 2.14-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37z" />
      </svg>
      <span className="hidden md:inline font-tech-mono text-xs font-bold tracking-wide text-slate-100 group-hover:text-[#00F5FF] whitespace-nowrap">
        WhatsApp Directo
      </span>
    </a>
  );
}
