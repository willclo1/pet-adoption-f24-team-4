package petadoption.api.pet.criteria;

public enum Species {
    DOG("Dog"),
    CAT("Cat");

    private final String displayName;

    Species(final String speciesType) {
        this.displayName = speciesType;
    }
}
