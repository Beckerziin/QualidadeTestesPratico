import com.demoapp.demo.DemoApplication;
import com.demoapp.demo.controller.AuthController;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@ContextConfiguration(classes = DemoApplication.class)
class SignupTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  @Test
  void shouldSignupSuccessfully_whenRequestIsValid() throws Exception {
    String email = "user@example.com";
    String password = "Password1!";

    User savedUser = new User();
    savedUser.setId(1L);
    savedUser.setEmail(email);
    savedUser.setPassword(password);

    when(userService.isEmailValid(email)).thenReturn(true);
    when(userService.isPasswordValid(password)).thenReturn(true);
    when(userService.findByEmail(email)).thenReturn(null);
    when(userService.createUser(email, password)).thenReturn(savedUser);

    String payload = String.format(
        "{\n  \"email\": \"%s\",\n  \"password\": \"%s\"\n}",
        email, password);

    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.password").value(password));
  }
}
