const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach(
        (e) => e.isIntersecting && e.target.classList.add("show")
      ),
    { threshold: 0.12 }
  );
  $$(".fade-up").forEach((el) => observer.observe(el));

  const links = $$(".nav-link");
  const sections = ["home", "about", "works", "contact"].map((id) =>
    $("#" + id)
  );
  const setActive = (id) => {
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`)
    );
  };
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
  );
  sections.forEach((s) => spy.observe(s));

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      const target = $("#" + id);
      const y = target.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  const typingTarget = $(".typing");
  if (typingTarget) {
    const phrases = [
      "Front-End Developer",
      "UI/UX Enthusiast",
      "Problem Solver",
    ];
    let i = 0,
      j = 0,
      deleting = false;

    const type = () => {
      const word = phrases[i];
      typingTarget.textContent = deleting
        ? word.slice(0, j--)
        : word.slice(0, j++);

      const base = deleting ? 55 : 115;
      if (!deleting && j > word.length + 1) {
        deleting = true;
        setTimeout(type, 1200);
      } else if (deleting && j < 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
        setTimeout(type, 250);
      } else {
        setTimeout(type, base);
      }
    };
    type();
  }

  const tiltCards = $$(".card");
  tiltCards.forEach((card) => {
    let enter = false;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      const rotX = (0.5 - y) * 8; // tilt limits
      const rotY = (x - 0.5) * 10;
      card.classList.add("tilting");
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    });
    ["mouseleave", "blur"].forEach((ev) =>
      card.addEventListener(ev, () => {
        card.classList.remove("tilting");
        card.style.transform = "";
      })
    );
  });

  const slides = $(".slides");
  const boxes = $$(".work-box", slides);
  const left = $(".arrow.left");
  const right = $(".arrow.right");
  const dotsC = $(".dots");
  if (slides && boxes.length) {
    boxes.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsC.appendChild(dot);
    });
    const dots = $$(".dots span");
    let idx = 0,
      timer;

    const show = (i) => {
      idx = (i + boxes.length) % boxes.length;
      slides.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d) => d.classList.remove("active"));
      dots[idx].classList.add("active");
    };
    const next = () => show(idx + 1);
    const prev = () => show(idx - 1);

    right?.addEventListener("click", next);
    left?.addEventListener("click", prev);
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));

    const play = () => (timer = setInterval(next, 5000));
    const stop = () => timer && clearInterval(timer);
    play();
    slides.addEventListener("mouseenter", stop);
    slides.addEventListener("mouseleave", play);
  }
});
