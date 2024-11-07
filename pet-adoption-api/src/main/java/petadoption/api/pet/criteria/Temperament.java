package petadoption.api.pet.criteria;

import lombok.Getter;

public enum Temperament {
    CHILL("Chill"),      // willclo1
    NEEDY("Needy"),      // willclo1
    AGGRESSIVE("Aggressive"), // willclo1
    ENERGETIC("Energetic"),  // willclo1
    FRIENDLY("Friendly"),
    BOLD("Bold"),
    LIVELY("Lively"),
    FOCUSED("Focused"),
    CURIOUS("Curious"),
    SKITTISH("Skittish"),
    TIMID("Timid"),
    PASSIVE("Passive"),
    CALM("Calm"),
    QUIET("Quiet"),
    ANXIOUS("Anxious"),
    SHY("Shy"),
    EXTROVERTED("Extroverted"),
    INTROVERTED("Introverted"),
    EXCITABLE("Excitable"),
    REACTIVE("Reactive"),
    IMPULSIVE("Impulsive"),
    DEMANDING("Demanding"),
    POSSESSIVE("Possessive"),
    INDEPENDENT("Independent"),
    DEPENDENT("Dependent"),
    PLAYFUL("Playful"),
    WILLFUL("Willful"),
    ACTIVE("Active"),
    AFFECTIONATE("Affectionate"),
    INTELLIGENT("Intelligent"),
    VOCAL("Vocal"),
    ATHLETIC("Athletic"),
    SWEET("Sweet"),
    SOCIABLE("Sociable"),
    EVEN_TEMPERED("Even Tempered"),
    ADAPTABLE("Adaptable"),
    INSISTENT("Insistent"),
    LOYAL("Loyal"),
    EASY_GOING("Easy Going"),
    DOCILE("Docile"),
    PLACID("Placid"),
    BOSSY("Bossy"),
    AGILE("Agile"),
    KID_FRIENDLY("Kid Friendly"),
    PET_FRIENDLY("Pet Friendly"),;

    @Getter
    private final String displayName;

    Temperament(String displayName) {
        this.displayName = displayName;
    }
}