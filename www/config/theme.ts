import { Theme } from "reflexjs"

const theme: Theme = {
  useRootStyles: true,
  initialColorModeName: "light",
  colors: {
    text: "#191924",
    textLighter: "#60696f",
    link: "#06f",
    background: "#fff",
    heading: "#07070a",
    primary: "#06f",
    primaryHover: "#005ae0",
    secondary: "#D81159",
    secondaryHover: "#D81159",
    accent: "#7209b7",
    accentHover: "#560bad",
    selection: "#D9E9FC",
    muted: "#fafafa",
    mutedHover: "#f1f1f1",
    border: "#ebece9",
    borderHover: "#b9bdb3",
    prism: {
      text: "#d6deeb",
      background: "#011627",
      comment: "#88ac89",
      string: "rgb(173, 219, 103)",
      var: "rgb(214, 222, 235)",
      number: "rgb(247, 140, 108)",
      constant: "rgb(130, 170, 255)",
      keyword: "rgb(127, 219, 202)",
      function: "rgb(130, 170, 255)",
      punctuation: "rgb(199, 146, 234)",
      className: "rgb(255, 203, 139)",
      tag: "rgb(127, 219, 202)",
      boolean: "rgb(255, 88, 116)",
      property: "rgb(128, 203, 196)",
      namespace: "rgb(178, 204, 214)",
      deleted: "#f88484",
      inserted: "rgb(173, 219, 103)",
      highlight: "hsl(207, 93%, 23%)",
      file: "#89a8a8",
      lineNumber: "#89a8a8",
    },
    modes: {
      dark: {
        text: "#ededee",
        textLighter: "#d6deeb",
        link: "#ff94bc",
        background: "#1a202c",
        heading: "#fff",
        primary: "#06f",
        primaryHover: "#005ae0",
        secondary: "#9e0c41",
        secondaryHover: "#850a37",
        accent: "#fb3640",
        accentHover: "#fa0f1b",
        selection: "#ff70a0",
        muted: "#2a2a3c",
        mutedHover: "#212130",
        border: "#2a2a3c",
        borderHover: "#434360",
      },
    },
  },
  breakpoints: ["640px", "768px", "1024px", "1280px"],
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    heading: "inherit",
    monospace:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  lineHeights: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
    3: ".75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
  },
  space: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    18: "4.5rem",
    20: "5rem",
    22: "5.5rem",
    24: "6rem",
    26: "6.5rem",
    28: "7rem",
    30: "7.5rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
  },
  sizes: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    18: "4.5rem",
    20: "5rem",
    22: "5.5rem",
    24: "6rem",
    26: "6.5rem",
    28: "7rem",
    30: "7.5rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    auto: "auto",
    half: "50%",
    full: "100%",
    screen: "100vw",
  },
  borders: [
    0,
    "1px solid",
    "2px solid",
    "3px solid",
    "4px solid",
    "5px solid",
    "6px solid",
    "7px solid",
    "8px solid",
    "9px solid",
    "10px solid",
  ],
  radii: {
    none: "0",
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.375rem",
    xl: "0.5rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "4xl": "2rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    xl: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "2xl":
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "3xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
  },
  gridTemplateColumns: {
    none: "none",
    1: "repeat(1, minmax(0, 1fr))",
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
    5: "repeat(5, minmax(0, 1fr))",
    6: "repeat(6, minmax(0, 1fr))",
    7: "repeat(7, minmax(0, 1fr))",
    8: "repeat(8, minmax(0, 1fr))",
    9: "repeat(9, minmax(0, 1fr))",
    10: "repeat(10, minmax(0, 1fr))",
    11: "repeat(11, minmax(0, 1fr))",
    12: "repeat(12, minmax(0, 1fr))",
  },
  gridTemplateRows: {
    none: "none",
    1: "repeat(1, minmax(0, 1fr))",
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
    5: "repeat(5, minmax(0, 1fr))",
    6: "repeat(6, minmax(0, 1fr))",
  },
  styles: {
    root: {
      fontFamily: "body",
      fontSize: 16,
      lineHeight: "normal",
      fontFeatureSettings: "'kern'",
      textRendering: "optimizeLegibility",
      WebkitFontSmoothing: "antialiased",
      "*": {
        boxSizing: "border-box",
        listStyle: "none",
        border: "0 solid",
        borderColor: "border",
        m: 0,
        p: 0,

        "::selection": {
          bg: "selection",
        },
      },
      body: {
        color: "text",
        fontFamily: "body",
        fontWeight: "normal",
        fontSize: "md",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
      a: {
        color: "link",
        wordWrap: "break-word",
        textDecoration: "inherit",
        "&:hover": {
          textDecoration: "underline",
        },
      },
      button: {
        bg: "transparent",
        backgroundImage: "none",
      },
      "img, video": {
        maxWidth: "100%",
        height: "auto",
      },
      hr: {
        borderTopWidth: "1",
      },
      "pre, code, kbd, samp": {
        fontFamily: "monospace",
        m: 0,
      },
      code: {
        variant: "text.code",
      },
      ".sidebar-nav": {
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "5px",
          position: "fixed",
          right: 0,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
          transition: "background-color 2s",
        },
      },
    },
  },
  text: {
    color: "text",
    fontFamily: "body",
    lead: {
      fontSize: "2xl",
      lineHeight: "normal",
      fontWeight: "normal",
    },
    paragraph: {
      fontSize: "lg",
      my: 8,
      lineHeight: 8,
    },
    sm: {
      fontSize: "sm",
      my: 4,
      lineHeight: "normal",
    },
    link: {
      color: "link",
      textDecoration: "none",

      "&:hover, &:focus": {
        color: "link",
        textDecoration: "underline",
      },
    },
    blockquote: {
      borderLeftWidth: 5,
      pl: 8,
      py: 1,
      my: 8,

      p: {
        m: 0,
        fontWeight: "semibold",
        fontStyle: "italic",
      },

      cite: {
        fontWeight: "normal",
        mt: 4,
        display: "inline-block",
      },
    },
    code: {
      fontFamily: "monospace",
      color: "accent",
      fontSize: "sm",
      p: "0 .2em",
      borderRadius: "md",
      borderWidth: "1px",
      borderColor: "border",
      bg: "muted",
    },
    caption: {
      textAlign: "center",
      mt: 4,
      fontSize: "sm",
      color: "textLighter",
    },
    pre: {
      color: "prism.text",
      backgroundColor: "prism.background",
      fontFamily: "monospace",
      fontSize: "sm",
      fontWeight: 500,
      lineHeight: 6,
      tabSize: 2,
      hyphens: "none",
      my: 8,
      py: 6,
      overflow: "auto",
      borderRadius: "md",
      whiteSpace: "pre",
      ".plain": {
        minHeight: "1ch",
        display: "inline-block",
      },
      ".tag": {
        color: "prism.tag",
      },
      ".attr-name": {
        fontStyle: "italic",
      },
      ".comment": {
        color: "prism.comment",
        fontStyle: "italic",
      },
      ".attr-name, .string, .url": {
        color: "prism.string",
      },
      ".variable": {
        color: "prism.var",
      },
      ".number": {
        color: "prism.number",
      },
      ".builtin, .char, .constant": {
        color: "prism.constant",
      },
      ".function": {
        color: "prism.function",
      },
      ".punctuation, .selector, .doctype": {
        color: "prism.punctuation",
      },
      ".class-name": {
        color: "prism.className",
      },
      ".operator, .keyword": {
        color: "prism.keyword",
      },
      ".boolean": {
        color: "prism.boolean",
      },
      ".property": {
        color: "prism.property",
      },
      ".namespace": {
        color: "prism.namespace",
      },
      ".highlight": {
        bg: "prism.highlight",
      },
      ".deleted": {
        color: "prism.deleted",
      },
      ".inserted": {
        color: "prism.inserted",
      },
    },
  },
  subheading: {
    color: "textLighter",
    textTransform: "uppercase",
    m: 0,
  },
  heading: {
    color: "heading",
    fontFamily: "heading",
    fontWeight: "semibold",
    lineHeight: "tight",
    letterSpacing: "tight",

    h1: {
      fontSize: "5xl|6xl",
      fontWeight: "bold",
      lineHeight: "1.1",
    },
    h2: {
      fontSize: "3xl|4xl",
    },
    h3: {
      fontSize: "2xl",
    },
    h4: {
      fontSize: "xl",
      letterSpacing: "normal",
    },
    h5: {
      fontSize: "lg",
      fontFamily: "body",
      letterSpacing: "normal",
    },
    h6: {
      fontSize: "sm",
      fontFamily: "body",
      textTransform: "uppercase",
      letterSpacing: "normal",
    },
  },

  container: {
    px: "6|6|6|4",
    mx: "auto",
    maxWidth: 1380,

    sm: {
      maxWidth: 670,
    },

    md: {
      maxWidth: 768,
    },

    lg: {
      maxWidth: 1024,
    },

    xl: {
      maxWidth: 1280,
    },
  },

  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "text",
    bg: "muted",
    fontFamily: "body",
    fontSize: "md",
    fontWeight: "medium",
    lineHeight: "none",
    textDecoration: "none",
    border: "1px solid",
    borderColor: "border",
    borderRadius: "md",
    px: 4,
    py: 3,
    cursor: "pointer",
    transition: "all .15s ease-in",
    h: 12,

    ":hover, :focus": {
      transform: "translateY(-2px)",
      boxShadow: "lg",
      textDecoration: "none",
    },

    sm: {
      px: 3,
      py: 2,
      fontSize: "sm",
      h: 8,

      svg: {
        size: 4,
      },
    },

    lg: {
      px: 5,
      py: 4,
      fontSize: "xl",
      h: 14,

      svg: {
        size: 8,
      },
    },

    muted: {
      bg: "muted",
      color: "text",
      borderColor: "muted",

      "&:hover, &:focus": {
        bg: "mutedHover",
        color: "text",
        borderColor: "mutedHover",
      },
    },

    primary: {
      bg: "primary",
      color: "white",
      borderColor: "primary",

      "&:hover, &:focus": {
        bg: "primaryHover",
        color: "white",
        borderColor: "primaryHover",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      },
    },

    secondary: {
      bg: "secondary",
      color: "white",
      borderColor: "secondary",

      "&:hover, &:focus": {
        bg: "secondaryHover",
        color: "white",
        borderColor: "secondaryHover",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      },
    },

    accent: {
      bg: "accent",
      color: "white",
      borderColor: "accent",

      "&:hover, &:focus": {
        bg: "accentHover",
        color: "white",
        borderColor: "accentHover",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      },
    },

    link: {
      bg: "transparent",
      color: "link",
      borderColor: "transparent",

      "&:hover, &:focus": {
        bg: "transparent",
        borderColor: "transparent",
        transform: "none",
        boxShadow: "none",
        textDecoration: "underline",
      },
    },

    icon: {
      bg: "transparent",
      color: "text",
      borderColor: "transparent",
      p: 2,

      "&:hover, &:focus": {
        bg: "muted",
        borderColor: "muted",
        transform: "none",
        boxShadow: "none",
        color: "link",
      },

      svg: {
        size: 6,
      },
    },

    navbar: {
      color: "text",
      bg: "transparent",
      borderColor: "transparent",
      py: 0,
      px: 2,
      h: 9,

      "&:hover, &:focus": {
        bg: "transparent",
        borderColor: "transparent",
        transform: "none",
        boxShadow: "none",
        color: "link",
      },

      svg: {
        size: 6,
      },
    },
  },
  input: {
    bg: "muted",
    color: "text",
    fontFamily: "body",
    fontSize: "md",
    lineHeight: "none",
    borderWidth: 1,
    borderColor: "border",
    borderRadius: "md",
    px: 4,
    py: 3,
    width: "100%",
    h: 12,

    sm: {
      py: 2,
      fontSize: "sm",
      h: 8,
    },

    lg: {
      py: 4,
      fontSize: "xl",
      h: 14,
    },

    "&:focus": {
      borderColor: "primary",
      outline: "none",
    },

    "&[type=checkbox], &[type=radio]": {
      display: "none",

      "+ label": {
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",

        "&:before": {
          content: "''",
          width: "14px",
          height: "14px",
          flex: "none",
          bg: "background",
          borderRadius: "sm",
          mr: 3,
          border: "2px solid",
          borderColor: "background",
          boxShadow: ({ colors }) => `0 0 0 1px ${colors.border}`,
        },
      },
    },

    "&:checked + label:before": {
      bg: "primary",
      boxShadow: ({ colors }) => `0 0 0 2px ${colors.primary}`,
    },

    "&[type=radio]": {
      "+ label": {
        "&:before": {
          borderRadius: "full",
        },
      },
    },
  },
  select: {
    variant: "input",
    pl: 4,
    pr: 12,
    py: 3,
    h: 12,
    appearance: "none",
    cursor: "pointer",
    width: "100%",
    backgroundImage:
      'url("data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJjYXJldC1kb3duIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtY2FyZXQtZG93biBmYS13LTEwIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDMyMCA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMxLjMgMTkyaDI1Ny4zYzE3LjggMCAyNi43IDIxLjUgMTQuMSAzNC4xTDE3NC4xIDM1NC44Yy03LjggNy44LTIwLjUgNy44LTI4LjMgMEwxNy4yIDIyNi4xQzQuNiAyMTMuNSAxMy41IDE5MiAzMS4zIDE5MnoiPjwvcGF0aD48L3N2Zz4=")',
    backgroundPosition: "right 16px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: 8,

    sm: {
      py: 2,
      fontSize: "sm",
      h: 8,
    },

    lg: {
      py: 4,
      fontSize: "xl",
      h: 14,
    },
  },

  textarea: {
    variant: "input",
  },

  fieldset: {
    border: "1px solid",
    borderColor: "border",
    borderRadius: "md",
  },

  table: {
    mt: 6,
    w: "full",
    borderCollapse: "collapse",

    "tr:hover": {
      bg: "muted",
    },
    "td, th": {
      borderBottomWidth: 1,
      p: 2,

      code: {
        fontSize: "md",
      },
    },
    th: {
      textAlign: "left",
      fontWeight: "semibold",
      bg: "muted",
    },
  },

  list: {
    variant: "text.paragraph",
    my: 6,
    ml: 10,

    code: {
      fontFamily: "monospace",
      color: "accent",
      fontSize: "sm",
      p: "0 .2em",
      borderRadius: "md",
      borderWidth: "1px",
      borderColor: "border",
      bg: "muted",
    },

    li: {
      mb: 2,

      p: {
        m: 0,
      },
    },

    unordered: {
      "> li": {
        listStyle: "disc",
      },
    },

    ordered: {
      "> li": {
        listStyle: "decimal",
      },
    },
  },

  icons: {
    logo: `<svg viewBox="0 0 187 244" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M131.64 51.91C114.491 34.769 98.13 18.428 93.26 0c-4.87 18.429-21.234 34.769-38.38 51.91C29.16 77.612 0 106.743 0 150.434a93.258 93.258 0 0057.566 86.191A93.258 93.258 0 00159.22 216.4a93.248 93.248 0 0027.305-65.966c0-43.688-29.158-72.821-54.885-98.524zm-92 120.256c-5.719-.194-26.824-36.571 12.329-75.303l25.909 28.301a2.212 2.212 0 01.413 2.586 2.226 2.226 0 01-.586.719c-6.183 6.34-32.534 32.765-35.81 41.902-.675 1.886-1.663 1.815-2.256 1.795zm53.623 47.943a32.074 32.074 0 01-32.076-32.075 33.423 33.423 0 017.995-21.187c5.784-7.072 24.076-26.963 24.076-26.963s18.013 20.183 24.034 26.896a31.366 31.366 0 018.046 21.254 32.078 32.078 0 01-9.394 22.681 32.078 32.078 0 01-22.681 9.394zm61.392-52.015c-.691 1.512-2.259 4.036-4.376 4.113-3.773.138-4.176-1.796-6.965-5.923-6.122-9.06-59.551-64.9-69.545-75.699-8.79-9.498-1.238-16.195 2.266-19.704C80.43 66.478 93.26 53.656 93.26 53.656s38.254 36.296 54.19 61.096c15.935 24.8 10.443 46.26 7.205 53.342" fill="currentColor"/></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h186.525v243.713H0z"/></clipPath></defs></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    chevron: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    "chevron-right": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
    "chevron-left": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
    "arrow-right": `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`,
    github: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
    "menu-alt": `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>`,
    external: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 3 14 9-14 9V3z"/></svg>`,
  },
}

export default theme
