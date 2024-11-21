import { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { Worklet } from 'react-native-bare-kit'

export default function() {
  const [response, setReponse] = useState<string | null>(null)

  useEffect(() => {
    const worklet = new Worklet()

    // Bare handler
    worklet.start('/app.js', `
      // UI to Bare
      const rpc = new BareKit.RPC((req) => {
        if (req.command === 'ping') {
          console.log(req.data.toString())

          req.reply('Bare Replied!')
        }
      })

      // Bare to UI
      const req = rpc.request('bare-ping')
      req.send('Hello from Bare!')
      req.reply('utf8').then((res) => console.log('UI Replied'))
    `)

    // UI handler
    const rpc = new worklet.RPC((req) => {
      if (req.command === 'bare-ping') {
        console.log('got', req.command)
        req.reply('UI Replied!')
      }
    })

    const req = rpc.request('ping')
    req.send('Hello from UI!')
    req.reply('utf8').then((res: string) => setReponse(res))
  }, [])

  return (
    <Text>{response}</Text>
  )
}
