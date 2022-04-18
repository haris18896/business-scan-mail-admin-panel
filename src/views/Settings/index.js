/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardHeader, CardTitle, Row, Spinner } from 'reactstrap'
import { handleClearSearchData, resetClearStates } from '../../redux/actions/mails/ClearMailsAction'

function Settings() {
  const dispatch = useDispatch()

  const { currentSkin } = useSelector(state => state.skin)
  const { clearInProcess, searchCleared, error } = useSelector(state => state.clearSearchData)

  const handleClearSearch = () => {
    dispatch(handleClearSearchData())
  }

  useEffect(() => {
    return () => {
      dispatch(resetClearStates())
    }
  }, [])

  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1 mb-75 justify-content-start'>
          <CardHeader>
            <CardTitle tag='h4'>Mail Settings</CardTitle>
            {clearInProcess ? (
              <Spinner />
            ) : (
              <Button.Ripple
                key='clear'
                color={currentSkin === 'light' ? 'primary' : 'secondary'}
                onClick={() => handleClearSearch()}
                style={{ backgroundColor: 'red' }}
              >
                Clear Search Data
              </Button.Ripple>
            )}
          </CardHeader>
          {searchCleared?.success ? <p className='text-success'>{searchCleared?.msg}</p> : ''}
          {error ? <p className='text-danger text-align-center'>{error.msg}</p> : ''}
        </Row>
      </Card>
    </Fragment>
  )
}

export default Settings
