import { gql } from '@apollo/client';

const UPLOAD = gql`
  mutation Upload(
    $file: Upload!
    $refId: ID
    $ref: String
    $field: String
    $info: FileInfoInput
    $source: String = "phantasmagoria-shop-frontend"
  ) {
    upload(file: $file, refId: $refId, ref: $ref, field: $field, info: $info, source: $source) {
      id
      name
      url
      previewUrl
    }
  }
`;

export { UPLOAD };
