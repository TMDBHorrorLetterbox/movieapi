<template>
  <section class="inicio">
    <div class="espacer">
        <div class="bemVindo">
          <h1>BEM-VINDO À DARKLIST</h1>
          <h3>Pronto para descobrir o verdadeiro horror?</h3>
        </div>
      <div class="inferior">
        <div class="start">
          <router-link to="/filmes"><button>COMEÇAR</button></router-link>
        </div>
        <div class="slogan">
        <h3>Aqui, os fãs de terror encontram o paraíso! Com um catálogo restrito à horror e crimes, permitimos a avaliação e resenha de filmes vistos por você.</h3>
        </div>
      </div>
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

.inicio {
  width: 100%;
  padding: 180px 40px 80px;
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.2), #000),
    url('/bannerArt.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.espacer {
 margin: 305px 30px 0 30px;
}
.bemVindo h1 {
  font-size: 4rem;
  letter-spacing: 2px;
  margin-bottom: 2px;
  color: #fff;
  font-family: julius sans one, sans-serif;
}

.bemVindo h3 {
  font-weight: 300;
  font-size: 2rem;
  color: #ccc;
  margin-bottom: 10px;
  font-family: junge, sans-serif;
}
.inferior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: junge, sans-serif;
}
.start {
  max-width: 600px;
}

.start button {
  background: #7a0b0b;
  border: none;
  padding: 17px 40px;
  font-size: 2rem;
  color: white;
  margin-bottom: 0px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s ease;
  font-family: junge, sans-serif;
}

.start button:hover {
  background: #a01111;
}

.slogan h3 {
  font-size: 2rem;
  line-height: 1.8rem;
  font-weight: 300;
  color: #ddd;
  text-align: right;
  padding-left: 750px;
  padding-right: 30px;
  letter-spacing: 2px;
}

.inicio hr {
  margin-top: 30px;
  border: none;
  height: 1px;
  background: #333;
}

.destaqueCla {
  padding: 40px;
}

.destaqueCla h2 {
  font-size: 2rem;
  margin: 40px 0 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.cla, .rec, .filmesB {
  margin-bottom: 60px;
}

.filmesB {
  padding-bottom: 120px;
}
</style>