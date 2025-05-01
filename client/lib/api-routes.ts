// api links
const apiViewAllProperties = () => "/properties";
const apiViewProperty = (id: string) => `/properties/${id}`;
//
const apiSendContactMail = () => "/mail";
const apiSendPropertyRequest = () => "/mail/property-request";

export const ApiRoutes = {
  // apis
  apiViewAllProperties,
  apiViewProperty,
  apiSendContactMail,
  apiSendPropertyRequest,
};
