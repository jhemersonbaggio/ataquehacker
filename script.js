document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("stressForm");
  const submitBtn = document.getElementById("submitBtn");
  const resultEl = document.getElementById("result");

  submitBtn.addEventListener("click", () => {
    let score = 0;

    for (let i = 1; i <= 10; i++) {
      const select = form["q" + i];
      // se o select existir e tiver valor
      if (select) {
        score += parseInt(select.value, 10);
      }
    }

    let message = "";
    if (score <= 10) {
      message = "Seu estresse está baixo. Continue mantendo hábitos saudáveis!";
    } else if (score <= 20) {
      message = "Nível moderado de estresse. Considere pausas, exercícios leves e boas noites de sono.";
    } else if (score <= 26) {
      message = "Estresse alto. Evite sobrecarga e pratique técnicas de respiração ou relaxamento.";
    } else {
      message = "Estresse muito elevado. Procure apoio emocional de alguém de confiança ou orientação profissional se necessário.";
    }

    resultEl.innerHTML = `
      <strong>Pontuação total: ${score}/30</strong><br><br>
      ${message}
    `;
  });
});
