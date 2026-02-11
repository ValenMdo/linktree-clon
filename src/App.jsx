import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import LinkButton from './componentes/LinkButton'
import Logo from './assets/Logo.png'

// URL del Sheet: usar variable de entorno para no exponerla en el repo (crear .env desde .env.example)
const SHEET_URL = import.meta.env.VITE_SHEET_URL || ''

function App() {
  const [profile, setProfile] = useState({
    name: 'LUVA INDUMENTARIA',
    avatar: Logo,
    links: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      if (!SHEET_URL) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(SHEET_URL)
        const data = await res.text()
        const parsed = await new Promise((resolve, reject) => {
          Papa.parse(data, {
            header: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err)
          })
        })
        const linksFromSheet = (parsed || [])
          .map((row) => {
            const keys = Object.keys(row)
            return {
              text: (row[keys[0]] || '').trim(),
              url: (row[keys[1]] || '').trim()
            }
          })
          .filter((link) => link.text && link.url)
        setProfile((prev) => ({ ...prev, links: linksFromSheet }))
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGoogleSheetData()
  }, [])

  return (
    // Contenedor global: responsive padding (p-4 móvil, sm:p-6 tablet+), centrado y fondo
    <div className="min-h-screen bg-gradient-to-b from-[#9FA8DA] to-[#7986CB] flex items-center justify-center p-4 sm:p-6">
      {/* Contenedor del perfil: ancho máximo y espaciado responsive (gap y padding) */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 sm:gap-8 py-8 sm:py-12 px-2 sm:px-0">
        {/* Bloque Avatar + nombre */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg"
          />
          <h1 className="text-white text-lg sm:text-xl tracking-wider font-light text-center px-2">
            {profile.name}
          </h1>
        </div>

        {/* Lista de links: mismo ancho que el contenedor, gap entre botones */}
        <div className="w-full flex flex-col items-center gap-3 sm:gap-4">
          {loading ? (
            <div className="text-white">Cargando...</div>
          ) : (
            profile.links.map((link, index) => (
              <LinkButton key={index} text={link.text} url={link.url} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App
