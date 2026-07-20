<template>
  <svg class="inf-meter-liquid-filters" aria-hidden="true" focusable="false">
    <defs>
      <filter
        id="inf-liquid-still"
        x="-15%"
        y="-120%"
        width="130%"
        height="340%"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="turbulence"
          result="inf-liquid-turbulence-still"
          seed="3"
          numOctaves="2"
          baseFrequency="0.018 0.055"
        >
          <animate
            attributeName="baseFrequency"
            dur="9s"
            repeatCount="indefinite"
            values="0.018 0.055;0.024 0.068;0.018 0.055"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="inf-liquid-turbulence-still"
          scale="3.5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter
        id="inf-liquid-active"
        x="-18%"
        y="-140%"
        width="136%"
        height="380%"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="turbulence"
          result="inf-liquid-turbulence-active"
          seed="5"
          numOctaves="3"
          baseFrequency="0.022 0.072"
        >
          <animate
            attributeName="baseFrequency"
            dur="5.5s"
            repeatCount="indefinite"
            values="0.022 0.072;0.032 0.09;0.022 0.072"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="inf-liquid-turbulence-active"
          scale="6.5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id="inf-liquid-glass-blur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
</template>

<style scoped lang="scss">
.inf-meter-liquid-filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
