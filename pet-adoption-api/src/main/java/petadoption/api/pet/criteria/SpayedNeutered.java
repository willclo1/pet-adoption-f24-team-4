package petadoption.api.pet.criteria;

import lombok.Getter;

public enum SpayedNeutered {
    SPAYED("Spayed"),
    NEUTERED("Neutered"),;

    @Getter
    private final String displayName;

    SpayedNeutered(String displayName) {
        this.displayName = displayName;
    }
}
