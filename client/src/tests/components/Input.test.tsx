import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Input from "../../components/Input";

describe("Componente do input", () => {
  test("deve renderizar o placeholder informado", () => {
    render(<Input placeholder="Digite seu nome" />);

    const input = screen.getByPlaceholderText("Digite seu nome");
    expect(input).toBeInTheDocument();
  });

  test("O label deve ter a cor correta informado e a fontWeight correta", () => {
    render(<Input label="Nome" />);

    const label = screen.getByText("Nome");
    expect(label).toHaveStyle("color: var(--foreground)");
    expect(label).toHaveStyle("font-weight: 500");
  });

});