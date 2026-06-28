import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "../../app/signup/page";
import * as authService from "../../service/auth/auth";
import * as nextRouter from "next/navigation";
import * as AuthContextModule from "../../contexts/AuthContext";
import * as localStorage from "../../lib/localStorage";

// mocka os hooks da pagina
jest.mock("../../service/auth/auth");
jest.mock("next/navigation");
jest.mock("../../contexts/AuthContext");
jest.mock("../../lib/localStorage");

describe("Teste de Integração - Página SignUp", () => {
  let mockPush: jest.Mock;
  let mockLogin: jest.Mock;
  let signUpMock: jest.Mock;

  const getSubmitButton = () => {
    const buttons = screen.getAllByRole("button", { name: /Criar Conta/i });
    return buttons[buttons.length - 1];
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (localStorage.getUser as jest.Mock).mockReturnValue(null);
    (localStorage.saveUser as jest.Mock).mockImplementation(() => {});
    (localStorage.removeUser as jest.Mock).mockImplementation(() => {});

    mockPush = jest.fn();
    (nextRouter.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockLogin = jest.fn();
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    });

    signUpMock = jest.fn().mockResolvedValue({
      id: "123",
      email: "test@email.com",
    });
    (authService as any).authService = {
      signUp: signUpMock,
    };
  });

  test("Deve validar campos obrigatórios antes de submeter", async () => {
    render(<SignUp />);

    const submitButton = getSubmitButton();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
      expect(screen.getByText("Confirmação de senha é obrigatória")).toBeInTheDocument();
    });

    expect(signUpMock).not.toHaveBeenCalled();
  });

  test("Deve criar conta com sucesso e redirecionar para home", async () => {
    render(<SignUp />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText("••••••••");
    const submitButton = getSubmitButton();

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123@" } });
    fireEvent.change(confirmInput, { target: { value: "Password123@" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "Password123@",
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
});