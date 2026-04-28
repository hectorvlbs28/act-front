#!/usr/bin/env bash
# =============================================================================
# apply_act_theme.sh — ACT Sistemas
# Copia los archivos del tema con paleta corporativa ACT al proyecto.
# Ejecutar desde la raíz del proyecto (donde está package.json).
# =============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_ok()      { echo -e "${GREEN}[OK]${NC}    $1"; }
log_section() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

if [ ! -f "package.json" ]; then
  echo "Ejecuta desde la raíz del proyecto."
  exit 1
fi

echo ""
echo -e "${BLUE}  ACT Sistemas — Aplicar tema corporativo${NC}"
echo ""
read -p "  ¿Continuar? (s/N): " confirm
[[ "$confirm" != "s" && "$confirm" != "S" ]] && exit 0

# =============================================================================
# 1. ThemePrimitives.js
# =============================================================================
log_section "Tema — ThemePrimitives"

# Detectar la ubicación correcta según si ya se corrió el restructure o no
if [ -f "src/app/theme/ThemePrimitives.js" ]; then
  THEME_DIR="src/app/theme"
elif [ -f "src/Theme/ThemePrimitives.js" ]; then
  THEME_DIR="src/Theme"
else
  echo "No se encontró ThemePrimitives.js. Verifica la estructura del proyecto."
  exit 1
fi

cat > "${THEME_DIR}/ThemePrimitives.js" << 'THEME_EOF'
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
THEME_EOF

log_ok "${THEME_DIR}/ThemePrimitives.js"

# =============================================================================
# 2. Customizations/Inputs.jsx
# =============================================================================
log_section "Customizations/Inputs.jsx"

if [ -f "${THEME_DIR}/Customizations/Inputs.jsx" ]; then
  INPUTS_PATH="${THEME_DIR}/Customizations/Inputs.jsx"
else
  INPUTS_PATH="src/Theme/Customizations/Inputs.jsx"
fi

cat > "${INPUTS_PATH}" << 'INPUTS_EOF'
import * as React from "react";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { alpha } from "@mui/material/styles";
import { outlinedInputClasses, svgIconClasses, toggleButtonGroupClasses, toggleButtonClasses } from "@mui/material";
import { gray, brand, teal } from "../ThemePrimitives";

