import { Pagination } from "./pagination.interfaces";

interface People {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  dateSeen?: string;
}
export interface Property {
  _id: string;
  address?: string;
  city?: string;
  country?: string;
  county?: string;
  dateAdded?: string;
  dateUpdated?: string;
  postalCode?: string;
  province?: string;
  floorSizeValue?: number;
  floorSizeUnit?: string;
  id?: string;
  imageURLs?: string[];
  keys?: string[];
  latitude?: string;
  longitude?: string;
  lotSizeUnit?: string;
  lotSizeValue?: number;
  numBathroom?: number;
  numBedroom?: number;
  numFloor?: number;
  numParkingSpaces?: number;
  mlsNumber?: string;
  mostRecentPriceAmount?: number;
  mostRecentStatus?: string;
  mostRecentBrokerAgent?: string;
  mostRecentBrokerCompany?: string;
  propertyType?: string;
  neighborhoods?: string[];
  people?: People[];
}

export interface PropertyPreview {
  id: string;
  propertyType: string;
  image: string | null;
  price?: number;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  city: string;
  country: string;
  postalCode?: string;
  livingArea?: number;
}

export interface PropertiesResponse {
  status: boolean;
  data: PropertyPreview[];
  pagination: Pagination;
}

export interface PropertyResponse {
  status: boolean;
  data: Property;
}
