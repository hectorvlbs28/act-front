import { createTheme, alpha } from "@mui/material/styles";

const defaultTheme = createTheme();
const customShadows = [...defaultTheme.shadows];

// =============================================================================
// PALETA CORPORATIVA ACT SISTEMAS
// Extraída del logotipo oficial: SitemarkIcon.jsx
// #4876EF → Azul principal ACT  (hsl 224°, 82%, 61%)
// #00D3AB → Verde teal ACT      (hsl 168°, 100%, 41%)
// #B4C0D3 → Gris azulado        (hsl 218°, 22%, 77%)
// =============================================================================

// ─── Azul principal ACT ───────────────────────────────────────────────────────
export const brand = {
  50:  "hsl(224, 100%, 96%)",
  100: "hsl(224, 95%,  92%)",
  200: "hsl(224, 90%,  82%)",
  300: "hsl(224, 85%,  71%)",
  400: "hsl(224, 82%,  61%)",   // ← #4876EF — Azul ACT
  500: "hsl(224, 82%,  52%)",
  600: "hsl(224, 82%,  43%)",
  700: "hsl(224, 82%,  32%)",
  800: "hsl(224, 82%,  20%)",
  900: "hsl(224, 82%,  12%)",
};

// ─── Verde teal ACT (acento / secundario) ─────────────────────────────────────
export const teal = {
  50:  "hsl(168, 80%,  96%)",
  100: "hsl(168, 80%,  90%)",
  200: "hsl(168, 80%,  78%)",
  300: "hsl(168, 90%,  62%)",
  400: "hsl(168, 100%, 41%)",   // ← #00D3AB — Teal ACT
  500: "hsl(168, 100%, 34%)",
  600: "hsl(168, 100%, 27%)",
  700: "hsl(168, 100%, 20%)",
  800: "hsl(168, 100%, 13%)",
  900: "hsl(168, 100%, 8%)",
};

// ─── Grises neutros con leve tono azulado ─────────────────────────────────────
export const gray = {
  50:   "hsl(220, 35%, 97%)",
  100:  "hsl(220, 28%, 94%)",
  200:  "hsl(220, 22%, 88%)",
  300:  "hsl(220, 18%, 78%)",
  400:  "hsl(220, 16%, 60%)",
  500:  "hsl(220, 14%, 42%)",
  600:  "hsl(220, 16%, 32%)",
  700:  "hsl(224, 18%, 22%)",
  800:  "hsl(224, 25%, 10%)",   // ← dark navy modo oscuro
  900:  "hsl(224, 30%, 6%)",
  1000: "rgba(0, 0, 0, 0.8)",
};

export const green = {
  50:  "hsl(168, 80%, 97%)",
  100: "hsl(168, 80%, 91%)",
  200: "hsl(168, 75%, 78%)",
  300: "hsl(168, 70%, 60%)",
  400: "hsl(168, 100%, 41%)",
  500: "hsl(168, 100%, 34%)",
  600: "hsl(168, 100%, 27%)",
  700: "hsl(168, 100%, 20%)",
  800: "hsl(168, 100%, 13%)",
  900: "hsl(168, 100%, 8%)",
};

export const orange = {
  50:  "hsl(36, 100%, 97%)",
  100: "hsl(36, 92%,  90%)",
  200: "hsl(36, 90%,  78%)",
  300: "hsl(36, 88%,  62%)",
  400: "hsl(36, 88%,  46%)",
  500: "hsl(36, 88%,  38%)",
  600: "hsl(36, 88%,  28%)",
  700: "hsl(36, 90%,  20%)",
  800: "hsl(36, 92%,  14%)",
  900: "hsl(36, 94%,  9%)",
};

