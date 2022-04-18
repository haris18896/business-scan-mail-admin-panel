import navbar from './navbar'
import layout from './layout'
import { authReducer } from './reducers/auth'
import { profileUpdateReducer } from './reducers/admin/profileUpdateReducer'
import { updatePasswordReducer } from './reducers/admin/updatePasswordReducer'
import skinReducer from './reducers/skin'
import { getEmailsListReducer } from './reducers/mails/mailsListReducer'
import { emailsFilterReducer } from './reducers/mails/mailsFilterReducer'
import { clearSearchDataReducer } from './reducers/mails/clearSearchDataReducer'
import { deleteEmailsReducer } from './reducers/mails/deleteEmailsReducer'
import { getAttachmentReducer } from './reducers/mails/attachmentReducer'

const rootReducer = {
  auth: authReducer,
  navbar,
  layout,
  skin: skinReducer,
  profileUpdate: profileUpdateReducer,
  passwordUpdate: updatePasswordReducer,
  emailList: getEmailsListReducer,
  emailsFilter: emailsFilterReducer,
  clearSearchData: clearSearchDataReducer,
  deleteEmails: deleteEmailsReducer,
  getAttachment: getAttachmentReducer
}

export default rootReducer
