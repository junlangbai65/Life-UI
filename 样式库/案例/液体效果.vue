<style scoped>
  .water-toggle {
    display: inline-block;
    position: relative;
  }

  .water-toggle input#toggle-wave {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .container {
    position: relative;
    z-index: 1;
    filter: url(#still-water);
    animation: wave 10s infinite ease-in-out;
    transition: 1s;
    display: block;
  }

  .water-toggle:hover .container {
    filter: url(#water-rotate);
    transition: 0.5s;
    animation: wave 8s infinite ease-in-out;
  }

  input#toggle-wave:checked ~ .container {
    animation: beeg-wave 3.5s infinite ease-in-out;
    scale: 0.75;
  }

  .water-button {
    position: relative;
    z-index: 5;
    font-size: 1.5rem;
    padding: 1em 2em;
    border: none;
    border-radius: 50em;
    background: #50626b22;
    outline: 3px solid #3f545f33;
    color: #d1d7e48b;
    text-shadow: 0px 0px 8px #79a5adda;
    font-weight: bold;
    backdrop-filter: url(#water) blur(0.4rem);
    cursor: pointer;
    font-family: Tahoma, sans-serif;
    translate: 10px;
    transition: 1s;
    box-shadow: inset 2px 3px 4px #d4f7fe25;
  }

  .water-toggle:hover .water-button {
    text-shadow: 0px 0px 12px #49e1ffda;
    background: #13b0ff3d;
    outline-color: #00aaff00;
    padding: 2em;
    box-shadow:
      inset 0px 0px 8px #7ae9ff25,
      0px 0px 64px #39d9f96f;
  }

  input#toggle-wave:checked ~ .container .water-button {
    text-shadow:
      0px 0px 48px #7ae9ff,
      0px 0px 12px #7ae9ff,
      0px 0px 12px #7ae9ff,
      0px 0px 64px #39d9f9;
    box-shadow:
      inset 0px 0px 12px #7ae9ff46,
      inset 0px 0px 8px #7ae9ff25,
      0px 0px 8px #7ae9ff84,
      0px 0px 64px #39d9f96f;
    padding: 20% 2em;
    transition: 1s;
  }

  /* animations */
  @keyframes wave {
    0% {
      padding: 1rem;
    }
    50% {
      padding: 10rem;
    }
    100% {
      padding: 1rem;
    }
  }

  @keyframes beeg-wave {
    0% {
      padding: 1rem;
    }
    50% {
      padding: 12rem;
    }
    100% {
      padding: 1rem;
    }
  }
</style>

<template>
  <label class="water-toggle">
    <input type="checkbox" id="toggle-wave" />
    <div class="container">
      <button class="water-button">water</button>
      <svg style="position: absolute; width: 0; height: 0">
        <filter id="water-rotate">
          <feTurbulence
            result="turbulence"
            seed="2"
            numOctaves="2"
            baseFrequency="0.0075 0.0075"
            type="turbulence"
          ></feTurbulence>
          <feComponentTransfer>
            <feFuncR type="table">
              <animateTransform
                repeatCount="indefinite"
                dur="10s"
                values="0.01;0.02;0.01"
                attributeName="transform"
              ></animateTransform>
            </feFuncR>
          </feComponentTransfer>
          <feDisplacementMap
            yChannelSelector="G"
            xChannelSelector="R"
            scale="17.5"
            in2="turbulence"
            in="SourceGraphic"
          ></feDisplacementMap>
        </filter>
        <filter id="still-water">
          <feTurbulence
            result="turbulence"
            seed="2"
            numOctaves="2"
            baseFrequency="0.0075 0.0075"
            type="turbulence"
          ></feTurbulence>
          <feComponentTransfer>
            <feFuncR type="table">
              <animateTransform
                repeatCount="indefinite"
                dur="10s"
                values="0.01;0.02;0.01"
                attributeName="transform"
              ></animateTransform>
            </feFuncR>
          </feComponentTransfer>
          <feDisplacementMap
            yChannelSelector="G"
            xChannelSelector="R"
            scale="12.5"
            in2="turbulence"
            in="SourceGraphic"
          ></feDisplacementMap>
        </filter>
      </svg>
    </div>
  </label>
</template>
