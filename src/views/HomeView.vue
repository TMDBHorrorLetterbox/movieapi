<template>
  <section class="inicio">
    <div class="bemVindo">
      <h1>BEM-VINDO À DARKLIST</h1>
      <h3>Pronto para avaliar seu horror</h3>
    </div>
    <div class="start">
      <button>Começar</button>
    </div>
    <div class="slogan">
      <h3>Aqui, os fãs de terror encontram o paraíso! Com um catálogo restrito à horror e crimes, permitimos a avaliação e resenha de filmes vistos por você.</h3>
    </div>
    <hr>
  </section>
  <section class="destaqueCla">
    <div class="cla">
      <h2>Clássicos</h2>
    </div>
    <div class="rec">
      <h2>Recentes</h2>
    </div>
    <div class="filmesB">
      <h2>Filmes B</h2>
    </div>
  </section>
</template>
<style scoped>
/* ==== GERAL ==== */

body {
  margin: 0;
  padding: 0;
  background: #000;
  color: #fff;
  font-family: "Cinzel", serif;
}

section {
  width: 100%;
}

/* ==== SESSÃO INÍCIO ==== */

.inicio {
  width: 100%;
  padding: 180px 40px 80px;

  /* Imagem + overlay escuro */
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.2), #000),
    url('/bannerArt.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.bemVindo h1 {
  font-size: 3rem;
  letter-spacing: 2px;
  margin-bottom: 10px;
  color: #fff;
}

.bemVindo h3 {
  font-weight: 300;
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 40px;
}

.start {
  max-width: 600px;
}

.start button {
  background: #7a0b0b;
  border: none;
  padding: 12px 32px;
  font-size: 1.1rem;
  color: white;
  margin-bottom: 25px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s ease;
}

.start button:hover {
  background: #a01111;
}

.slogan h3 {
  line-height: 1.5rem;
  font-weight: 300;
  color: #ddd;
  text-align: right;
  padding-left: 1200px;
  padding-right: 3f0px;
}

.inicio hr {
  margin-top: 60px;
  border: none;
  height: 1px;
  background: #333;
}

/* ==== SEÇÕES: CLÁSSICOS / RECENTES / FILMES B ==== */

.destaqueCla {
  padding: 40px;
}

.destaqueCla h2 {
  font-size: 2rem;
  margin: 40px 0 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Títulos separados como na tela */
.cla, .rec, .filmesB {
  margin-bottom: 60px;
}

/* Espaço inferior igual ao da tela */
.filmesB {
  padding-bottom: 120px;
}
</style>