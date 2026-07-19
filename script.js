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
  const music = presentation.querySelector('.presentation-music');
  const closeButtons = presentation.querySelectorAll('.presentation-close, .presentation-skip');
  const scenes = [
    {
      title: 'Sua operação não pode parar.',
      copy: 'A Sagesse Engenharia projeta e entrega soluções elétricas industriais com segurança, organização e confiança.',
      narration: 'Sua operação não pode parar. A Sagesse Engenharia projeta e entrega soluções elétricas industriais com segurança, organização e confiança.'
    },
    {
      title: 'Método em cada detalhe.',
      copy: 'Painéis elétricos, instalações e infraestrutura executados para manter sua indústria sob controle.',
      narration: 'Do projeto à fabricação, cuidamos de painéis elétricos, instalações e infraestrutura para manter sua indústria sob controle.'
    },
    {
      title: 'Pronta para operar.',
      copy: 'Testes, comissionamento e start-up para transformar planejamento em desempenho, com segurança.',
      narration: 'Com testes, comissionamento e start-up, transformamos planejamento em desempenho. Sagesse Engenharia: uma parceira técnica para manter sua indústria em movimento.'
    }
  ];
  let currentScene = 0;
  let narrationOn = false;
  let sceneTimer;
  let narrationStart;
  if (music) music.volume = .04;

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
        audio.currentTime = 0;
        audio.volume = 0;
        audio.play().catch(() => {
          narrationStart = setTimeout(() => speakScene(scenes[currentScene].narration), 1000);
        });
        music?.play().catch(() => {});
        narrationStart = setTimeout(() => {
          audio.volume = 1;
        }, 1000);
      } else speakScene(scenes[currentScene].narration);
    } else {
      clearTimeout(narrationStart);
      audio?.pause();
      music?.pause();
      window.speechSynthesis?.cancel();
    }
  });

  closeButtons.forEach((button) => button.addEventListener('click', () => {
    presentation.classList.add('is-hidden');
    clearInterval(sceneTimer);
    clearTimeout(narrationStart);
    audio?.pause();
    music?.pause();
    window.speechSynthesis?.cancel();
  }));

  audio?.addEventListener('ended', () => {
    narrationOn = false;
    music?.pause();
    music && (music.currentTime = 0);
    play.setAttribute('aria-pressed', 'false');
    play.innerHTML = 'Ouvir apresentação <span>▶</span>';
  });
}