export const red = {
  50:  "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%,  90%)",
  200: "hsl(0, 90%,  80%)",
  300: "hsl(0, 88%,  65%)",
  400: "hsl(0, 88%,  48%)",
  500: "hsl(0, 88%,  38%)",
  600: "hsl(0, 88%,  28%)",
  700: "hsl(0, 90%,  20%)",
  800: "hsl(0, 92%,  13%)",
  900: "hsl(0, 94%,  8%)",
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light:        brand[200],
        main:         brand[400],
        dark:         brand[700],
        contrastText: "#ffffff",
      },
      secondary: {
        light:        teal[200],
        main:         teal[400],
        dark:         teal[700],
        contrastText: "#ffffff",
      },
      info: {
        light:        brand[100],
        main:         brand[300],
        dark:         brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main:  orange[400],
        dark:  orange[700],
      },
      error: {
        light: red[300],
        main:  red[400],
        dark:  red[700],
      },
      success: {
        light: green[300],
        main:  green[400],
        dark:  green[700],
      },
      grey:    { ...gray },
      divider: alpha(gray[300], 0.4),
      background: {
        default: "hsl(220, 35%, 99%)",
        paper:   "hsl(220, 30%, 97%)",
      },
      text: {
        primary:   gray[800],
        secondary: gray[500],
        warning:   orange[400],
      },
      action: {
        hover:    alpha(brand[400], 0.06),
        selected: alpha(brand[400], 0.12),
      },
      baseShadow:
        "hsla(224, 50%, 10%, 0.07) 0px 4px 16px 0px, hsla(224, 40%, 15%, 0.07) 0px 8px 16px -5px",
    },
  },

  dark: {
    palette: {
      primary: {
        light:        brand[200],
        main:         brand[300],
        dark:         brand[700],
        contrastText: "#ffffff",
      },
      secondary: {
        light:        teal[200],
        main:         teal[300],
        dark:         teal[700],
        contrastText: gray[900],
      },
      info: {
        light:        brand[200],
        main:         brand[400],
        dark:         brand[800],
        contrastText: brand[100],
      },
      warning: {
        light: orange[300],
        main:  orange[400],
        dark:  orange[700],
      },
      error: {
        light: red[300],
        main:  red[400],
        dark:  red[700],
      },
      success: {
        light: green[300],
        main:  green[400],
        dark:  green[700],
      },
      grey:    { ...gray },
      divider: alpha(gray[700], 0.5),
      background: {
        default: gray[900],
        paper:   gray[800],
      },
      text: {
        primary:   "hsl(220, 40%, 96%)",
        secondary: gray[300],
      },
      action: {
        hover:    alpha(brand[300], 0.1),
        selected: alpha(brand[300], 0.18),
      },
      baseShadow:
        "hsla(224, 60%, 4%, 0.7) 0px 4px 16px 0px, hsla(224, 50%, 8%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "'Outfit', 'Inter', sans-serif",
  h1: { fontSize: defaultTheme.typography.pxToRem(48), fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.5 },
  h2: { fontSize: defaultTheme.typography.pxToRem(36), fontWeight: 700, lineHeight: 1.2 },
  h3: { fontSize: defaultTheme.typography.pxToRem(28), fontWeight: 600, lineHeight: 1.25 },
  h4: { fontSize: defaultTheme.typography.pxToRem(22), fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: defaultTheme.typography.pxToRem(18), fontWeight: 600 },
  h6: { fontSize: defaultTheme.typography.pxToRem(16), fontWeight: 600 },
  subtitle1: { fontSize: defaultTheme.typography.pxToRem(18) },
  subtitle2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 500 },
  body1:     { fontSize: defaultTheme.typography.pxToRem(14) },
  body2:     { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 400 },
  caption:   { fontSize: defaultTheme.typography.pxToRem(12), fontWeight: 400 },
};

export const shape   = { borderRadius: 10 };
customShadows[1]     = "var(--template-palette-baseShadow)";
export const shadows = customShadows;

export const getDesignTokens = (mode) => {
  const scheme = colorSchemes[mode];
  return { palette: { mode, ...scheme.palette }, typography, shape, shadows: customShadows };
};
