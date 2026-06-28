import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Button from "../../components/Button";

describe("Componente do botão", () => {
  test("deve renderizar o texto informado", () => {
    render(<Button>Clique Aqui</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Clique Aqui");
  });

  test("deve exibir 'Carregando...' e ficar desabilitado quando isLoading for true", () => {
    render(<Button isLoading>Salvar</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Carregando...");
    expect(button).toBeDisabled();
  });
});