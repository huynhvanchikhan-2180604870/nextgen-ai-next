/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}", // App Router pages/layouts
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/styles/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/stores/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/services/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/config/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        // Tech Universe Theme Colors
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        neon: {
          blue: "#00f5ff",
          purple: "#bf00ff",
          green: "#00ff41",
          pink: "#ff0080",
          yellow: "#ffff00",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Orbitron", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 8s linear infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        typewriter: "typewriter 3s steps(40) 1s 1 normal both",
        blink: "blink 1s infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
        "3d-float": "float3d 4s ease-in-out infinite",
        hologram: "hologram 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 15px #00f5ff",
            textShadow: "0 0 5px #00f5ff, 0 0 10px #00f5ff",
          },
          "100%": {
            boxShadow: "0 0 10px #bf00ff, 0 0 20px #bf00ff, 0 0 30px #bf00ff",
            textShadow: "0 0 10px #bf00ff, 0 0 20px #bf00ff",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "currentColor" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float3d: {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
          "50%": { transform: "translateY(-10px) rotateX(5deg)" },
        },
        hologram: {
          "0%": {
            opacity: "0.8",
            filter: "hue-rotate(0deg) brightness(1)",
          },
          "100%": {
            opacity: "1",
            filter: "hue-rotate(360deg) brightness(1.2)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "neon-gradient": "linear-gradient(45deg, #00f5ff, #bf00ff, #00ff41)",
        "dark-gradient":
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      boxShadow: {
        neon: "0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 15px #00f5ff",
        "neon-purple": "0 0 5px #bf00ff, 0 0 10px #bf00ff, 0 0 15px #bf00ff",
        "neon-green": "0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      perspective: {
        1000: "1000px",
        1500: "1500px",
        2000: "2000px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
    },
  },

  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
