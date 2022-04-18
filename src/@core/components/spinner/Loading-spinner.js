const ComponentSpinner = () => {
  return (
    <div className='fallback-spinner' style={{ height: '100vh' }}>
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default ComponentSpinner
