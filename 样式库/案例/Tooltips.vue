<style scoped>
  .brutal-tooltip-wrapper {
    position: relative;
    display: inline-block;
    font-family: "Space Grotesk", sans-serif;
  }

  .brutal-tooltip-target {
    background-color: #fff;
    color: #000;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.25rem;
    font-weight: 900;
    text-transform: uppercase;
    padding: 0.75rem 1.5rem;
    border: 4px solid #000;
    box-shadow: 4px 4px 0px 0px #000;
    cursor: pointer;
    outline: none;
    transition:
      transform 0.1s ease,
      box-shadow 0.1s ease;
  }

  .brutal-tooltip-target:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px #000;
  }

  .brutal-tooltip {
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: #000;
    color: #fff;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 800;
    white-space: nowrap;
    border: 4px solid #38bdf8;
    box-shadow: 4px 4px 0px 0px #000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-out;
    z-index: 10;
  }

  /* Tooltip arrow */
  .brutal-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: #000 transparent transparent transparent;
  }
  .brutal-tooltip::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: #38bdf8 transparent transparent transparent;
    transform: translateY(4px);
    z-index: -1;
  }

  .brutal-tooltip-wrapper:hover .brutal-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
</style>

<template>
  <div class="brutal-tooltip-wrapper">
    <button class="brutal-tooltip-target">Hover For Info</button>
    <div class="brutal-tooltip">I AM A LOUD TOOLTIP!</div>
  </div>
</template>
