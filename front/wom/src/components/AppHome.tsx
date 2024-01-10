import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function AppHome() {
  return (
    <div>
      <Button variant='contained' component={Link} to="/recommandations">Recommandations</Button>
    </div>
  )
}
