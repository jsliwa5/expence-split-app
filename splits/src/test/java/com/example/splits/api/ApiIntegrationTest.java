package com.example.splits.api;

import com.example.splits.application.command.CreateGroupCommand;
import com.example.splits.application.command.DeleteExpenseCommand;
import com.example.splits.application.command.RegisterUserCommand;
import com.example.splits.application.dto.AuthResponse;
import com.example.splits.application.dto.CreateGroupResponse;
import com.example.splits.application.query.ExpenseReadService;
import com.example.splits.application.query.GroupReadService;
import com.example.splits.application.query.LoginQuery;
import com.example.splits.infrastructure.security.CustomUserDetails;
import com.example.splits.infrastructure.security.JwtService;
import com.example.splits.infrastructure.security.SecurityUserEntity;
import com.example.splits.shared.cqrs.CommandBus;
import com.example.splits.shared.cqrs.QueryBus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {AuthController.class, GroupController.class, ExpenseController.class})
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // Symulator przeglądarki/Postmana

    // W Spring Boot 3.4 zastępujemy zewnętrzne zależności mockami
    @MockitoBean
    private CommandBus commandBus;
    @MockitoBean
    private QueryBus queryBus;
    @MockitoBean
    private GroupReadService groupReadService;
    @MockitoBean
    private ExpenseReadService expenseReadService;

    @MockitoBean
    private JwtService jwtService;

    private CustomUserDetails getMockUser() {
        UUID mockUserId = UUID.randomUUID();

        // Zakładam, że Twój SecurityUserEntity ma taki konstruktor (patrząc po RegisterUserCommandHandler):
        SecurityUserEntity dummySecurityEntity = new SecurityUserEntity(
                mockUserId,
                "test@example.com",
                "hashedPassword123"
        );

        return new CustomUserDetails(dummySecurityEntity);
    }

    // --- SCENARIUSZ 1: Rejestracja (AuthController) ---
    @Test
    @DisplayName("1. POST /api/auth/register - powinien zarejestrować i zwrócić 200 OK")
    void shouldRegisterUser() throws Exception {
        UUID expectedUserId = UUID.randomUUID();
        when(commandBus.execute(any(RegisterUserCommand.class))).thenReturn(expectedUserId);

        String jsonPayload = """
                {
                  "firstName": "Jan",
                  "lastName": "Kowalski",
                  "username": "jankowalski",
                  "email": "jan@example.com",
                  "password": "SecretPassword123"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf()) // Wymagane przy POST w Spring Security
                        .with(user(getMockUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(expectedUserId.toString()));
    }

    // --- SCENARIUSZ 2: Logowanie (AuthController) ---
    @Test
    @DisplayName("2. POST /api/auth/login - powinien zalogować i zwrócić JWT")
    void shouldLoginUser() throws Exception {
        AuthResponse authResponse = new AuthResponse("eyJhbGciOiJIUzI1...");
        when(queryBus.execute(any(LoginQuery.class))).thenReturn(authResponse);

        String jsonPayload = """
                {
                  "email": "jan@example.com",
                  "password": "SecretPassword123"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .with(user(getMockUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // Sprawdzamy czy JSON zawiera pole token
    }

    // --- SCENARIUSZ 3: Tworzenie grupy (GroupController) ---
    @Test
    @DisplayName("3. POST /api/group - powinien utworzyć grupę jako zalogowany użytkownik")
    void shouldCreateGroup() throws Exception {
        CustomUserDetails loggedUser = getMockUser();
        UUID groupId = UUID.randomUUID();
        CreateGroupResponse response = new CreateGroupResponse(groupId, "JOIN12");

        when(commandBus.execute(any(CreateGroupCommand.class))).thenReturn(response);

        String jsonPayload = """
                {
                  "name": "Wyjazd w Alpy"
                }
                """;

        mockMvc.perform(post("/api/group")
                        .with(csrf())
                        .with(user(loggedUser)) // Wstrzykujemy zalogowanego użytkownika!
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.groupId").value(groupId.toString()))
                .andExpect(jsonPath("$.joinCode").value("JOIN12"));
    }

    // --- SCENARIUSZ 4: Dołączanie do grupy (GroupController) ---
    @Test
    @DisplayName("4. POST /api/group/join - powinien dołączyć do grupy po kodzie")
    void shouldJoinGroup() throws Exception {
        CustomUserDetails loggedUser = getMockUser();
        UUID groupId = UUID.randomUUID();

        when(commandBus.execute(any())).thenReturn(groupId);

        String jsonPayload = """
                {
                  "joinCode": "JOIN12"
                }
                """;

        mockMvc.perform(post("/api/group/join")
                        .with(csrf())
                        .with(user(loggedUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(groupId.toString()));
    }

    // --- SCENARIUSZ 5: Usuwanie wydatku (ExpenseController) ---
    @Test
    @DisplayName("5. DELETE /api/expense/{id} - powinien usunąć wydatek i zwrócić 204 No Content")
    void shouldDeleteExpense() throws Exception {
        CustomUserDetails loggedUser = getMockUser();
        UUID expenseId = UUID.randomUUID();

        // Usuwanie nie zwraca niczego (Void), więc Mockito domyślnie nic nie zrobi.
        // Wywołujemy po prostu endpoint.

        mockMvc.perform(delete("/api/expense/" + expenseId)
                        .with(csrf())
                        .with(user(loggedUser)))
                .andExpect(status().isNoContent()); // Zgodnie z Twoim kontrolerem - zwraca 204

        // Weryfikujemy, czy kontroler poprawnie wysłał komendę na CommandBus
        verify(commandBus).execute(any(DeleteExpenseCommand.class));
    }
}