import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ClienteList from '../src/app/components/ClienteList'
 
describe('ClienteList', () => {
  it('renderiza sem erros', () => {
    render(<ClienteList clientes={[]} />)
  })
})
