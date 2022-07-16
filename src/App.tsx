import { useEffect, useState } from 'react'
import './App.css'
const API = import.meta.env.VITE_APP_API

interface Actividad {
  cuit: number
  cuitRepresentado: number
  domicilio: string
  tipoTelefono: string
  telefono: number
  codigoActividad: string
  descripcionActividad: string
  descripcionCaracter: string
  descripcionCondicion: string
}

const useApp = () => {
  const [data, setData] = useState<Actividad[]>([])
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const callAPI = async () => {
      setError(false)
      setIsLoading(true)

      try {
        const resp = await fetch(API, { signal: controller.signal })
        const json = await resp.json()
        setData(json)
      } catch (error: any) {
        if (controller.signal.aborted) {
          setError(false)
        } else {
          setError(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    callAPI()
    return () => {
      setError(false)
      controller.abort()
    }
  }, [])

  return { data, error, isLoading }
}

function App() {
  const { data, error, isLoading } = useApp()

  return (
    <>
      <div className="App">
        <table>
          <thead>
            <tr>
              <th>Cuit</th>
              <th>Cuit_rep</th>
              <th>Domicilio</th>
              <th>Telefono</th>
              <th>Actividad</th>
              <th>Caracter</th>
              <th>Condicion</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((el, idx) => (
                <tr key={idx}>
                  <td>{el.cuit}</td>
                  <td>{el.cuitRepresentado}</td>
                  <td>{el.domicilio}</td>
                  <td>
                    {el.tipoTelefono} - {el.telefono}
                  </td>
                  <td>
                    {el.codigoActividad} - {el.descripcionActividad}
                  </td>
                  <td>{el.descripcionCaracter}</td>
                  <td>{el.descripcionCondicion}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {isLoading && <div> CARGANDO</div>}
        {error && <div> ERROR </div>}
      </div>
    </>
  )
}

export default App
