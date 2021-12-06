import { gql } from '@apollo/client';

const GET_APP_MODULES = gql`
  query GetAppModules {
    appModules {
      modules
    }
  }
`;

const GET_PH_REGIONS = gql`
  query GetPhRegions {
    phLocRegions {
      code
      name
    }
  }
`;

const GET_PH_PROVINCES = gql`
  query GetPhProvinces($regionCode: ID!) {
    phLocProvinces(regionCode: $regionCode) {
      code
      name
    }
  }
`;

const GET_PH_CITIES = gql`
  query GetPhLocMunicipalities($provinceCode: ID!) {
    phLocMunicipalities(provinceCode: $provinceCode) {
      code
      name
    }
  }
`;

const GET_PH_BARANGAYS = gql`
  query GetPhLocBarangays($municipalityCode: ID!) {
    phLocBarangays(municipalityCode: $municipalityCode) {
      code
      name
    }
  }
`;

export { GET_APP_MODULES, GET_PH_REGIONS, GET_PH_PROVINCES, GET_PH_CITIES, GET_PH_BARANGAYS };
