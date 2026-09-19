/**
 * Hotel Eden - Script Interactivo y Sistema de Contacto Inteligente
 * Manejo de WhatsApp/Llamadas, Linterna en Sección de Terror, Lightbox y Reservas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes de Contacto
  const PHONE_NUMBER_RAW = '03548426643';
  const PHONE_NUMBER_INTL = '5493548426643';
  const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Eden+Avenue+1400,+X5172+La+Falda,+C%C3%B3rdoba';
  const DEFAULT_MESSAGE = encodeURIComponent('Hola, me comunico desde la web del Hotel Edén. Quisiera solicitar información y hacer una consulta.');
  const TOUR_MESSAGE = (date, time, pax, total) => encodeURIComponent(
    `Hola, deseo reservar para el Paseo Nocturno de Terror del Hotel Edén:\n- Fecha: ${date}\n- Horario: ${time} hs\n- Cantidad de personas: ${pax} (mayores de 7 años)\n- Total estimado: $${total}`
  );

  // 1. Detección de Dispositivo (PC vs Móvil)
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  };

  /**
   * Enrutador Inteligente para Contacto Telefónico y WhatsApp
   * Requisito: "ese numero agregalo tmb que te lleve a whattsap o si no tiene whattsap que te lleve al numeral excepto que estes en pc"
   */
  window.handleSmartContact = function(customMessage = null) {
    const textMsg = customMessage ? encodeURIComponent(customMessage) : DEFAULT_MESSAGE;
    
    if (isMobile()) {
      // En móvil: intenta abrir WhatsApp, y si el usuario prefiere marcar al numeral, ofrece diálogo rápido o fallback
      const waUrl = `https://wa.me/${PHONE_NUMBER_INTL}?text=${textMsg}`;
      
      // Creamos un diálogo de confirmación suave o abrimos WhatsApp
      const openChoice = confirm(
        "¿Cómo deseas comunicarte con el Hotel Edén?\n\n- Aceptar: Abrir chat de WhatsApp (03548-426643)\n- Cancelar: Llamar directo al marcador telefónico / numeral"
      );
      
      if (openChoice) {
        window.location.href = waUrl;
      } else {
        window.location.href = `tel:${PHONE_NUMBER_RAW}`;
      }
    } else {
      // En PC: Se abre WhatsApp Web directamente para comodidad del usuario de escritorio
      const waWebUrl = `https://web.whatsapp.com/send?phone=${PHONE_NUMBER_INTL}&text=${textMsg}`;
      showToast("Abriendo WhatsApp Web... También puedes copiar el número: (03548) 42-6643");
      window.open(waWebUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Función directa para WhatsApp
  window.openWhatsApp = function(msg = null) {
    const text = msg ? encodeURIComponent(msg) : DEFAULT_MESSAGE;
    if (isMobile()) {
      window.location.href = `https://wa.me/${PHONE_NUMBER_INTL}?text=${text}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${PHONE_NUMBER_INTL}&text=${text}`, '_blank');
    }
  };

  // Función directa para llamar al numeral
  window.callDirectPhone = function() {
    if (isMobile()) {
      window.location.href = `tel:${PHONE_NUMBER_RAW}`;
    } else {
      navigator.clipboard.writeText(PHONE_NUMBER_RAW).then(() => {
        showToast("Número copiado al portapapeles: 03548426643 (En PC usa Skype o tu app de llamadas)");
      }).catch(() => {
        alert("Número telefónico: " + PHONE_NUMBER_RAW);
      });
    }
  };

  // 2. Efecto de Linterna en la Sección de Terror (Oscuridad Total)
  const terrorSection = document.getElementById('terror-section');
  const flashlightLayer = document.querySelector('.flashlight-layer');

  if (terrorSection && flashlightLayer) {
    terrorSection.addEventListener('mousemove', (e) => {
      const rect = terrorSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      flashlightLayer.style.setProperty('--mouse-x', `${x}%`);
      flashlightLayer.style.setProperty('--mouse-y', `${y}%`);
    });

    // Toque en móviles para posicionar la linterna
    terrorSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = terrorSection.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        flashlightLayer.style.setProperty('--mouse-x', `${x}%`);
        flashlightLayer.style.setProperty('--mouse-y', `${y}%`);
      }
    });
  }

  // 3. Sistema de Reserva para el Paseo Nocturno
  const bookingModal = document.getElementById('booking-modal');
  const openBookingBtns = document.querySelectorAll('.open-booking-modal-btn');
  const closeBookingBtn = document.getElementById('close-booking-btn');
  const bookingForm = document.getElementById('tour-booking-form');
  const paxInput = document.getElementById('booking-pax');
  const totalDisplay = document.getElementById('booking-total-display');

  const TICKET_PRICE = 4000;

  function updateBookingTotal() {
    if (paxInput && totalDisplay) {
      const count = parseInt(paxInput.value) || 1;
      const total = count * TICKET_PRICE;
      totalDisplay.textContent = `$${total.toLocaleString('es-AR')}`;
    }
  }

  if (paxInput) {
    paxInput.addEventListener('input', updateBookingTotal);
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) {
        bookingModal.classList.add('active');
        updateBookingTotal();
      }
    });
  });

  if (closeBookingBtn) {
    closeBookingBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('booking-day').value;
      const timeVal = document.getElementById('booking-time').value;
      const paxVal = parseInt(paxInput.value) || 1;
      const totalVal = (paxVal * TICKET_PRICE).toLocaleString('es-AR');

      const message = `Hola, quiero reservar para el Paseo Nocturno de Terror del Hotel Edén:\n- Turno: ${dateVal} a las ${timeVal} hs\n- Entradas: ${paxVal} personas (mayores de 7 años)\n- Valor estimado: $${totalVal}\n\n¿Tienen cupos disponibles?`;
      
      bookingModal.classList.remove('active');
      window.handleSmartContact(message);
    });
  }

  // 4. Lightbox para Galería de Fotos
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-card-title')?.textContent || '';
      const category = card.querySelector('.gallery-card-category')?.textContent || '';
      
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${category ? category + ' — ' : ''}${title}`;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 5. Menú Móvil Hamburguesa
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Cerrar menú al tocar un enlace o botón dentro del menú móvil
    navLinks.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 6. Filtrado de Huéspedes Ilustres
  const tabBtns = document.querySelectorAll('.tab-btn');
  const guestCards = document.querySelectorAll('.guest-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      guestCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Toast Notification Helper
  function showToast(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
  window.showToast = showToast;
});
