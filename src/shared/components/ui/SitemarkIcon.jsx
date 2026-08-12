import React from 'react';

const SitemarkIcon = ({ size = 'medium' }) => {
  const sizeConfig = {
    small: {
      padding: '4px',
      acronymFontSize: '42px',
      subtextFontSize: '19px',
      svgWidth: '100px',
      svgHeight: '40px',
      svgTop: '-2px',
      svgLeft: '40px',
      hoverScale: '1.01',
      mobileScale: '0.7',
    },
    medium: {
      padding: '8px',
      acronymFontSize: '64px',
      subtextFontSize: '28px',
      svgWidth: '150px',
      svgHeight: '60px',
      svgTop: '-4px',
      svgLeft: '60px',
      hoverScale: '1.02',
      mobileScale: '0.8',
    },
    large: {
      padding: '12px',
      acronymFontSize: '90px',
      subtextFontSize: '38px',
      svgWidth: '210px',
      svgHeight: '84px',
      svgTop: '-6px',
      svgLeft: '85px',
      hoverScale: '1.03',
      mobileScale: '0.9',
    },
  };

  const resolvedSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');

          .act-logo-container {
            display: inline-block;
            text-decoration: none;
            position: relative;
            padding: var(--logo-padding);
            cursor: pointer;
            user-select: none;
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .act-logo-container:hover {
            transform: translateY(-2px) scale(var(--logo-hover-scale));
          }

          /* Wrapper principal que contiene el texto y posiciona el SVG relativo a él */
          .act-logo-content {
            position: relative;
            display: inline-flex;
            flex-direction: column;
          }

          .act-logo-container .logo-text-wrapper {
            display: flex;
            flex-direction: column;
            color: #ffffff;
            font-family: 'Poppins', sans-serif;
            position: relative;
            z-index: 2; /* Mantiene las letras sobre el mapa */
          }

          .act-logo-container .logo-acronym {
            font-size: var(--logo-acronym-font-size);
            font-weight: 600;
            line-height: 0.85;
            letter-spacing: -1.5px;
          }

          .act-logo-container .logo-subtext {
            font-size: var(--logo-subtext-font-size);
            font-weight: 300;
            line-height: 1.1;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }

          /* El SVG de la silueta/isla superpuesto */
          .act-logo-container .logo-svg-map {
            position: absolute;
            top: var(--logo-svg-top);
            left: var(--logo-svg-left);
            width: var(--logo-svg-width);
            height: var(--logo-svg-height);
            z-index: 1; /* Queda detrás del texto */
            pointer-events: none;
            transition: opacity 0.3s ease;
          }

          .act-logo-container:hover .logo-svg-map path {
            stroke: #e0e0e0;
          }

          @media (max-width: 768px) {
            .act-logo-container {
              transform: scale(var(--logo-mobile-scale));
              transform-origin: left center;
            }
          }
        `}
      </style>

      <a
        href="/"
        className="act-logo-container"
        aria-label="ACT Sistemas - Inicio"
        style={{
          '--logo-padding': resolvedSize.padding,
          '--logo-acronym-font-size': resolvedSize.acronymFontSize,
          '--logo-subtext-font-size': resolvedSize.subtextFontSize,
          '--logo-svg-width': resolvedSize.svgWidth,
          '--logo-svg-height': resolvedSize.svgHeight,
          '--logo-svg-top': resolvedSize.svgTop,
          '--logo-svg-left': resolvedSize.svgLeft,
          '--logo-hover-scale': resolvedSize.hoverScale,
          '--logo-mobile-scale': resolvedSize.mobileScale,
        }}
      >
        <div className="act-logo-content">
          <div className="logo-text-wrapper">
            <span className="logo-acronym">ACT</span>
            <span className="logo-subtext">Sistemas</span>
          </div>

          {/* Silueta vectorial precisa de la isla (SVG ultra liviano) */}
          <svg
            className="logo-svg-map"
            viewBox="0 0 240 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 50 C 15 42, 35 30, 60 25 C 95 18, 145 10, 190 12 C 210 13, 222 18, 228 24 C 235 31, 230 42, 222 47 C 215 51, 208 42, 200 44 C 193 46, 196 56, 185 55 C 175 54, 172 45, 160 47 C 145 49, 130 54, 110 57 C 80 62, 50 63, 30 60 C 18 58, 8 55, 10 50 Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>
    </>
  );
};

export default SitemarkIcon;
