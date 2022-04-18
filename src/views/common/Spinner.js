const Spinner = () => {
  return (
    <div className='fallback-spinner' style={{ height: '20vh' }}>
      <div className='loading component-loader'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default Spinner
