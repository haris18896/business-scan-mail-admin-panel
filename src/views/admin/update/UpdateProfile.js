import React, { useEffect } from 'react'
import '@styles/base/pages/authentication.scss'

import * as Yup from 'yup'
import validator from 'validator'
import classNames from 'classnames'
import Spinner from '../../common/Spinner'
import themeConfig from '@configs/themeConfig'

import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Link, useHistory } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, CardTitle, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { handleFetchProfile, handleUpdateProfile, resetState } from '../../../redux/actions/admin/profile'

function UpdateProfile() {
  const skin = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()

  const { isFetching, error, success, profile } = useSelector(state => state.profileUpdate)

  const updateProfileSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is a required field!')
      .min(4, 'Name must contain at least 4 characters')
      .test('name', 'Name must not contain numbers or special characters', value => {
        if (!value) {
          return true
        }
        return validator.isAlpha(value, 'en-US', { ignore: ' -' })
      }),
    email: Yup.string().email('Please enter a valid email address').required('Email is a required field!')
  })

  const formik = useFormik({
    initialValues: {
      name: profile && profile['name'],
      email: profile && profile['email']
    },
    enableReinitialize: true,
    validationSchema: updateProfileSchema,
    onSubmit: values => {
      if (isObjEmpty(formik.errors)) {
        const { name, email } = values
        const data = {
          name,
          email
        }
        dispatch(handleUpdateProfile(data))
      }
    }
  })

  useEffect(() => {
    dispatch(handleFetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      const { name, email } = profile
      formik.resetForm(name, email)
    }
  }, [profile])

  useEffect(() => {
    return () => {
      dispatch(resetState())
    }
  }, [])

  useEffect(() => {
    if (success) {
      formik.resetForm()
      history.push('/')
    }
  }, [success])

  return isFetching ? (
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
              Update Your Profile
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label className='form-label' htmlFor='name'>
                  Name
                </Label>
                <Input
                  autoFocus
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Abdullah'
                  className={classNames({ 'is-invalid': formik.touched.name && formik.errors.name })}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name ? <FormFeedback>{formik.errors.name}</FormFeedback> : null}
              </FormGroup>

              <FormGroup>
                <Label className='form-label' htmlFor='email'>
                  Email
                </Label>
                <Input
                  type='email'
                  name='email'
                  id='email'
                  placeholder='abdullah@example.com'
                  className={classNames({ 'is-invalid': formik.touched.email && formik.errors.email })}
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? <FormFeedback>{formik.errors.email}</FormFeedback> : null}
              </FormGroup>

              {success && <p className='text-success'>Profile has been successfully updated!</p>}
              {error && <p className='text-danger'>{error.errors?.length ? error.errors[0].msg : error.msg}</p>}

              <Button.Ripple type='submit' color='primary' block>
                Update Profile
              </Button.Ripple>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default UpdateProfile
