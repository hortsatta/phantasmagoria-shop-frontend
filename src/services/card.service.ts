import { optimizeImage } from 'helpers';

const createCardImageBlob = async (
  image: any,
  cardId: string,
  cardSlug: string
): Promise<Blob | null> => {
  if (!image) {
    return null;
  }

  // Get image and set height property
  const targetImage = image[0].file;
  targetImage.height = 600;
  // Optimize and convert image file to blob, and set file name
  const buffer = await optimizeImage(targetImage);
  const imageBlob: any = new Blob([buffer], { type: 'image/jpg' });
  imageBlob.name = `${cardId}_${cardSlug}_card-image`;

  return imageBlob;
};

const createCoverImageBlob = async (
  image: any,
  cardId: string,
  cardSlug: string
): Promise<Blob | null> => {
  if (!image) {
    return null;
  }

  // Get image and set height property
  const targetImage = image[0].file;
  targetImage.height = 300;
  // Optimize and convert image file to blob, and set file name
  const buffer = await optimizeImage(targetImage);
  const imageBlob: any = new Blob([buffer], { type: 'image/jpg' });
  imageBlob.name = `${cardId}_${cardSlug}_card-cover-image`;

  return imageBlob;
};

export { createCardImageBlob, createCoverImageBlob };
