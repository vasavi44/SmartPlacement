package SmartPlacement.backend.dto;

import SmartPlacement.backend.entity.UserRole;

public class LoginResponse {

    private String token;
    private Long userId;
    private String name;
    private String email;
    private UserRole role;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            Long userId,
            String name,
            String email,
            UserRole role) {

        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}