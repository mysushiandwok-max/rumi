import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#2B2320",
          soft: "#6B625D",
          faint: "#A69C96",
        },
        cream: "#FFFDFB",
        blush: {
          50: "#FDF3F6",
          100: "#FCE8ED",
          200: "#F9D4DF",
          300: "#F5B4C6",
          400: "#F08FA9",
          500: "#E8688C",
          600: "#D64C74",
          700: "#B5375D",
          800: "#8F2C4B",
        },
        mint: {
          50: "#F0F9F2",
          100: "#DFF2E4",
          200: "#C1E6CA",
          300: "#98D3A8",
          400: "#6FBB85",
          500: "#4FA067",
          600: "#3B8452",
          700: "#2E6941",
        },
        peach: {
          50: "#FDF4EA",
          100: "#FAE6CD",
          200: "#F5CE9F",
          300: "#EFB16E",
          400: "#E6944A",
          500: "#D97B33",
          600: "#B4611F",
        },
        lavender: {
          50: "#F6F3FC",
          100: "#EAE2F7",
          200: "#D4C4EF",
          300: "#B79EE2",
          400: "#9977CE",
          500: "#7E5CB5",
          600: "#654896",
        },
        // Pasteles extra para las tarjetas de "Más categorías" (distintos a blush/mint/peach/lavender y sin azules).
        pistacho: {
          50: "#F8FBEC",
          100: "#EDF4D2",
          200: "#DCEAAA",
          300: "#C3DA78",
          400: "#A2C04A",
          700: "#4F6314",
        },
        coral: {
          50: "#FFF4F1",
          100: "#FFE1DA",
          200: "#FFC6B8",
          300: "#FBA28E",
          400: "#F27C64",
          700: "#A63A26",
        },
        butter: {
          50: "#FFFBEB",
          100: "#FDF3CC",
          200: "#FAE69C",
          300: "#F5D466",
          400: "#E9BC3A",
          700: "#85600C",
        },
        latte: {
          50: "#FBF7F2",
          100: "#F3E8DC",
          200: "#E8D4BE",
          300: "#D6B795",
          400: "#BF9669",
          700: "#6E4B2A",
        },
        border: "#EFE5E1",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: "var(--destructive)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        display: ["var(--font-quicksand)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      borderRadius: {
        xl2: "1.75rem",
        pill: "999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(214, 76, 116, 0.28)",
        card: "0 12px 30px -16px rgba(43, 35, 32, 0.16)",
        pop: "0 8px 20px -8px rgba(214, 76, 116, 0.35)",
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      maxWidth: {
        container: "1360px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "grow-x": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "bob-sm": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.55" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        // Producto recién agregado entrando al carrito desde la derecha (el mismo lado del que llega el drawer).
        "cart-line-in": {
          "0%": { opacity: "0", transform: "translateX(14px)", filter: "blur(3px)" },
          "100%": { opacity: "1", transform: "translateX(0)", filter: "blur(0)" },
        },
        // Polaroid que cae y se asienta en su ángulo (--r) al cargar la ficha de una rutina.
        "polaroid-in": {
          "0%": { opacity: "0", transform: "translateY(-22px) rotate(calc(var(--r) + 10deg)) scale(0.94)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(var(--r)) scale(1)" },
        },
        // Pequeño salto de la bolsa del header cuando algo entra al carrito.
        "bag-bump": {
          "0%, 100%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0.23,1,0.32,1) both",
        "fade-up-fast": "fade-up 260ms cubic-bezier(0.23,1,0.32,1) both",
        "pop-in": "pop-in 200ms cubic-bezier(0.23,1,0.32,1) both",
        float: "float 6s ease-in-out infinite",
        "bob-sm": "bob-sm 2.6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.23,1,0.32,1) infinite",
        "cart-line-in": "cart-line-in 520ms cubic-bezier(0.23,1,0.32,1) both",
        "bag-bump": "bag-bump 420ms cubic-bezier(0.23,1,0.32,1)",
        "polaroid-in": "polaroid-in 700ms cubic-bezier(0.23,1,0.32,1) both",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // "can-hover:" limita un efecto a dispositivos con puntero real: en táctil el hover se dispara al tocar.
    plugin(({ addVariant }) => {
      addVariant("can-hover", "@media (hover: hover) and (pointer: fine)");
    }),
  ],
};

export default config;
