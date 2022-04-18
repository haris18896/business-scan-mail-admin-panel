/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

import { X, ChevronDown, ChevronUp } from 'react-feather'
import { Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetAttachment, resetAttachment } from '../../redux/actions/mails/getAttachmentAction'
import { useHistory } from 'react-router-dom'

const AddNewModal = ({ email, open, handleModal }) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const { getAttachmentInProcess, success, error } = useSelector(state => state.getAttachment)
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  const DownloadAttachment = index => {
    const data = {
      account: email?.owner,
      messageId: email?.messageId,
      attachment: {
        filename: email?.attachments[index].filename,
        mimeType: email?.attachments[index].mimeType,
        attachmentId: email?.attachments[index].attachmentId
      }
    }
    dispatch(handleGetAttachment(data))
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
      style={{ minWidth: '50%' }}
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>{email?.subject.length > 60 ? `${email?.subject.slice(0, 60)}...` : email?.subject}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='me-1'>
          <h5 className='modal-title'>{email?.from || ''}</h5>
          <p className='text-muted cursor' onClick={() => setShow(!show)}>
            to {email?.to || ''} {show ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </p>
          {show ? (
            <div>
              <p className='details_p_tag'>
                <span className='text-muted text-align-right'>from:&nbsp;</span>
                {email?.from || ''}
              </p>
              <p className='details_p_tag text-align-right'>
                <span className='text-muted'>to:&nbsp;</span>
                {email?.to || ''}
              </p>
              <p className='details_p_tag text-align-right'>
                <span className='text-muted'>date:&nbsp;</span>
                {new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(email?.date)) || ''}
              </p>
              <p className='details_p_tag text-align-right'>
                <span className='text-muted'>subject:&nbsp;</span>
                {email?.subject || ''}
              </p>
              <p className='details_p_tag text-align-right'>
                <span className='text-muted'>Label Ids:&nbsp;</span>
                {email?.labelIds.join(', ') || ''}
              </p>

              {email?.cc && (
                <p className='details_p_tag text-align-right'>
                  <span className='text-muted'>cc:&nbsp;</span>
                  {email?.cc || ''}
                </p>
              )}
              {email?.bcc && (
                <p className='details_p_tag text-align-right'>
                  <span className='text-muted'>bcc:&nbsp;</span>
                  {email?.bcc || ''}
                </p>
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        {/* <p style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: email?.content?.text || '' }} /> */}
        <div style={{ marginTop: '25px' }} dangerouslySetInnerHTML={{ __html: email?.content?.html || '' }} />

        {email?.hasAttachment &&
          email?.attachments.map((item, index) => (
            <div key={index} className=' border-top mt-1'>
              <h5 className='modal-title'>
                {item?.filename} ({item?.size}){' '}
                {/* <span className='download_link' onClick={() => DownloadAttachment(index)}>
                  Download
                </span> */}
              </h5>
            </div>
          ))}
        {error && <p className='mt-1 text-danger'>{error.msg}</p>}
        {getAttachmentInProcess && <Spinner className='mt-1' />}
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal
