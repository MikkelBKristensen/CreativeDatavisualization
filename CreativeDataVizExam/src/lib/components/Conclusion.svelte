<script>
  import { base } from "$app/paths";
</script>

<section class="intro">
  <div class="intro-content">
    <h1>What is really going on?</h1>
    <p class="intro-text">
      If you had a hard time spotting any positive difference through the data,
      that makes sense, since Denmark's total emissions hasn't changed that much
      since 1990
    </p>
    <p class="intro-text">
      <strong>
        The Climate Law expects a 70% emission reduction by 2030 compared to the
        levels in 1990.
      </strong>
    </p>
    <div style="height: 2.5rem;"></div> <!-- Add extra vertical space here -->
    <h2 style="font-size: 2rem;">Are we close to the goal of 2030?</h2>
    <p class="intro-text">
      Depending on the calculation method, we are either very close or very far
      away. Denmark has made a positive change within the country's borders, but
      omitted the CO2 emissions outside Denmark's borders from the records.
    </p>
  </div>
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
    gap: 3rem;
    padding: 4rem 2rem;
    min-height: 100vh;
    max-width: 900px;
    margin: 0 auto;
  }
  .intro-content {
    flex: 1 1 350px;
    max-width: 900px;
    width: 100%;
    margin: 0;
    text-align: center; /* Center text inside the container */
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
