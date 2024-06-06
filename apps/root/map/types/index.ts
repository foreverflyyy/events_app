export interface IExtraSimilarAddressData {
  postal_code: string | null;
  country: string | null;
  country_iso_code: string | null;
  federal_district: string | null;
  region_iso_code: string | null;
  region_with_type: string | null;
  region: string | null;
  city_with_type: string | null;
  city: string | null;
  street_with_type: string | null;
  street: string | null;
  house_type: string | null;
  house: string | null
}

export interface ISimilarAddressData {
  value: string;
  unrestricted_value: string;
  data: IExtraSimilarAddressData
}