'use client'

import { useEffect } from 'react'

useEffect(() => {
  const data = localStorage.getItem('userData')
  console.log(data)
}, [localStorage])
