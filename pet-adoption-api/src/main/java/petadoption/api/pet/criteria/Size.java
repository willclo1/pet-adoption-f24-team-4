package petadoption.api.pet.criteria;

import lombok.Getter;

/**
 * @author Rafe Loya
 * @author Will Clore
 */
public enum Size {
    SMALL("Small"),
    MEDIUM("Medium"),
    LARGE("Large"),
    EXTRA_LARGE("Extra Large");

    @Getter
    private final String displayName;

    Size(String displayName) {
        this.displayName = displayName;
    }
}
