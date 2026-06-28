import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignIn from "../../app/signin/page";
import * as authService from "../../service/auth/auth";
import * as nextRouter from "next/navigation";
import * as AuthContextModule from "../../contexts/AuthContext";
import * as localStorage from "../../lib/localStorage";

// mocka os hooks da pagian
jest.mock("../../service/auth/auth");
jest.mock("next/navigation");
jest.mock("../../contexts/AuthContext");
jest.mock("../../lib/localStorage");

describe("Teste de Integração - Página SignIn", () => {

  // funcoes vazia para chamar os mocks
  let mockPush: jest.Mock;
  let mockLogin: jest.Mock;
  let signInMock: jest.Mock;

  // pega o botao de submit 
  const getSubmitButton = () => {
    const buttons = screen.getAllByRole("button", { name: /Entrar/i });
    return buttons[buttons.length - 1];
  };

  //reseta a tela antes dos testes
  beforeEach(() => {
    jest.clearAllMocks();

    // seta o local stoarge 
    (localStorage.getUser as jest.Mock).mockReturnValue(null);
    (localStorage.saveUser as jest.Mock).mockImplementation(() => {});
    (localStorage.removeUser as jest.Mock).mockImplementation(() => {});

    // mocka o use router
    mockPush = jest.fn();
    (nextRouter.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // mocka use auth
    mockLogin = jest.fn();
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    });

    // mocka o auth service de login
    signInMock = jest.fn().mockResolvedValue({
      id: "123",
      email: "test@email.com",
    });
    (authService as any).authService = {
      signIn: signInMock,
    };
  });

  test("Deve validar campos obrigatórios antes de submeter", async () => {
    render(<SignIn />);

    const submitButton = getSubmitButton();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    });

    expect(signInMock).not.toHaveBeenCalled();
  });

  test("Deve fazer login com sucesso e redirecionar para home", async () => {
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = getSubmitButton();

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password1423" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: "123",
        email: "test@email.com",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("Deve exibir mensagem de erro quando falhar a autenticação", async () => {
    signInMock.mockRejectedValue(new Error("Network error"));

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = getSubmitButton();

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "nao-e-uma-senha" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao fazer login. Verifique suas credenciais.")
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
