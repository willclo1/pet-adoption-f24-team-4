package petadoption.api.pet.criteria;

import lombok.Getter;

public enum Health {
    EXCELLENT("Excellent", "This pet is in perfect health."),
    GOOD("Good", "This pet is in good health, no issues."),
    FAIR("Fair", "This pet is experiencing minor health issues."),
    POOR("Poor", "This pet is in poor health, may require extra care.");

    @Getter
    private final String description;
    @Getter
    private final String displayName;

    Health(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}
