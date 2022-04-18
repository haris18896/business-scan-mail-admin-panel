// ** Auth Endpoints
import { MAIN_SERVICE_URL } from '../../../constants/const'

export default {
  loginEndpoint: `${MAIN_SERVICE_URL}/admin/loginAdmin`,
  fetchProfileEndPoint: `${MAIN_SERVICE_URL}/admin/getAdminProfile`,
  updateAdminProfile: `${MAIN_SERVICE_URL}/admin/updateAdminProfile`,
  updatePasswordEndPoint: `${MAIN_SERVICE_URL}/admin/updateAdminPassword`,
  getEmailsListEndPoint: `${MAIN_SERVICE_URL}/email/listEmails`,
  getEmailsSearchFilterEndPoint: `${MAIN_SERVICE_URL}/email/searchEmails`,
  clearSearchDataEndPoint: `${MAIN_SERVICE_URL}/email/clearSearchData`,
  deleteEmailsEndPoint: `${MAIN_SERVICE_URL}/email/deleteEmails`,
  getAttachmentEndPoint: `${MAIN_SERVICE_URL}/email/getAttachment`,

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'JWT',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken'
}
