package petadoption.api.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

public class UserPrincipal implements UserDetails {
    private final Optional<User> user; // Keep Optional<User>

    public UserPrincipal(Optional<User> user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.map(User::getUserType).orElse("USER")));
    }


    @Override
    public String getPassword() {
        // Safely get the password, or return null if user is not present
        return user.map(User::getPassword).orElse(null);
    }

    @Override
    public String getUsername() {
        // Safely get the username, or return null if user is not present
        return user.map(User::getEmailAddress).orElse(null);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Adjust according to your needs
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Adjust according to your needs
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Adjust according to your needs
    }

    @Override
    public boolean isEnabled() {
        return true; // Adjust according to your needs
    }
}

