package petadoption.api.pet.criteria;

import lombok.Getter;

/**
 * @author Rafe Loya
 */
public enum FurType {
    HAIRLESS("Hairless"),
    SMOOTH("Smooth"),
    SILKY("Silky"),
    CURLY("Curly"),
    ROUGH("Rough"),
    WIRY("Wiry"),
    DOUBLE("Double"),
    WAVY("Wavy"),
    CORDED("Corded"),
    ;
    @Getter
    private final String displayName;

    FurType(String displayName) {
        this.displayName = displayName;
    }
}
