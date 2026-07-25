(function () {
  const images = document.querySelectorAll('.gallery-section .photo-grid-item > img');
  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Enlarged film still');
  lightbox.innerHTML = [
    '<button class="gallery-lightbox-close" type="button" aria-label="Close enlarged image">&times;</button>',
    '<figure class="gallery-lightbox-figure">',
    '<img class="gallery-lightbox-image" alt="">',
    '<figcaption class="gallery-lightbox-caption"></figcaption>',
    '</figure>'
  ].join('');
  document.body.appendChild(lightbox);

  const largeImage = lightbox.querySelector('.gallery-lightbox-image');
  const caption = lightbox.querySelector('.gallery-lightbox-caption');
  const closeButton = lightbox.querySelector('.gallery-lightbox-close');
  let opener = null;

  function openLightbox(image, button) {
    opener = button;
    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt;
    caption.textContent = image.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    largeImage.removeAttribute('src');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  images.forEach(function (image) {
    const button = document.createElement('button');
    button.className = 'gallery-lightbox-trigger';
    button.type = 'button';
    button.setAttribute('aria-label', 'Enlarge image: ' + image.alt);
    image.parentNode.insertBefore(button, image);
    button.appendChild(image);
    button.addEventListener('click', function () {
      openLightbox(image, button);
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
