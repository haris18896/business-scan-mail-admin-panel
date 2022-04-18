import React, { useEffect } from 'react'
import '@styles/base/pages/authentication.scss'

import * as Yup from 'yup'
import validator from 'validator'
import classNames from 'classnames'
import Spinner from '../../common/Spinner'
import themeConfig from '@configs/themeConfig'
import InputPasswordToggle from '@components/input-password-toggle'

import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Link, useHistory } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, CardTitle, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { handleUpdatePassword, resetState } from '../../../redux/actions/admin/updateAdminPassword'

function UpdatePassword() {
  const skin = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()

  const { passwordUpdateInProcess, passwordUpdatedSuccess, error } = useSelector(state => state.passwordUpdate)

  const updatePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is a required field!'),
    newPassword: Yup.string()
      .required('Password is a required field!')
      .test('strong-password', 'Password must contain at least 8 characters, one number and one lowercase letter', value => {
        if (!value) {
          return true
        }
        return validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 0, minSymbols: 0 })
      }),
    confirmNewPassword: Yup.string()
      .required('Confirm password is a required field!')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match!')
  })

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: updatePasswordSchema,
    onSubmit: values => {
      if (isObjEmpty(formik.errors)) {
        const { currentPassword, newPassword, confirmNewPassword } = values
        const data = {
          currentPassword,
          newPassword,
          confirmNewPassword
        }
        dispatch(handleUpdatePassword(data))
      }
    }
  })

  useEffect(() => {
    if (passwordUpdatedSuccess?.success) {
      formik.resetForm()
      history.push('/')
    }
  }, [passwordUpdatedSuccess?.success])

  useEffect(() => {
    return () => {
      dispatch(resetState())
    }
  }, [])

  return passwordUpdateInProcess ? (
    <Spinner />
  ) : (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner py-2'>
        <Card className='auth-inner mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              {skin === 'dark' ? (
                <img src={themeConfig.app.appLogoImageLight} alt='logo-dark' height='30px' />
              ) : (
                <img src={themeConfig.app.appLogoImageDark} alt='logo-dark' height='30px' />
              )}
            </Link>
            <CardTitle tag='h4' className='mb-2 text-center'>
              Update Your Password
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={formik.handleSubmit}>
              <FormGroup className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='currentPassword'>
                    Current Password
                  </Label>
                </div>
                <InputPasswordToggle
                  id='currentPassword'
                  name='currentPassword'
                  {...formik.getFieldProps('currentPassword')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid': formik.touched.currentPassword && formik.errors.currentPassword
                  })}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword ? (
                  <FormFeedback>{formik.errors.currentPassword}</FormFeedback>
                ) : null}
              </FormGroup>

              <FormGroup className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  id='newPassword'
                  name='newPassword'
                  {...formik.getFieldProps('newPassword')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid': formik.touched.newPassword && formik.errors.newPassword
                  })}
                />
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <FormFeedback>{formik.errors.newPassword}</FormFeedback>
                ) : null}
              </FormGroup>

              <FormGroup className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='confirmNewPassword'>
                    Confirm Password
                  </Label>
                </div>
                <InputPasswordToggle
                  id='confirmNewPassword'
                  name='confirmNewPassword'
                  {...formik.getFieldProps('confirmNewPassword')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid': formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
                  })}
                />
                {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
                  <FormFeedback>{formik.errors.confirmNewPassword}</FormFeedback>
                ) : null}
              </FormGroup>

              {passwordUpdatedSuccess && <p className='text-success'>{passwordUpdatedSuccess?.msg}</p>}
              {error && <p className='text-danger'>{error.errors?.length ? error.errors[0].msg : error.msg}</p>}

              <Button.Ripple type='submit' color='primary' block>
                Update Password
              </Button.Ripple>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default UpdatePassword
