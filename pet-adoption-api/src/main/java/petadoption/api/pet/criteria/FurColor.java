package petadoption.api.pet.criteria;

import lombok.Getter;

public enum FurColor {
    WHITE("White"),
    BLACK("black"),
    BROWN("brown"),
    GRAY("gray"),
    MIXED_COLOR("mixed color"),
    ;
    @Getter
    private final String displayName;

    FurColor(String displayName) {
        this.displayName = displayName;
    }
}
