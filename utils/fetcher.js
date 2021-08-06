const fetcher = async (url, token) => {
    let headers = new Headers({ 'Content-Type': 'application/json' })
  
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  
    const res = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'same-origin'
    })
  
    return res.json()
  }
  
  export default fetcher