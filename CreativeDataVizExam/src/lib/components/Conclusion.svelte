<script>
  import { base } from "$app/paths";
</script>

<section class="intro">
  <div class="intro-content">
    <h1>What is really going on?</h1>
    <p class="intro-text">
      Now you've seen why Denmark's total emissions haven't dropped as
      dramatically as we might expect. Even after decades of climate action, the
      numbers tell a more complex story than the headlines suggest.
    </p>
    <p class="intro-text">
      <strong>
        The Climate Law sets a bold goal: a 70% reduction in emissions by 2030,
        compared to 1990 levels.
      </strong>
    </p>
    <div style="height: 2.5rem;"></div>
    <h2 style="font-size: 2rem;">But are we close to the goal for 2030?</h2>
    <p class="intro-text">
      As you've seen, the answer depends on which numbers we focus on. If we
      only count emissions produced within Denmark's borders, the target seems
      within reach and the official story is one of strong progress.
    </p>
    <p class="intro-text">
      But when we include the emissions our economy is responsible for, those
      created abroad through imports, travel, and global supply chains, the
      picture changes. The reductions are far less dramatic, in fact, our true
      climate footprint has actually increased by 11.9%, remaining much larger
      than the official numbers used for policies.
    </p>
    <p class="intro-text">
      <strong>
        Which story should we tell? And which numbers should guide our next
        steps?
      </strong>
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
    min-height: 100vh;
    max-width: 900px;
    margin: 0 auto;
  }
  .intro-content {
    flex: 1 1 350px;
    max-width: 900px;
    width: 100%;
    margin: 0;
    text-align: center;
  }
  .intro-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1.2rem;
  }
  .intro-content h2 {
    font-size: 2rem;
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
    .intro-content h1 {
      font-size: 2.2rem;
    }
    .intro-content h2 {
      font-size: 1.3rem;
    }
    .intro-text {
      font-size: 1.1rem;
    }
  }
</style>
