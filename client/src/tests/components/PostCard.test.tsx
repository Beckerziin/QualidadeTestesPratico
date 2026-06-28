import { render, screen } from "@testing-library/react";
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
});
