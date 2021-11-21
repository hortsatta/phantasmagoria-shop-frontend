import { FC } from 'react';
import { FilePondFile } from 'filepond';
import { FilePond, FilePondProps, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Box, BoxProps } from '@chakra-ui/react';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type Props = FilePondProps & {
  wrapperProps?: BoxProps;
  value?: any;
  onChange?: (files: FilePondFile[]) => void;
};

export const ImageUpload: FC<Props> = ({ wrapperProps, value, onChange, ...moreProps }) => (
  <Box {...wrapperProps}>
    <FilePond
      labelIdle='<span class="filepond--label-text">Drag your image here or </span><span class="filepond--label-action">Browse</span>'
      files={value}
      onupdatefiles={onChange}
      {...moreProps}
    />
  </Box>
);

ImageUpload.defaultProps = {
  wrapperProps: undefined,
  value: undefined,
  onChange: undefined
};
