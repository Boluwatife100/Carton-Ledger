/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Milk-carton cream: the page and card surfaces
        milk: {
          50: "#FFFEFA",
          100: "#FBF8F0",
          200: "#F5EFDF",
          300: "#EBE2CA",
          400: "#D9CCAA",
        },
        // The blue printed on classic milk cartons: the single brand accent
        carton: {
          50: "#EEF3FA",
          100: "#DCE7F6",
          200: "#B9CFEC",
          300: "#8DB0DD",
          400: "#5E8ACB",
          500: "#2F5D9E",
          600: "#264C83",
          700: "#1E3C69",
          800: "#162C4E",
        },
        ink: {
          DEFAULT: "#1F2433",
          soft: "#4A5163",
          mute: "#7B8194",
        },
        stamp: {
          50: "#FDECEA",
          500: "#D64541",
          600: "#B9342F",
        },
        leaf: { 500: "#3F8F5F" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(31,36,51,.04), 0 10px 28px -14px rgba(31,36,51,.2)",
      },
    },
  },
  plugins: [],
};
