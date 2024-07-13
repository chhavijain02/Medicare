// import { createImage } from './createImage';

// const getCroppedImg = async (imageSrc, crop) => {
//   console.log("here3");
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   const maxSize = Math.max(image.width, image.height);
//   const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

//   canvas.width = safeArea;
//   canvas.height = safeArea;

//   ctx.translate(safeArea / 2, safeArea / 2);
//   ctx.translate(-safeArea / 2, -safeArea / 2);

//   ctx.drawImage(
//     image,
//     safeArea / 2 - image.width * 0.5,
//     safeArea / 2 - image.height * 0.5
//   );

//   const data = ctx.getImageData(0, 0, safeArea, safeArea);

//   canvas.width = crop.width;
//   canvas.height = crop.height;

//   ctx.putImageData(
//     data,
//     Math.round(0 - safeArea / 2 + image.width * 0.5 - crop.x),
//     Math.round(0 - safeArea / 2 + image.height * 0.5 - crop.y)
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((file) => {
//       resolve(file);
//     }, 'image/jpeg');
//   });
// };

// export default getCroppedImg;

import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = imageSrc.naturalWidth / imageSrc.width;
    const scaleY = imageSrc.naturalHeight / imageSrc.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        imageSrc,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg');
    });
};

export default getCroppedImg;
