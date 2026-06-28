import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostCard from "../../components/PostCard";

const mockPost = {
  id: 1,
  title: "Post de Teste",
  body: "Conteúdo do post",
  liked: false,
  reactions: { likes: 42, dislikes: 7 },
};

describe("PostCard - reações", () => {
  test("deve exibir o número de curtidas do post", () => {
    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={async () => {}} />
    );

    expect(screen.getByTestId("likes-count")).toHaveTextContent("42");
  });

  test("deve exibir o número de descurtidas do post", () => {
    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={async () => {}} />
    );

    expect(screen.getByTestId("dislikes-count")).toHaveTextContent("7");
  });

  test("deve exibir zero quando reactions não estiver definido", () => {
    const postSemReactions = { ...mockPost, reactions: { likes: 0, dislikes: 0 } };
    render(
      <PostCard post={postSemReactions} isAuthenticated={false} onLike={async () => {}} />
    );

    expect(screen.getByTestId("likes-count")).toHaveTextContent("0");
    expect(screen.getByTestId("dislikes-count")).toHaveTextContent("0");
  });

  test("deve incrementar curtidas ao clicar em Curtir", async () => {
    render(
      <PostCard post={mockPost} isAuthenticated={true} onLike={async () => {}} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    await waitFor(() => {
      expect(screen.getByTestId("likes-count")).toHaveTextContent("43");
    });
  });

  test("deve decrementar curtidas ao clicar novamente após já ter curtido", async () => {
    const postJaCurtido = { ...mockPost, liked: true, reactions: { likes: 42, dislikes: 7 } };
    render(
      <PostCard post={postJaCurtido} isAuthenticated={true} onLike={async () => {}} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtido/i }));

    await waitFor(() => {
      expect(screen.getByTestId("likes-count")).toHaveTextContent("41");
    });
  });

  test("deve reverter o contador se o request falhar", async () => {
    render(
      <PostCard
        post={mockPost}
        isAuthenticated={true}
        onLike={async () => { throw new Error("falha"); }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    await waitFor(() => {
      expect(screen.getByTestId("likes-count")).toHaveTextContent("42");
    });
  });
});
