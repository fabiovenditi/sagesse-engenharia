const button = document.querySelector('.menu-button');
const nav = document.querySelector('nav');
button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
});
document.querySelector('#year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('[data-reveal]');
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => observer.observe(item));

const presentation = document.querySelector('.site-presentation');
if (presentation) {
  const slides = [...presentation.querySelectorAll('.presentation-slide')];
  const title = presentation.querySelector('#presentation-title');
  const copy = presentation.querySelector('#presentation-copy');
  const step = presentation.querySelector('.presentation-progress b');
  const play = presentation.querySelector('.presentation-play');
  const audio = presentation.querySelector('.presentation-audio');
  const closeButtons = presentation.querySelectorAll('.presentation-close, .presentation-skip');
  const scenes = [
    {
      title: 'Sua operação não pode parar.',
      copy: 'Elétrica, caldeiraria e montagem industrial integradas para uma entrega mais eficiente.',
      narration: 'Olá, seja bem-vindo à Sagesse Engenharia. Unimos engenharia elétrica, automação, caldeiraria e montagem industrial para transformar demandas complexas em entregas completas.'
    },
    {
      title: 'Precisão em cada detalhe.',
      copy: 'Painéis, infraestrutura, tubulações, estruturas e peças sob medida, do projeto à instalação.',
      narration: 'Desenvolvemos painéis elétricos, infraestrutura, tubulações, estruturas metálicas e peças sob medida, do projeto à instalação em campo.'
    },
    {
      title: 'Pronta para avançar.',
      copy: 'Planejamento, segurança e qualidade para transformar engenharia em resultado operacional.',
      narration: 'Trabalhamos com planejamento, segurança e qualidade para que sua operação avance com confiança. Sagesse Engenharia. Engenharia integrada para mover a sua indústria.'
    }
  ];
  let currentScene = 0;
  let narrationOn = false;
  let sceneTimer;

  const showScene = (index, speak = false) => {
    currentScene = index % scenes.length;
    const scene = scenes[currentScene];
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentScene));
    title.textContent = scene.title;
    copy.textContent = scene.copy;
    step.textContent = String(currentScene + 1).padStart(2, '0');
    if (speak && narrationOn && !audio) speakScene(scene.narration);
  };

  const speakScene = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('pt-br'));
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.rate = .96;
    window.speechSynthesis.speak(utterance);
  };

  const startScenes = () => {
    clearInterval(sceneTimer);
    sceneTimer = setInterval(() => showScene(currentScene + 1, narrationOn), 14000);
  };
  startScenes();

  play.addEventListener('click', () => {
    narrationOn = !narrationOn;
    play.setAttribute('aria-pressed', String(narrationOn));
    play.innerHTML = narrationOn ? 'Narração ativada <span>❚❚</span>' : 'Ouvir apresentação <span>▶</span>';
    if (narrationOn) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
        audio.play().catch(() => speakScene(scenes[currentScene].narration));
      } else speakScene(scenes[currentScene].narration);
    } else {
      audio?.pause();
      window.speechSynthesis?.cancel();
    }
  });

  closeButtons.forEach((button) => button.addEventListener('click', () => {
    presentation.classList.add('is-hidden');
    clearInterval(sceneTimer);
    audio?.pause();
    window.speechSynthesis?.cancel();
  }));

  audio?.addEventListener('ended', () => {
    narrationOn = false;
    play.setAttribute('aria-pressed', 'false');
    play.innerHTML = 'Ouvir apresentação <span>▶</span>';
  });
}
