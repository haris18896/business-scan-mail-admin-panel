import { Fragment, useState, forwardRef, useEffect, useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import classNames from 'classnames'
import Spinner from '../common/Spinner'
import ReactPaginate from 'react-paginate'
import Modal from 'react-modal'

import { columns } from './data'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { useSelector, useDispatch } from 'react-redux'
import { ChevronDown, RefreshCw, Search } from 'react-feather'
import DataTable, { createTheme } from 'react-data-table-component'
import { handleDeleteEmails, resetDeleteData } from '../../redux/actions/mails/deleteEmailAction'
import { handleEmailsFilter, resetEmailsFilter } from '../../redux/actions/mails/EmailsFilterAction'
import { handleEmailsList, handlePageChange, resetEmailsList } from '../../redux/actions/mails/EmailsListAction'
import { Row, Col, Card, Input, Label, Button, Form, FormFeedback, CardTitle, CardHeader, DropdownMenu } from 'reactstrap'

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

createTheme(
  'solarized',
  {
    text: {
      primary: '#',
      secondary: '#2aa198'
    },
    background: {
      default: 'transparent'
    },
    context: {
      background: '#e3f2fd',
      text: '#000'
    },
    divider: {
      default: 'rgba(216, 214, 222, 0.1)'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    maxWidth: '500px'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,.5)'
  }
}

const DataTableWithButtons = () => {
  const dispatch = useDispatch()
  Modal.setAppElement('#root')

  const [selectedRows, setSelectedRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const [customFilterButton, setCustomFilterButton] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleteTabOpen, setDeleteTabOpen] = useState(false)

  const { currentSkin } = useSelector(state => state.skin)
  const { emailInProcess, emailsList, page, totalEmails } = useSelector(state => state.emailList)
  const { filterInProcess, emailFiltered, exportId, error, clearList } = useSelector(state => state.emailsFilter)
  const { deleteEmailInProcess, emailDeleted } = useSelector(state => state.deleteEmails)

  const openDeleteModal = () => {
    setDeleteTabOpen(true)
  }

  const CloseDeleteModal = () => {
    setDeleteTabOpen(false)
  }

  const handlePagination = page => {
    dispatch(handlePageChange(exportId, page))
  }

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows)
  }, [])

  const handleDelete = () => {
    if (deleteEmail === 'yes' || deleteEmail === 'Yes' || deleteEmail === 'YES') {
      setToggleCleared(!toggleCleared)
      const data = {
        exportId: emailsList?.exportId,
        messages: []
      }
      selectedRows.forEach(row => {
        const message = data.messages.find(message => message.account === row.owner)
        if (message) {
          message.messageIds.push(row.messageId)
        } else {
          data.messages.push({
            account: row.owner,
            messageIds: [row.messageId]
          })
        }
      })
      dispatch(handleDeleteEmails(data))
      CloseDeleteModal()
    } else if (deleteEmail === 'no' || deleteEmail === 'No' || deleteEmail === 'NO') {
      CloseDeleteModal()
    }
  }

  const contextActions = useMemo(() => {
    return (
      <Button key='delete' onClick={() => openDeleteModal()} style={{ backgroundColor: 'red' }}>
        Delete
      </Button>
    )
  }, [emailsList?.emails, selectedRows, toggleCleared])

  const emailFilterSchema = Yup.object().shape({
    from: Yup.string().max(100, 'Must be 100 characters or less'),
    to: Yup.string().max(100, 'Must be 100 characters or less'),
    subject: Yup.string().max(100, 'Must be 100 characters or less'),
    hasTheWords: Yup.string().max(200, 'Must be 200 characters or less'),
    doesNotHave: Yup.string().max(100, 'Must be 100 characters or less'),
    size: Yup.object().shape({
      comparisonTerm: Yup.string().matches(/^(smaller|larger)$/, 'Comparison Term must be either smaller or larger'),
      comparisonValue: Yup.number()
        .min(0, 'Comparison Value must be a positive number')
        .when('comparisonTerm', {
          is: comparisonTerm => ['smaller', 'larger'].includes(comparisonTerm),
          then: Yup.number().positive('Comparison Value must be a positive number').required('Comparison Value is required')
        }),
      comparisonUnit: Yup.string().when('comparisonTerm', {
        is: comparisonTerm => ['smaller', 'larger'].includes(comparisonTerm),
        then: Yup.string()
          .matches(/^(B|KB|MB)$/, 'Comparison Unit must be either B, KB or MB')
          .required('Comparison Unit is required')
      })
    }),
    dateSentFrom: Yup.date(),
    dateSentTo: Yup.date().min(Yup.ref('dateSentFrom'), 'Date sent to must be greater than date sent from'),
    folder: Yup.string().matches(
      /^(inbox|spam|trash|drafts|anywhere)$/,
      'folder must be either inbox, spam, trash, drafts or anywhere'
    ),
    type: Yup.string().matches(/^(read|unread|sent|starred)$/, 'Type must be either read, unread, sent or starred'),
    hasAttachment: Yup.boolean().oneOf([true, false], 'hasAttachment must be either true or false'),
    customFilter: Yup.string(),
    entity: Yup.string()
      .required('Entity is required')
      .matches(/^(allAccounts|specificAccounts)$/, 'entity must be either allAccounts or specificAccounts'),
    specificAccounts: Yup.array().of(Yup.string().required('Account is required')).nullable()
  })

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      subject: '',
      hasTheWords: '',
      doesNotHave: '',
      size: {
        comparisonTerm: '',
        comparisonValue: '',
        comparisonUnit: ''
      },
      dateSentFrom: '',
      dateSentTo: '',
      folder: '',
      type: '',
      hasAttachment: false,
      customFilter: '',
      entity: 'allAccounts',
      specificAccounts: []
    },
    enableReinitialize: true,
    validationSchema: emailFilterSchema,
    onSubmit: values => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          from: values.from,
          to: values.to,
          subject: values.subject,
          hasTheWords: values.hasTheWords,
          doesNotHave: values.doesNotHave,
          size: {
            comparisonTerm: values.size?.comparisonTerm,
            comparisonValue: values.size?.comparisonValue,
            comparisonUnit: values.size?.comparisonUnit
          },
          dateSentFrom: values.dateSentFrom,
          dateSentTo: values.dateSentTo,
          folder: values.folder,
          type: values.type,
          hasAttachment: values.hasAttachment,
          customFilter: values.customFilter,
          entity: values.entity,
          specificAccounts:
            (values.entity === 'specificAccounts' && values.specificAccounts.split(',').map(email => email.trim())) || []
        }
        dispatch(handleEmailsFilter(data))
      }
    }
  })

  useEffect(() => {
    if (exportId) {
      dispatch(handleEmailsList(exportId, page))
    }
  }, [exportId, page, emailDeleted])

  useEffect(() => {
    return () => {
      dispatch(resetEmailsList())
      dispatch(resetEmailsFilter())
      dispatch(resetDeleteData())
    }
  }, [])

  useEffect(() => {
    if (clearList) {
      dispatch(resetEmailsList())
    }
  }, [clearList])

  const resetFilters = () => {
    formik.resetForm()
  }

  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={emailsList?.totalPages || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={page !== 0 ? page - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  return (
    <Fragment>
      <Card style={{ paddingBottom: '30px' }}>
        <Modal isOpen={deleteTabOpen} onRequestClose={CloseDeleteModal} style={customStyles}>
          <Label style={{ marginRight: '10px' }} className='mr-1' for='deleteRow'>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Are you sure you want to delete: </span>
            {selectedRows.map(r => `${r.messageId}\n`)}
          </Label>
          <Input
            type='text'
            name='deleteRow'
            id='deleteRow'
            placeholder='yes or no'
            className='mt-1 form-control'
            onChange={e => setDeleteEmail(e.target.value)}
          />
          <div>
            <Button.Ripple color={currentSkin === 'light' ? 'primary' : 'secondary'} className='mt-1' onClick={handleDelete}>
              Confirm
            </Button.Ripple>
          </div>
        </Modal>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'> Email Audit Tool</CardTitle>
          <div className='d-flex align-items-center justify-content-center'>
            <Label for='switch-secondary' style={{ marginRight: '10px' }} className='form-check-label'>
              Custom Filter
            </Label>
            <div className='form-switch form-check-secondary'>
              <Input
                style={{ cursor: 'pointer' }}
                type='switch'
                id='switch-secondary'
                name='secondary'
                className='smallHeightInput'
                onClick={() => setCustomFilterButton(!customFilterButton)}
              />
            </div>
          </div>
        </CardHeader>

        {!customFilterButton ? (
          <Form method='post' onSubmit={formik.handleSubmit}>
            <Row className='mx-0 mt-1 mb-75 justify-content-between'>
              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='from'>
                    From
                  </Label>
                  <Input
                    type='text'
                    bsSize='sm'
                    id='from'
                    name='from'
                    maxLength='100'
                    {...formik.getFieldProps('from')}
                    className={classNames({ 'dataTable-filter': true, 'is-invalid': formik.touched.from && formik.errors.from })}
                  />
                </div>
                {formik.touched.from && formik.errors.from ? <FormFeedback>{formik.errors.from}</FormFeedback> : null}
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='to'>
                    To
                  </Label>
                  <Input
                    type='text'
                    bsSize='sm'
                    maxLength='100'
                    id='to'
                    name='to'
                    {...formik.getFieldProps('to')}
                    className={classNames({ 'dataTable-filter': true, 'is-invalid': formik.touched.to && formik.errors.to })}
                  />
                </div>
                {formik.touched.to && formik.errors.to ? <FormFeedback>{formik.errors.to}</FormFeedback> : null}
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='subject'>
                    Subject
                  </Label>
                  <Input
                    type='text'
                    bsSize='sm'
                    maxLength='100'
                    id='subject'
                    name='subject'
                    {...formik.getFieldProps('subject')}
                    className={classNames({
                      'dataTable-filter': true,
                      'is-invalid': formik.touched.subject && formik.errors.subject
                    })}
                  />
                  {formik.touched.subject && formik.errors.subject ? <FormFeedback>{formik.errors.subject}</FormFeedback> : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <Label for='size' className='form-label'>
                  Size
                </Label>
                <div className='d-flex align-items-center'>
                  <Input
                    type='select'
                    name='size?.comparisonTerm'
                    id='size?.comparisonTerm'
                    placeholder='Term'
                    {...formik.getFieldProps('size.comparisonTerm')}
                    className={classNames({
                      'is-invalid': formik.touched.size?.comparisonTerm && formik.errors.size?.comparisonTerm
                    })}
                  >
                    <option value=''>Choose...</option>
                    <option value='smaller'>Smaller</option>
                    <option value='larger'>Larger</option>
                  </Input>
                  <Input
                    type='number'
                    name='size?.comparisonValue'
                    id='size?.comparisonValue'
                    style={{ marginLeft: '7px' }}
                    placeholder='value'
                    min='0'
                    {...formik.getFieldProps('size.comparisonValue')}
                    className={classNames({
                      'is-invalid': formik.touched.size?.comparisonValue && formik.errors.size?.comparisonValue
                    })}
                  />
                  <Input
                    type='select'
                    name='size?.comparisonUnit'
                    id='size?.comparisonUnit'
                    placeholder='Unit'
                    style={{ marginLeft: '7px' }}
                    {...formik.getFieldProps('size.comparisonUnit')}
                    className={classNames({
                      'is-invalid': formik.touched.size?.comparisonUnit && formik.errors.size?.comparisonUnit
                    })}
                  >
                    <option value=''>Choose...</option>
                    <option value='MB'>MB</option>
                    <option value='KB'>KB</option>
                    <option value='B'>Bytes</option>
                  </Input>
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='dateSentFrom' className='form-label'>
                    Date Sent From
                  </Label>
                  <Input
                    type='date'
                    name='dateSentFrom'
                    id='dateSentFrom'
                    placeholder='DateSentFrom'
                    {...formik.getFieldProps('dateSentFrom')}
                    className={classNames({ 'is-invalid': formik.touched.dateSentFrom && formik.errors.dateSentFrom })}
                  />
                </div>
                {formik.touched.dateSentFrom && formik.errors.dateSentFrom ? (
                  <FormFeedback>{formik.errors.dateSentFrom}</FormFeedback>
                ) : null}
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='dateSentTo' className='form-label'>
                    Date Sent To
                  </Label>
                  <Input
                    type='date'
                    name='dateSentTo'
                    id='dateSentTo'
                    placeholder='DateSentTo'
                    {...formik.getFieldProps('dateSentTo')}
                    className={classNames({ 'is-invalid': formik.touched.dateSentTo && formik.errors.dateSentTo })}
                  />
                  {formik.touched.dateSentTo && formik.errors.dateSentTo ? (
                    <FormFeedback>{formik.errors.dateSentTo}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='folder' className='form-label'>
                    Folder
                  </Label>
                  <Input
                    type='select'
                    name='folder'
                    id='folder'
                    placeholder='Scope'
                    {...formik.getFieldProps('folder')}
                    className={classNames({ 'is-invalid': formik.touched.folder && formik.errors.folder })}
                  >
                    <option value=''>Choose...</option>
                    <option value='inbox'>Inbox</option>
                    <option value='spam'>spam</option>
                    <option value='trash'>trash</option>
                    <option value='drafts'>drafts</option>
                    <option value='anywhere'>Mail & Spam & Trash</option>
                  </Input>
                  {formik.touched.folder && formik.errors.folder ? <FormFeedback>{formik.errors.folder}</FormFeedback> : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='type' className='form-label'>
                    Type
                  </Label>
                  <Input
                    type='select'
                    name='type'
                    id='type'
                    placeholder='Type'
                    {...formik.getFieldProps('type')}
                    className={classNames({ 'is-invalid': formik.touched.type && formik.errors.type })}
                  >
                    <option value=''>Choose...</option>
                    <option value='read'>read</option>
                    <option value='unread'>unread</option>
                    <option value='sent'>sent</option>
                    <option value='starred'>starred</option>
                  </Input>
                  {formik.touched.type && formik.errors.type ? <FormFeedback>{formik.errors.type}</FormFeedback> : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='entity' className='form-label'>
                    Entity
                  </Label>
                  <Input
                    type='select'
                    name='entity'
                    id='entity'
                    placeholder='entity'
                    required
                    {...formik.getFieldProps('entity')}
                    className={classNames({ 'is-invalid': formik.touched.entity && formik.errors.entity })}
                  >
                    <option value='allAccounts'>All Accounts</option>
                    <option value='specificAccounts'>Specific Account</option>
                  </Input>
                  {formik.touched.entity && formik.errors.entity ? <FormFeedback>{formik.errors.entity}</FormFeedback> : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='specificAccounts' className='form-label'>
                    Specific Account
                  </Label>
                  <Input
                    type='text'
                    name='specificAccounts'
                    id='specificAccounts'
                    placeholder='Specific Account'
                    disabled={formik.values.entity === 'allAccounts'}
                    required={formik.values.entity === 'specificAccounts'}
                    {...formik.getFieldProps('specificAccounts')}
                    className={classNames({
                      'is-invalid':
                        // formik.values.entity === 'specificAccounts' &&
                        formik.touched.specificAccounts && formik.errors.specificAccounts
                    })}
                  />
                  {formik.touched.specificAccounts && formik.errors.specificAccounts ? (
                    <FormFeedback>{formik.errors.specificAccounts}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='hasTheWords'>
                    Has the Words
                  </Label>
                  <Input
                    type='textarea'
                    bsSize='sm'
                    maxLength='200'
                    id='hasTheWords'
                    name='hasTheWords'
                    {...formik.getFieldProps('hasTheWords')}
                    className={classNames({
                      'dataTable-filter': true,
                      'is-invalid': formik.touched.hasTheWords && formik.errors.hasTheWords
                    })}
                  />
                  {formik.touched.hasTheWords && formik.errors.hasTheWords ? (
                    <FormFeedback>{formik.errors.hasTheWords}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='doesNotHave'>
                    Doesn't have
                  </Label>
                  <Input
                    type='textarea'
                    bsSize='sm'
                    maxLength='100'
                    id='doesNotHave'
                    name='doesNotHave'
                    {...formik.getFieldProps('doesNotHave')}
                    className={classNames({
                      'dataTable-filter': true,
                      'is-invalid': formik.touched.doesNotHave && formik.errors.doesNotHave
                    })}
                  />
                  {formik.touched.doesNotHave && formik.errors.doesNotHave ? (
                    <FormFeedback>{formik.errors.doesNotHave}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col sm={6} lg={3} className='d-flex align-items-center'>
                <Input
                  type='checkbox'
                  name='hasAttachment'
                  id='hasAttachment'
                  {...formik.getFieldProps('hasAttachment')}
                  className={classNames({ 'is-invalid': formik.touched.hasAttachment && formik.errors.hasAttachment })}
                />
                {formik.touched.hasAttachment && formik.errors.hasAttachment ? (
                  <FormFeedback>{formik.errors.hasAttachment}</FormFeedback>
                ) : null}
                <Label for='hasAttachment' className='form-label' style={{ marginLeft: '10px' }}>
                  Has attachment
                </Label>
              </Col>

              <Col sm={6} lg={3} className='d-flex align-items-center justify-content-end'>
                <Label for='resetFilter' style={{ marginRight: '10px', whiteSpace: 'nowrap' }} className='mr-1'>
                  Reset Filters
                </Label>
                <RefreshCw style={{ cursor: 'pointer' }} onClick={resetFilters} size={20} />
              </Col>
            </Row>
            <Button.Ripple
              className='btn btn-primary m-1'
              type='submit'
              color={currentSkin === 'light' ? 'primary' : 'secondary'}
              disabled={filterInProcess || emailInProcess || deleteEmailInProcess}
            >
              Search
            </Button.Ripple>
          </Form>
        ) : (
          <Form method='post' onSubmit={formik.handleSubmit}>
            <Row className='mx-0 mt-1 mb-75 justify-content-between'>
              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='entity' className='form-label'>
                    Entity
                  </Label>
                  <Input
                    type='select'
                    name='entity'
                    id='entity'
                    placeholder='entity'
                    required
                    {...formik.getFieldProps('entity')}
                    className={classNames({ 'is-invalid': formik.touched.entity && formik.errors.entity })}
                  >
                    <option value='allAccounts'>All Accounts</option>
                    <option value='specificAccounts'>Specific Account</option>
                  </Input>
                  {formik.touched.entity && formik.errors.entity ? <FormFeedback>{formik.errors.entity}</FormFeedback> : null}
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label for='specificAccounts' className='form-label'>
                    Specific Account
                  </Label>
                  <Input
                    type='text'
                    name='specificAccounts'
                    id='specificAccounts'
                    placeholder='Specific Account'
                    disabled={formik.values.entity === 'allAccounts'}
                    required={formik.values.entity === 'specificAccounts'}
                    {...formik.getFieldProps('specificAccounts')}
                    className={classNames({
                      'is-invalid':
                        formik.values.entity === 'specificAccounts' &&
                        formik.touched.specificAccounts &&
                        formik.errors.specificAccounts
                    })}
                  />
                </div>
              </Col>

              <Col sm={12} md={6} className='mb-1'>
                <div className='d-flex flex-column'>
                  <Label style={{ marginRight: '10px' }} className='mr-1' for='customFilter'>
                    Search
                  </Label>
                  <Input
                    style={{ padding: '8px 14px' }}
                    type='text'
                    bsSize='sm'
                    id='customFilter'
                    name='customFilter'
                    placeholder='search...'
                    {...formik.getFieldProps('customFilter')}
                    className={classNames({
                      'dataTable-filter': true,
                      'is-invalid': formik.touched.customFilter && formik.errors.customFilter
                    })}
                  />
                  {formik.touched.customFilter && formik.errors.customFilter ? (
                    <FormFeedback>{formik.errors.customFilter}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col sm={6} lg={3} className='d-flex align-items-center justify-content-end'>
                <Label for='resetFilter' style={{ marginRight: '10px', whiteSpace: 'nowrap' }} className='mr-1'>
                  Reset Filters
                </Label>
                <RefreshCw style={{ cursor: 'pointer' }} onClick={resetFilters} size={20} />
              </Col>
            </Row>
            <Button.Ripple
              className='btn btn-primary m-1'
              color={currentSkin === 'light' ? 'primary' : 'secondary'}
              type='submit'
              disabled={filterInProcess || emailInProcess || deleteEmailInProcess}
            >
              Search
            </Button.Ripple>
          </Form>
        )}

        {filterInProcess || emailInProcess ? (
          <Spinner />
        ) : emailFiltered?.success && emailsList?.emails.length > 0 ? (
          <div className='react-dataTable'>
            <DataTable
              title='Search Results'
              columns={columns}
              data={emailsList?.emails}
              contextActions={contextActions}
              onSelectedRowsChange={handleRowSelected}
              clearSelectedRows={toggleCleared}
              selectableRows
              theme='solarized'
              pagination
              paginationComponent={CustomPagination}
              className='react-dataTable '
              sortIcon={<ChevronDown size={10} />}
              paginationDefaultPage={page + 1}
              selectableRowsComponent={BootstrapCheckbox}
              highlightOnHover
              pointerOnHover
            />
          </div>
        ) : (
          <div className='react-dataTable d-flex align-items-center justify-content-center' style={{ minHeight: '20vh' }}>
            <div className='mb-1 d-flex flex-column align-items-center justify-content-center'>
              <Search className='mb-1' size={50} />
              <h4>Search for result</h4>
              {error?.statusCode === 404 || error?.statusCode === 500 ? <p className='text-danger'>{error.msg}</p> : ''}
            </div>
          </div>
        )}

        <Row className='mx-0 justify-content-between'>
          <span>
            <b>Total Records:</b> {emailFiltered?.success && totalEmails}
          </span>
        </Row>
      </Card>
    </Fragment>
  )
}

export default DataTableWithButtons
