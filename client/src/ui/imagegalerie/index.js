// ui/imagegalerie/page.js
export default function renderImageGalerie({ images }) {
    const container = document.createElement('div');
    container.className = "imagegalerie-container";

    const mainImage = document.createElement('img');
    mainImage.src = images[0]?.url || '';
    mainImage.alt = "Image principale";
    mainImage.className = "imagegalerie-main";
    mainImage.id = "mainImage";
    container.appendChild(mainImage);

    const gallery = document.createElement('div');
    gallery.className = "imagegalerie-gallery";
    images.forEach((img, idx) => {
        const thumb = document.createElement('img');
        thumb.src = img.url;
        thumb.alt = `Miniature ${idx + 1}`;
        thumb.className = "imagegalerie-thumb";
        thumb.onclick = () => {
            mainImage.src = img.url;
            gallery.querySelectorAll('img').forEach(i => i.classList.remove('imagegalerie-thumb-active'));
            thumb.classList.add('imagegalerie-thumb-active');
        };
        gallery.appendChild(thumb);
    });
    container.appendChild(gallery);
    return container;
}

