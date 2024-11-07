package petadoption.api.pet.criteria;

import lombok.Getter;

public enum Species {
    DOG("Dog"),
    CAT("Cat");

    @Getter
    private final String displayName;

    Species(final String speciesType) {
        this.displayName = speciesType;
    }
}
