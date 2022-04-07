In _app.js

```
import { CabinetProvider, CabinetClient } from '@silicon-jungle/cabinets-client'

const client = new CabinetClient({
  uri: SOCKET_URL,
  accessToken: ACCESS_TOKEN,
})

const MyApp = ({ Component, pageProps }) => (
  <CabinetProvider client={client}>
    <Component {...pageProps} />
  </CabinetProvider>
)
```

In whichever page or component you'd like to add collaborative content.

```
import { useShelf } from '@silicon-jungle/cabinets-client'

const Page = ({ route }) => {
  const [value, setValue] = useShelf(CABINET_NAME, KEY)
    
  const handleClick = () => {
    setValue(new Date().toString())
  }
    
  return (
    <div>
      <p>{JSON.stringify(value)}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
})
```

Contact me if you'd like an API key.

## License
MIT License

Copyright (c) 2022 James Addison

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
