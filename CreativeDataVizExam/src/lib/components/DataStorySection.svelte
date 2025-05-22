<script>
  import { base } from "$app/paths";
</script>

<section class="intro">
  <div class="intro-content">
    <h1>The Data tells the story</h1>
    <p class="intro-text">
      <strong>Delve into the data</strong> and explore <strong>over 30 years of data</strong> about CO2 emissions
      across all sectors of Danish society.
    </p>
    <p class="intro-text">
      <strong>Discover the measurable differences</strong> Denmark has made and see the <strong>green
      transitioning of Denmark</strong> through the decades.
    </p>
  </div>
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    align-items: center;          
    justify-content: center;       
    gap: 3rem;
    padding: 4rem 2rem;
    min-height: 60vh;
    max-width: 900px;
    margin: 0 auto;
  }
  .intro-content {
    flex: 1 1 350px;
    max-width: 800px;
    width: 100%;
    margin: 0;
    text-align: left;           
  }
  .intro-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1.2rem;
  }
  .intro-text {
    font-size: 1.5rem;
    line-height: 1.5;
    margin-bottom: 2rem;
  }
  @media (max-width: 900px) {
    .intro {
      flex-direction: column;
      padding: 2rem 1rem;
    }
  }
</style>
