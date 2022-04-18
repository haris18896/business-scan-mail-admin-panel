import React from 'react'

import * as Yup from 'yup'
import classNames from 'classnames'
import Spinner from '../common/Spinner'
import themeConfig from '@configs/themeConfig'
import InputPasswordToggle from '@components/input-password-toggle'

import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Link, useHistory } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { handleLogin } from '../../redux/actions/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap'
import '@styles/base/pages/authentication.scss'

function Login() {
  const skin = useSkin()
  const history = useHistory()
  const dispatch = useDispatch()

  const { loginInProgress, error } = useSelector(state => state.auth)

  const LoginAdminSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Email is a required field!'),
    password: Yup.string().required('Password is a required field!')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginAdminSchema,
    onSubmit: values => {
      if (isObjEmpty(formik.errors)) {
        const { email, password } = values
        const data = {
          email: email.trim(),
          password: password.trim()
        }
        dispatch(handleLogin(data, history))
      }
    }
  })

  return loginInProgress ? (
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
              Admin Login
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label className='form-label' for='email'>
                  Email
                </Label>
                <Input
                  autoFocus
                  type='email'
                  id='email'
                  name='email'
                  placeholder='admin@example.com'
                  {...formik.getFieldProps('email')}
                  className={classNames({ 'is-invalid': formik.touched.email && formik.errors.email })}
                />
              </FormGroup>

              <FormGroup className='mb-2'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  id='password'
                  name='password'
                  {...formik.getFieldProps('password')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid': formik.touched.password && formik.errors.password
                  })}
                />
              </FormGroup>

              {(error?.statusCode === 401 && error?.msg && <p className='text-danger mb-1'>{error.msg}</p>) || ''}
              <Button.Ripple type='submit' color='primary' block>
                Sign in
              </Button.Ripple>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login
