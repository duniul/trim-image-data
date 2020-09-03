export function loadCanvasFromFile(canvas, file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();

    fileReader.onload = event => {
      const image = new Image();

      image.onload = async () => {
        const context = canvas.getContext('2d');

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      };

      const result = event?.target?.result;
      if (typeof result === 'string') {
        image.src = result;
      }
    };

    fileReader.readAsDataURL(file);
  });
}
