import Jimp from 'jimp/es';

export const optimizeImage = async (file: any): Promise<Buffer> => {
  const fileUrl = URL.createObjectURL(file);
  const image = await Jimp.read(fileUrl);
  const optimizedImage = image
    .resize(file.width || Jimp.AUTO, file.height || Jimp.AUTO)
    .quality(90);
  return optimizedImage.getBufferAsync(Jimp.MIME_JPEG);
};
