<script>
  // Add logic or props if needed
</script>

<section class="hero">
  <video class="hero-bg" autoplay muted loop playsinline poster="">
    <source src="videos/smoke-stack.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div class="hero-gradient"></div>
  <div class="hero-text">
    <div class="text-overlay">
      <h1>Green Promises<br />Carbon Truths</h1>
      <h2>33 Years of CO₂ Emissions and Climate Policy</h2>
    </div>
  </div>
  <div class="scroll-indicator">
    <span style="color: white;">Scroll to begin</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M12 19l-5-5m5 5l5-5"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    pointer-events: none;
  }
  .hero-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.908) 0%,
      rgba(0, 0, 0, 0.2) 40%,
      rgba(0, 0, 0, 0) 80%
    );
  }
  .hero-text {
    position: absolute;
    left: 0;
    bottom: 10rem;
    z-index: 2;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding-left: 5vw;
    pointer-events: none;
  }
  .text-overlay {
    background: rgba(0, 0, 0, 0.378);
    padding: 2.5rem 3rem 2rem 2.5rem;
    border-radius: 1.2rem;
    max-width: 1000px;
    pointer-events: auto;
  }
  h1 {
    font-size: 6rem;
    color: #fff;
    margin: 0 0 1.2rem 0;
    font-weight: 800;
    letter-spacing: 0.01em;
    line-height: 1.05;
  }
  h2 {
    font-size: 2rem;
    color: #fff;
    font-weight: 400;
    margin: 0;
    opacity: 0.92;
    line-height: 1.2;
  }
  .scroll-indicator {
    position: absolute;
    left: 50%;
    bottom: 5rem;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    opacity: 0.9;
    animation: bounce 2s infinite;
    pointer-events: auto;
  }
  .scroll-indicator span {
    font-size: 1.1rem;
    letter-spacing: 0.05em;
  }
  /* Gør så man ikke kan markere teksten */
  .hero-text,
  .text-overlay,
  .hero-text h1,
  .hero-text h2,
  .scroll-indicator {
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }
  @media (max-width: 900px) {
    .hero-text {
      bottom: 7rem;
      padding-left: 3vw;
    }
    .text-overlay {
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      max-width: 95vw;
    }
    h1 {
      font-size: 2.2rem;
    }
    h2 {
      font-size: 1.1rem;
    }
  }
</style>
