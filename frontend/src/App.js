import React, {useState, useEffect} from 'react'
import Poruka from './components/Poruka'
import axios from 'axios'

const App = (props) => {
  const [ poruke, postaviPoruke] = useState([])
  const [ unosPoruke, postaviUnos] = useState('unesi poruku...')
  const [ ispisSve, postaviIspis] = useState(true)

  const porukeZaIspis = ispisSve
  ? poruke
  : poruke.filter(poruka => poruka.vazno === true)

  const promjenaVaznostiPoruke = (id) => {
    const url = `http://localhost:3001/api/poruke/${id}`
    const poruka = poruke.find(p => p.id === id)
    const modPoruka = {
      ...poruka,
      vazno: !poruka.vazno
    }
  
    axios.put(url, modPoruka)
      .then(response => {
        console.log(response)
        postaviPoruke(poruke.map(p => p.id !== id ? p : response.data))
      })
  }

  useEffect( () => {
    axios.get("http://localhost:3001/api/poruke")
    .then(res => postaviPoruke(res.data))
  }, [])

  const novaPoruka = (e) => {
    e.preventDefault()
    console.log('Klik', e.target)
    const noviObjekt = {
      sadrzaj: unosPoruke,
      datum: new Date().toISOString(),
      vazno: Math.random() > 0.5      
    }
    axios.post("http://localhost:3001/api/poruke", noviObjekt)
    .then(res => {
      postaviPoruke(poruke.concat(res.data))
      postaviUnos('')
    })
    /* postaviPoruke(poruke.concat(noviObjekt))
    postaviUnos('') */
  }

  const promjenaUnosa = (e) => {
    console.log(e.target.value);
    postaviUnos(e.target.value)
  }
  return (
    <div>
      <h1>Poruke</h1>
      <div>
        <button onClick={() => postaviIspis(!ispisSve)}>
          Prikaži { ispisSve ? "važne" : "sve"}
        </button>
      </div>
      <ul>
        {porukeZaIspis.map(p =>
          <Poruka key={p.id} poruka={p} promjenaVaznosti={() => promjenaVaznostiPoruke(p.id)} />
        )}        
      </ul>
      <form onSubmit={novaPoruka}>
        <input value={unosPoruke} onChange={promjenaUnosa} />
        <button type='submit'>Spremi</button>
      </form>
    </div>
  )
}

export default App