export const inputsCustomizations = {
  MuiButtonBase: {
    defaultProps: { disableTouchRipple: true, disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 120ms ease-in",
        "&:focus-visible": {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: 0.2,
        variants: [
          { props: { size: "small" },  style: { height: "2.25rem", padding: "8px 14px" } },
          { props: { size: "medium" }, style: { height: "2.5rem",  padding: "8px 18px" } },
          {
            props: { color: "primary", variant: "contained" },
            style: {
              color: "#ffffff",
              backgroundColor: brand[400],
              backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(brand[400], 0.35)}`,
              border: `1px solid ${brand[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: brand[500],
                boxShadow: `0 4px 12px ${alpha(brand[400], 0.45)}`,
              },
              "&:active": { backgroundColor: brand[600] },
              ...theme.applyStyles("dark", {
                backgroundColor: brand[400],
                backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
                "&:hover": { backgroundColor: brand[300], backgroundImage: "none" },
              }),
            },
          },
          {
            props: { color: "secondary", variant: "contained" },
            style: {
              color: "#ffffff",
              backgroundColor: teal[400],
              backgroundImage: `linear-gradient(160deg, ${teal[300]} 0%, ${teal[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(teal[400], 0.35)}`,
              border: `1px solid ${teal[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: teal[500],
                boxShadow: `0 4px 12px ${alpha(teal[400], 0.45)}`,
              },
              "&:active": { backgroundColor: teal[600] },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: (theme.vars || theme).palette.text.primary,
              border: "1px solid",
              borderColor: gray[200],
              backgroundColor: alpha(gray[50], 0.3),
              "&:hover": {
                backgroundColor: alpha(brand[50], 0.5),
                borderColor: brand[300],
                color: brand[600],
              },
              "&:active": { backgroundColor: alpha(brand[100], 0.4) },
              ...theme.applyStyles("dark", {
                borderColor: gray[700],
                backgroundColor: alpha(gray[800], 0.5),
                "&:hover": {
                  borderColor: brand[400],
                  backgroundColor: alpha(brand[900], 0.3),
                  color: brand[200],
                },
              }),
            },
          },
          {
            props: { variant: "text" },
            style: {
              color: gray[600],
              "&:hover": { backgroundColor: alpha(brand[400], 0.06), color: brand[600] },
              "&:active": { backgroundColor: alpha(brand[400], 0.12) },
              ...theme.applyStyles("dark", {
                color: gray[300],
                "&:hover": { backgroundColor: alpha(brand[300], 0.1), color: brand[200] },
              }),
            },
          },
          {
            props: { loading: true },
            style: {
              ...theme.applyStyles("dark",  { "& .MuiCircularProgress-root": { color: gray[100] } }),
              ...theme.applyStyles("light", { "& .MuiCircularProgress-root": { color: "#ffffff" } }),
            },
          },
        ],
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        color: (theme.vars || theme).palette.text.primary,
        border: "1px solid",
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.5),
        transition: "all 120ms ease-in",
        "&:hover": {
          backgroundColor: alpha(brand[400], 0.08),
          borderColor: brand[300],
          color: brand[600],
        },
        "&:active": { backgroundColor: alpha(brand[400], 0.15) },
        ...theme.applyStyles("dark", {
          borderColor: gray[700],
          backgroundColor: alpha(gray[800], 0.6),
          color: gray[200],
          "&:hover": {
            backgroundColor: alpha(brand[400], 0.15),
            borderColor: brand[500],
            color: brand[200],
          },
        }),
        variants: [
          {
            props: { size: "small" },
            style: { width: "2rem", height: "2rem", padding: "0.25rem", [`& .${svgIconClasses.root}`]: { fontSize: "1rem" } },
          },
          { props: { size: "medium" }, style: { width: "2.5rem", height: "2.5rem" } },
        ],
      }),
    },
  },

  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: <CheckBoxOutlineBlankRoundedIcon sx={{ color: "hsla(224, 82%, 61%, 0.0)" }} />,
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10, height: 16, width: 16, borderRadius: 5,
        border: "1px solid",
        borderColor: alpha(gray[300], 0.8),
        backgroundColor: alpha(gray[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": { borderColor: brand[400] },
        "&.Mui-focusVisible": {
          outline: `3px solid ${alpha(brand[400], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[400],
          borderColor: brand[400],
          boxShadow: "none",
          "&:hover": { backgroundColor: brand[500] },
        },
        ...theme.applyStyles("dark", {
          borderColor: alpha(gray[600], 0.8),
          backgroundColor: alpha(gray[800], 0.8),
          "&:hover": { borderColor: brand[300] },
          "&.Mui-checked": { backgroundColor: brand[400], borderColor: brand[400] },
        }),
      }),
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root:  { border: "none" },
      input: { "&::placeholder": { opacity: 0.6, color: gray[400] } },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      input: { padding: 0 },
      root: ({ theme }) => ({
        padding: "8px 12px",
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: "border 120ms ease-in, box-shadow 120ms ease-in",
        "&:hover": { borderColor: brand[400] },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `3px solid ${alpha(brand[400], 0.3)}`,
          borderColor: brand[400],
          boxShadow: `0 0 0 3px ${alpha(brand[400], 0.12)}`,
        },
        ...theme.applyStyles("dark", {
          backgroundColor: alpha(gray[800], 0.8),
          "&:hover": { borderColor: brand[400] },
          [`&.${outlinedInputClasses.focused}`]: {
            outline: `3px solid ${alpha(brand[400], 0.25)}`,
            borderColor: brand[400],
          },
        }),
        variants: [
          { props: { size: "small" },  style: { height: "2.25rem" } },
          { props: { size: "medium" }, style: { height: "2.5rem" } },
        ],
      }),
      notchedOutline: { border: "none" },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles("dark", { color: (theme.vars || theme).palette.grey[400] }),
      }),
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        fontWeight: 500,
        color: gray[600],
        ...theme.applyStyles("dark", { color: gray[400] }),
      }),
    },
  },
};
INPUTS_EOF

log_ok "${INPUTS_PATH}"

# =============================================================================
# 3. Fuente Outfit en index.html
# =============================================================================
log_section "Fuente Outfit — index.html"

if grep -q "Outfit" index.html; then
  echo -e "${GREEN}[SKIP]${NC}  Outfit ya está en index.html"
else
  # Insertar el link de Google Fonts antes del cierre de </head>
  sed -i '' 's|</head>|  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700\&display=swap" rel="stylesheet">\n</head>|' index.html
  log_ok "index.html — fuente Outfit agregada"
fi

# =============================================================================
# RESUMEN
# =============================================================================
echo ""
echo -e "${GREEN}"
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║   Tema ACT Sistemas aplicado correctamente               ║"
echo "  ╠══════════════════════════════════════════════════════════╣"
echo "  ║                                                          ║"
echo "  ║   Paleta aplicada:                                       ║"
echo "  ║   • Primary  → #4876EF  Azul ACT                        ║"
echo "  ║   • Secondary→ #00D3AB  Teal ACT                        ║"
echo "  ║   • Dark bg  → navy hsl(224, 30%, 6%)                   ║"
echo "  ║   • Tipografía→ Outfit (Google Fonts)                    ║"
echo "  ║                                                          ║"
echo "  ║   Archivos modificados:                                  ║"
echo "  ║   • ThemePrimitives.js                                   ║"
echo "  ║   • Customizations/Inputs.jsx                            ║"
echo "  ║   • index.html (fuente Outfit)                           ║"
echo "  ║                                                          ║"
echo "  ║   yarn dev  →  verificar resultado                       ║"
echo "  ║                                                          ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"