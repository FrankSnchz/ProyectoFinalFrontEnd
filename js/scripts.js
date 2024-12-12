//Para abrir y cerrar el menú aparte de cambiar el click

  $(document).ready(function () {
    $('#menu-toggle').click(function () {
        // Cambia el icono de las barras a la flecha y viceversa
        $(this).toggleClass('fa-bars fa-arrow-left');
        
        // Alterna la visibilidad del menú
        $('#menu').toggleClass('open');
    });
});

//SLIDES 

$(function () {
  $(".rslides").responsiveSlides({
    nav: true, // Activar los botones de navegación
    prevText: "❮",  // Texto para el botón "anterior"
    nextText: "❯", // Texto para el botón "siguiente"
    pauseControls: false, // No pausar al hacer hover en controles
  });
});

//Si el usuario de desplaza más de 50

document.addEventListener("scroll", () => {
    const header = document.getElementById("header");
  
    // Comprueba si el usuario se ha desplazado más de 50px
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  
//-------------------CAROUSEL----------------
function initializeCarousel(carouselId) {
  const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
  const container = carousel.querySelector(".carousel-container");
  const slides = Array.from(container.children);
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  const visibleSlides = parseInt(getComputedStyle(document.documentElement).getPropertyValue(`--visible-slides-${carouselId}`).trim());
  let currentIndex = 0;
  let autoSlideInterval;

  // Crear los indicadores (dots)
  const indicatorsContainer = document.createElement("div");
  indicatorsContainer.classList.add("carousel-indicators");
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active"); // Marca el primero como activo
    dot.setAttribute("data-index", i);
    indicatorsContainer.appendChild(dot);
  });
  carousel.appendChild(indicatorsContainer);

  const indicators = indicatorsContainer.querySelectorAll(".carousel-dot");

  if (visibleSlides > 1) {
    const clonesBefore = slides.slice(-visibleSlides).map(slide => slide.cloneNode(true));
    const clonesAfter = slides.slice(0, visibleSlides).map(slide => slide.cloneNode(true));
    clonesBefore.forEach(clone => container.prepend(clone));
    clonesAfter.forEach(clone => container.append(clone));
    currentIndex = visibleSlides;
    container.style.transform = `translateX(-${(100 / visibleSlides) * currentIndex}%)`;
  }

  const realSlidesCount = slides.length; // Diapositivas reales sin clones

  function updateActiveSlide() {
    // Eliminar clases activas e inactivas previas
    container.querySelectorAll(".active-slide").forEach(slide => slide.classList.remove("active-slide"));
    container.querySelectorAll(".inactive-slide").forEach(slide => slide.classList.remove("inactive-slide"));

    // Manejo especial para visibleSlides === 1
    if (visibleSlides === 1) {
        // Índice de la diapositiva activa
        const realIndex = (currentIndex - visibleSlides + realSlidesCount) % realSlidesCount;

        Array.from(container.children).forEach((slide, index) => {
            const slideRealIndex = (index - visibleSlides + realSlidesCount) % realSlidesCount;

            if (slideRealIndex === realIndex) {
                slide.classList.add("active-slide");
            } else {
                slide.classList.add("inactive-slide");
            }
        });
        return; // Salimos aquí, ya que no se necesita lógica adicional
    }

    // Para visibleSlides > 1
    const realIndex = (currentIndex - visibleSlides + realSlidesCount) % realSlidesCount;
    const focusedIndex = (realIndex + Math.floor(visibleSlides / 2)) % realSlidesCount;

    // Itera sobre todas las diapositivas, incluidas las reales y los clones
    Array.from(container.children).forEach((slide, index) => {
        const slideRealIndex = (index - visibleSlides + realSlidesCount) % realSlidesCount;

        if (slideRealIndex === focusedIndex) {
            slide.classList.add("active-slide");
        } else {
            slide.classList.add("inactive-slide");
        }
    });
}


  function updateIndicators() {
    indicators.forEach(dot => dot.classList.remove("active"));
    const realIndex = (currentIndex - visibleSlides + realSlidesCount) % realSlidesCount;
    indicators[realIndex].classList.add("active");
  }

  function changeSlide(direction) {
    currentIndex += direction;
    const totalChildren = container.children.length;
    const maxIndex = totalChildren - visibleSlides;

    container.style.transition = "transform 0.5s ease-in-out";
    container.style.transform = `translateX(-${(100 / visibleSlides) * currentIndex}%)`;

    container.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") return;

      if (currentIndex < visibleSlides) {
        currentIndex += totalChildren - 2 * visibleSlides;
        container.style.transition = "none";
        container.style.transform = `translateX(-${(100 / visibleSlides) * currentIndex}%)`;
      } else if (currentIndex >= maxIndex) {
        currentIndex -= totalChildren - 2 * visibleSlides;
        container.style.transition = "none";
        container.style.transform = `translateX(-${(100 / visibleSlides) * currentIndex}%)`;
      }

      updateActiveSlide();
      updateIndicators();
    });
  }

  function changeSlideTo(index) {
    currentIndex = index + visibleSlides;
    container.style.transition = "transform 0.5s ease-in-out";
    container.style.transform = `translateX(-${(100 / visibleSlides) * currentIndex}%)`;
    updateActiveSlide();
    updateIndicators();
    restartAutoSlide();
  }

  function restartAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => changeSlide(1), 5000);
  }

  // Añade eventos de los botones
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      changeSlide(-1);
      restartAutoSlide();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      changeSlide(1);
      restartAutoSlide();
    });
  }

  // Añade eventos a los indicadores
  indicators.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"), 10);
      changeSlideTo(index);
    });
  });

  // Inicializa el auto-slide y las clases iniciales
  autoSlideInterval = setInterval(() => changeSlide(1), 5000);
  updateActiveSlide();
}



// Inicializar ambos carruseles
initializeCarousel("services");
initializeCarousel("clients");
initializeCarousel("doctors");



//------- ACORDEON-------------

$(".question").click(function () {
  var t = $(this);
  var tp = t.next();
  tp.slideToggle();

  // Cierra cualquier otro contenido abierto
  $(".content").not(tp).slideUp(); // Cierra otros contenidos
  $(".icon").not(t.find(".icon")).text("+"); // Restablece otros iconos a +

  // Alterna el contenido del icono entre + y -
  var icon = t.find(".icon");
  if (icon.text() === "+") {
    icon.text("-");
  } else {
    icon.text("+");
  }
});


//------FANCYBOX-----
Fancybox.bind("[data-fancybox]", {
  // Your custom options for a specific gallery
});


//------------MODAL--------------
$("#close-btn").click(function () {
  $("#modal").removeClass("show");
});

function tiempo() {
$("#modal").addClass("show");
}
setTimeout(tiempo, 1200);

//Cerrar cuando le doy afuera del dialog
window.onclick = function (event) {
  if (event.target == modal) {
    $("#modal").removeClass("show");
  }
};

//Para cerrarlo cuando le doy a Esc
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    $("#modal").removeClass("show");
  }
});