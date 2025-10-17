// ui/imagegalerie/index.js
export default function renderImageGalerie({ images }) {
    console.log("[renderImageGalerie] images reçues :", images);

    const container = document.createElement('div');
    container.className = "max-w-xl mx-auto";


    const mainImage = document.createElement('img');
    mainImage.src = images[0]?.url || '';
    mainImage.alt = "Image principale";
    mainImage.className = "w-86 h-86 object-cover rounded-lg shadow";
    mainImage.id = "mainImage";
    container.appendChild(mainImage);

    const gallery = document.createElement('div');
    gallery.className = "flex space-x-2 mt-4";
    images.forEach((img, idx) => {
        console.log(`[renderImageGalerie] Miniature ${idx} :`, img);
        const thumb = document.createElement('img');
        thumb.src = img.url;
        thumb.alt = `Miniature ${idx + 1}`;
        thumb.className = "w-16 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500";
        thumb.onclick = () => {
            mainImage.src = img.url;
            gallery.querySelectorAll('img').forEach(i => i.classList.remove('border-blue-500'));
            thumb.classList.add('border-blue-500');
        };
        gallery.appendChild(thumb);
    });
    container.appendChild(gallery);
    return container;
}
