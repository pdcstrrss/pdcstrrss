export const SvgSprite = () => (
  <div hidden>
    <svg>
      <defs>
        <symbol id="play" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5l-6 4.5z"
          ></path>
        </symbol>

        <symbol id="chevron-left" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"></path>
        </symbol>

        <symbol id="chevron-right" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"></path>
        </symbol>

        <symbol id="github" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
          />
        </symbol>

        <symbol viewBox="0 0 24 24" id="check">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"></path>
        </symbol>

        <symbol viewBox="0 0 24 24" id="trash">
          <path
            fill="currentColor"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          ></path>
        </symbol>

        <symbol viewBox="0 0 24 24" id="ic-plus">
          <path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"></path>
        </symbol>

        <symbol id="logo" viewBox="0 0 54 54">
          <path
            d="M4.5 54C6.98528 54 9 51.9853 9 49.5C9 47.0147 6.98528 45 4.5 45C2.01472 45 2.15529e-07 47.0147 4.81397e-07 49.5C7.47265e-07 51.9853 2.01472 54 4.5 54Z"
            fill="var(--logo-layer-1, #6366F1)"
          />
          <path
            d="M3.26274 23.76C18.162 23.76 30.2402 35.8382 30.2402 50.7375C30.2402 65.6367 -11.6365 23.76 3.26274 23.76Z"
            fill="var(--logo-layer-2, #5EEAD4)"
          />
          <path
            d="M5.73471 3.0293e-06C32.3909 1.35626e-06 54 21.6091 54 48.2653C54 74.9215 -20.9215 4.70234e-06 5.73471 3.0293e-06Z"
            fill="var(--logo-layer-1, #6366F1)"
          />
        </symbol>

        <symbol id="primary-noise" viewBox="0 0 700 700" opacity="1">
          <defs>
            <filter
              id="nnnoise-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="linearRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.2"
                numOctaves="4"
                seed="15"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feSpecularLighting
                surfaceScale="13"
                specularConstant="3"
                specularExponent="20"
                lightingColor="#6366f1"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                result="specularLighting"
              >
                <feDistantLight azimuth="3" elevation="139"></feDistantLight>
              </feSpecularLighting>
            </filter>
          </defs>
          <rect width="700" height="700" fill="#6366f1"></rect>
          <rect width="700" height="700" fill="#6366f1" filter="url(#nnnoise-filter)"></rect>
        </symbol>
      </defs>
    </svg>
  </div>
);
