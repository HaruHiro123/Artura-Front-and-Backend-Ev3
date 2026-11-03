import { useContext } from 'react'
import ArturaDataContext from '../context/ArturaDataContext.js'

export default function useArturaData() {
  const value = useContext(ArturaDataContext)
  if (!value) throw new Error('useArturaData must be used inside ArturaDataProvider.')
  return value
}
