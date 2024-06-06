import {ApiProperty} from "@nestjs/swagger";

export class ExtraSimilarAddressData {
  @ApiProperty({type: String, default: "236022"})
  postal_code: string | null;

  @ApiProperty({type: String, default: "Россия"})
  country: string;

  @ApiProperty({type: String, default: "RU"})
  country_iso_code: string;

  @ApiProperty({type: String, default: "Северо-Западный"})
  federal_district: string;

  @ApiProperty({type: String, default: "RU-KGD"})
  region_iso_code: string;

  @ApiProperty({type: String, default: "Калининградская обл"})
  region_with_type: string;

  @ApiProperty({type: String, default: "Калининградская"})
  region: string;

  @ApiProperty({type: String, default: "г Калининград"})
  city_with_type: string;

  @ApiProperty({type: String, default: "Калининград"})
  city: string;

  @ApiProperty({type: String, default: "ул Чкалова"})
  street_with_type: string;

  @ApiProperty({type: String, default: "Чкалова"})
  street: string;

  @ApiProperty({type: String, default: "д"})
  house_type: string;

  @ApiProperty({type: String, default: "1"})
  house: string
}

export class SimilarAddress {
  @ApiProperty({
    type: String,
    description: "Короткое название адреса",
    default: "г Калининград, ул Чкалова"
  })
  value: string;

  @ApiProperty({
    type: String,
    description: "Полное название адреса",
    default: "236022, Калининградская обл, г Калининград, Центральный р-н, ул Чкалова"})
  unrestricted_value: string;

  @ApiProperty({type: ExtraSimilarAddressData, description: "Подробные данные"})
  data: object
}

export class SimilarAddressesResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [SimilarAddress], description: "Полученные данные"})
  data: object;
}