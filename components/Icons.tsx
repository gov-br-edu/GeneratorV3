import React from 'react';
import QRCode from 'qrcode';

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const PrinterIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

export const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

// Componente auxiliar para carregar imagens externas e converter para Base64
// Isso evita problemas de CORS no html2canvas/PDF
const AsyncImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Adiciona timestamp para evitar cache 'tainted' do navegador
        const response = await fetch(src + '?t=' + new Date().getTime());
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === 'string') {
            setDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.warn("Falha ao converter imagem para base64, usando URL direta.", e);
      }
    };
    load();
    return () => { active = false; };
  }, [src]);

  // Se tivermos o Data URL (base64), usamos ele. Senão, tentamos o link direto como fallback.
  return (
    <img 
      src={dataUrl || src} 
      alt={alt} 
      className={className} 
      crossOrigin="anonymous" 
    />
  );
};

// Logo Oficial do IF via URL externa (convertida para base64 internamente)
export const IFLogo = ({ className }: { className?: string }) => (
  <AsyncImage 
    src="https://i.ibb.co/23RFX4M0/Instituto-Federal-Marca-2015-svg.png" 
    alt="Instituto Federal" 
    className={className}
  />
);

// QR Code gerado localmente para garantir funcionamento no PDF
// URL de destino: https://gov-br-edu.github.io/AutenticadorIFTM/
export const QRCodeImage = ({ className }: { className?: string }) => {
  const [src, setSrc] = React.useState<string>('');
  
  // URL de autenticação solicitada
  const targetUrl = "https://gov-br-edu.github.io/AutenticadorIFTM/";

  React.useEffect(() => {
    // Gera o QR Code localmente como data:image/png;base64
    QRCode.toDataURL(targetUrl, { 
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 200 // Tamanho alto para qualidade
    })
    .then(url => {
        setSrc(url);
    })
    .catch(err => {
        console.error("Erro ao gerar QR Code", err);
    });
  }, []);

  if (!src) return <div className={`bg-gray-200 animate-pulse ${className}`} />;

  return (
    <img 
      src={src} 
      className={className} 
      alt="QR Code Autenticador" 
    />
  );
};

// Random-looking static barcode pattern
export const BarcodePlaceholder = () => {
  const weights = [
    2, 1, 3, 1, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 1, 1, 
    3, 2, 1, 1, 4, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1,
    2, 1, 4, 1, 1, 2, 3, 1, 1, 2, 1, 3
  ];

  let currentX = 0;
  const bars = [];
  
  for (let i = 0; i < weights.length; i++) {
    const width = weights[i];
    const gap = (i % 5 === 0) ? 2 : 1;

    bars.push(
      <rect key={i} x={currentX} y="0" width={width} height="50" fill="black" />
    );
    
    currentX += width + gap;
    if (currentX >= 200) break;
  }

  return (
    <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
      {bars}
    </svg>
  );
};