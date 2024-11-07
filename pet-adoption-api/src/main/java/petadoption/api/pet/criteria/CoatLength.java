package petadoption.api.pet.criteria;

import lombok.Getter;

public enum CoatLength {
    HAIRLESS("Hairless"),
    SHORT("Short"),
    MEDIUM("Medium"),
    LONG("Long");

    @Getter
    private final String displayName;

    CoatLength(String displayName) {
        this.displayName = displayName;
    }
}
