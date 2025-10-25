import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ClienteForm from '../src/app/components/ClienteForm'
 
describe('ClienteForm', () => {
  it('renderiza sem erros', () => {
    render(<ClienteForm />)
  })
})
