package petadoption.api.pet.criteria;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * <p>A class of utility functions intended to handle a pet's attributes,
 * as well as a user's preferences towards certain attributes.</p>
 *
 * <p>the attribute string follows this pattern:
 * <code>[type]:[attribute]</code>, where <code>type</code> is defined
 * by the <code>typesList</code> array, and it's accompanying set and
 * <code>attribute</code> is determined by type, with finer detail
 * spread across several other arrays and sets.</p>
 *
 * <p>This class contains functionality for verifying if a string
 * follows these criteria before assigning it to related classes.</p>
 *
 * @author Rafe Loya
 * @see petadoption.api.user.User
 * @see petadoption.api.pet.Pet
 */
public class Attribute {
    /*
     * Constants for indexing
     */

    public static final int TYPE = 0;
    public static final int ATTR = 1;

    /*
     * Lists of allowed strings for input
     */

    public static final String[] typeList = {
            "Species",
            "Cat Breed",
            "Dog Breed",
            "Fur Type",
            "Fur Color",
            "Fur Length",
            "Size",
            "Health",
            "Gender",
            "Spayed / Neutered",
            "Temperament",
            "Age",
            "Weight"
    };

    public static final String[] speciesList = {
            "Cat",
            "Dog"
    };

    public static final String[] catBreedList = {
            "Domestic Shorthair", // Equivalent to mixed / mix-breed
            "Domestic Longhair",

            "Abyssinian",
            "American Bobtail",
            "American Curl",
            "American Shorthair",
            "American Wirehair",
            "Australian Mist",

            "Balinese",
            "Bengal",
            "Birman",
            "Bombay",
            "British Longhair",
            "British Shorthair",
            "Burmese",
            "Burmilla",

            "Chartreux",
            "Chausie",
            "Colorpoint Shorthair",
            "Cornish Rex",

            "Devon Rex",
            "Donskoy",

            "Egyptian Mau",
            "European Burmerse",
            "Exotic Shorthair",

            "Havana Brown",
            "Himalayan",

            "Japanese Bobtail",
            "Javanese",

            "Khao Manee",
            "Korat",
            "Kurilian",

            "LaPerm",
            "Lykoi",

            "Maine Coon",
            "Manx",

            "Nebelung",
            "Norwegian Forest Cat",

            "Ocicat",
            "Oriental",

            "Persian",
            "Peterbald",
            "Pixie Bob",

            "RagaMuffin",
            "Ragdoll",
            "Russian Blue",

            "Savannah",
            "Scottish Fold",
            "Selkirk Rex",
            "Siamese",
            "Siberian",
            "Singapura",
            "Snowshoe",
            "Somali",
            "Sphynx",

            "Tonkinese",
            "Toybob",
            "Turkish Angora",
            "Turkish Van",
            "Toyger",
            "Tuxedo"
    };

    public static final String[] dogBreedList = {
            "Mix-Breed",

            "Affenpinscher",
            "Afghan Hound",
            "Airedale Terrier",
            "Akita",
            "Alaskan Husky",
            "Alaskan Klee Kai",
            "Alaskan Malamute",
            "American Bulldog",
            "American English Coonhound",
            "American Eskimo Dog",
            "American Foxhound",
            "American Hairless Terrier",
            "American Leopard Hound",
            "American Pitbull Terrier",
            "American Staffordshire Terrier",
            "American Water Spaniel",
            "Anatolian Shepherd Dog",
            "Appenzeller Sennenhund",
            "Australian Cattle Dog",
            "Australian Kelpie",
            "Australian Shepherd",
            "Australian Stumpy Tail Cattle Dog",
            "Australian Terrier",
            "Azawakh",

            "Barbado da Terceira",
            "Barbet",
            "Basenji",
            "Basset Fauve de Bretagne",
            "Basett Hound",
            "Bavarian Mountain Scent Hound",
            "Beagle",
            "Bearded Collie",
            "Beauceron",
            "Bedlington Terrier",
            "Belgian Laekenois",
            "Belgian Malinois",
            "Belgian Sheepdog",
            "Belgian Tervuren",
            "Bergamasco Sheepdog",
            "Berger Picard",
            "Bernese Mountain Dog",
            "Bichon Frise",
            "Biewer Terrier",
            "Black and Tan Coonhound",
            "Black Mouth Cur",
            "Black Russian Terrier",
            "Bloodhound",
            "Blue Picardy Spaniel",
            "Bluetick Coonhound",
            "Boerboel",
            "Bohemian Shepherd",
            "Bolognese",
            "Border Collie",
            "Border Terrier",
            "Borzoi",
            "Boston Terrier",
            "Bouvier des Ardennes",
            "Bouvier des Flandres",
            "Boxer",
            "Boykin Spaniel",
            "Bracco Italiano",
            "Braque du Bourbonnais",
            "Braque Francais Pyrenean",
            "Braque Saint Germain",
            "Brazilian Terrier",
            "Briard",
            "Brittany Spaniel",
            "Broholmer",
            "Brussels Griffon",
            "Bull Terrier",
            "Bulldog",
            "Bullmastiff",

            "Cairn Terrier",
            "Canaan Dog",
            "Cane Corso",
            "Cardigan Welsh Corgi",
            "Carolina Dog",
            "Catahoula Leopard Dog",
            "Caucasian Shepherd Dog",
            "Cavalier King Charles Spaniel",
            "Central Asian Shepherd Dog",
            "Cesky Terrier",
            "Chesapeake Bay Retriever",
            "Chihuahua",
            "Chinese Crested",
            "Chinese Shar Pei",
            "Chinook",
            "Chow Chow",
            "Cirneco dell'Etna",
            "Clumber Spaniel",
            "Cocker Spaniel",
            "Collie",
            "Coton de Tulear",
            "Croatian Sheepdog",
            "Curly Coated Retriever",
            "Czechoslovakian Vlciak",

            "Dachshund",
            "Dalmation",
            "Dandie Dinmont Terrier",
            "Danish Swedish Farmdog",
            "Deutscher Wachtelhund",
            "Doberman Pinscher",
            "Dogo Argentino",
            "Dogue de Bordeaux",
            "Drentsche Patrijshond",
            "Drever",
            "Dutch Shepherd",

            "English Cocker Spaniel",
            "English Foxhound",
            "English Settler",
            "English Springer Spaniel",
            "English Toy Spaniel",
            "Entlebucher Mountain Dog",
            "Estrela Mountain Dog",
            "Eurasier",

            "Field Spaniel",
            "Finnish Lapphund",
            "Finnish Spitz",
            "Flat Coated Retriever",
            "French Bulldog",
            "French Spaniel",

            "German Longhaired Pointer",
            "German Pinscher",
            "German Shepherd Dog",
            "German Shorthaired Pointer",
            "German Spitz",
            "German Wirehaired Pointer",
            "Giant Schnauzer",
            "Glen of Imaal Terrier",
            "Golden Retriever",
            "Gordon Setter",
            "Grand Basset Griffon Vendéen",
            "Great Dane",
            "Great Pyrenees",
            "Greater Swiss Mountain Dog",
            "Greyhound",

            "Hamiltonstovare",
            "Hanoverian Scenthound",
            "Harrier",
            "Havanese",
            "Hokkaido",
            "Hovawart",

            "Ibizan Hound",
            "Icelandic Sheepdog",
            "Irish Red and White Setter",
            "Irish Setter",
            "Irish Terrier",
            "Irish Water Spaniel",
            "Irish Wolfhound",
            "Italian Greyhound",

            "Jagdterrier",
            "Japanese Akitainu",
            "Japanese Chin",
            "Japanese Spitz",
            "Japanese Terrier",

            "Kai Ken",
            "Karelian Bear Dog",
            "Keeshond",
            "Kerry Blue Terrier",
            "Kishu Ken",
            "Komondor",
            "Korean Jindo Dog",
            "Kromfohrlander",
            "Kuvasz",

            "Labrador Retriever",
            "Lagotto Romagnolo",
            "Lakeland Terrier",
            "Lancashire Heeler",
            "Lapponian Herder",
            "Large Munsterlander",
            "Leonberger",
            "Lhasa Apso",
            "Löwchen",

            "Maltese",
            "Manchester Terrier",
            "Mastiff",
            "Miniature American Shepherd",
            "Miniature Bull Terrier",
            "Miniature Pinscher",
            "Miniature Schnauzer",
            "Mountain Cur",
            "Mudi",

            "Neopolitan Mastiff",
            "Nederlandse Kooikerhondje",
            "Newfoundland",
            "Norfolk Terrier",
            "Norrbottenspets",
            "Norwegian Buhund",
            "Norwegian Elkhound",
            "Norwegian Lundehund",
            "Norwich Terrier",
            "Nova Scotia Duck Tolling Retriever",

            "Old English Sheepdog",
            "Otterhound",

            "Papillon",
            "Parson Russel Terrier",
            "Patterdale Terrier",
            "Pekingese",
            "Pembroke Welsh Corgi",
            "Peruvian Inca Orchid",
            "Petit Basset Griffon Vendéen",
            "Pharaoh Hound",
            "Plott Hound",
            "Pointer",
            "Polish Lowland Sheepdog",
            "Pomeranian",
            "Pont Audemer Spaniel",
            "Poodle (Miniature)",
            "Poodle (Standard)",
            "Poodle (Toy)",
            "Poodle",
            "Porcelaine",
            "Portuguese Podengo",
            "Portuguese Podengo Pequeno",
            "Portuguese Pointer",
            "Portuguese Sheepdog",
            "Portuguese Water Dog",
            "Presa Canario",
            "Pudelpointer",
            "Pug",
            "Puli",
            "Pumi",
            "Pyrenean Mastiff",
            "Pyrenean Shepherd",

            "Rafeiro do Alentejo",
            "Rat Terrier",
            "Redbone Coonhound",
            "Rhodesian Ridgeback",
            "Romanian Carpathian Shepherd",
            "Romanian Mioritic Shepherd Dog",
            "Rottweiler",
            "Russell Terrier",
            "Russian Toy",
            "Russian Tsvetnaya Bolonka",

            "Saint Bernard",
            "Saluki",
            "Samoyed",
            "Schapendoes",
            "Schipperke",
            "Scottish Deerhound",
            "Scottish Terrier",
            "Sealyham Terrier",
            "Segugio Italiano",
            "Shetland Sheepdog",
            "Shiba Inu",
            "Shih Tzu",
            "Shikoku",
            "Siberian Husky",
            "Silky Terrier",
            "Skye Terrier",
            "Sloughi",
            "Slovakian Wirehaired Pointer",
            "Slovensky Cuvac",
            "Slovensky Kopov",
            "Small Munsterlander",
            "Smooth Fox Terrier",
            "Soft Coated Wheaten Terrier",
            "Spanish Mastiff",
            "Spanish Water Dog",
            "Spinone Italiano",
            "Stabyhoun",
            "Staffordshire Bull Terrier",
            "Standard Schnauzer",
            "Sussex Spaniel",
            "Swedish Lapphund",
            "Swedish Vallhund",

            "Taiwan Dog",
            "Teddy Roosevelt Terrier",
            "Thai Bangkaew",
            "Thai Ridgeback",
            "Tibetan Mastiff",
            "Tibetan Spaniel",
            "Tibetan Terrier",
            "Tornjak",
            "Tosa",
            "Toy Fox Terrier",
            "Transylvanian Hound",
            "Treeing Tennessee Brindle",
            "Treeing Walker Coonhound",

            "Vizsla",
            "Volpino Italiano",

            "Weimaraner",
            "Welsh Springer Spaniel",
            "Welsh Terrier",
            "West Highland White Terrier",
            "Wetterhoun",
            "Whippet",
            "Wire Fox Terrier",
            "Wirehaired Pointing Griffon",
            "Wirehaired Vizsla",
            "Working Kelpie",

            "Xoloitzcuintli",

            "Yakutian Laika",
            "Yorkshire Terrier"
    };

    public static final String[] furTypeList = {
            "Hairless",
            "Smooth",
            "Silky",
            "Curly",
            "Rough",
            "Wiry",
            "Double",
            "Wavy",
            "Corded"
    };

    public static final String[] furColorList = {
            "Mixed Color",

            "Albino",
            "Apricot",
            "Ash",

            "Banding",
            "Bi Color",
            "Biscuit",
            "Black",
            "Blue",
            "Brindle",
            "Bronze",
            "Brown",

            "Charcoal",
            "Chestnut",
            "Chocolate",
            "Cinnamon",
            "Color Point",
            "Copper",
            "Cream",

            "Dark",

            "Fawn",

            "Ginger",
            "Grey",

            "Ivory",
            "Isabella",

            "Lilac",
            "Light",

            "Muddy",
            "Multi Color",
            "Mahogany",
            "Merle",

            "Orange",

            "Parti Color",
            "Platinum",

            "Reddish Brown",
            "Red",
            "Roan",

            "Sable",
            "Silver",
            "Smoky",
            "Solid",

            "Tortoise",
            "Tan",
            "Tri Color",

            "Washed Out",
            "White",

            "Yellow",
    };

    public static final String[] furLengthList = {
            "Hairless",
            "Short",
            "Medium",
            "Long",
    };

    public static final String[] sizeList = {
            "Extra Small",
            "Small",
            "Medium",
            "Large",
            "Extra Large"
    };

    public static final String[] healthList = {
            "Excellent",
            "Good",
            "Fair",
            "Poor"
    };

    public static final String[] genderList = {
            "Male",
            "Female",
    };

    public static final String[] temperamentList = {
            "Adaptable",
            "Affectionate",
            "Agile",
            "Aggressive",
            "Aloof",
            "Anxious",
            "Athletic",

            "Bold",
            "Bossy",

            "Calm",
            "Cat Friendly",
            "Chill",
            "Cuddly",
            "Curious",

            "Demanding",
            "Dependent",
            "Docile",
            "Dog Friendly",
            "Dominant",

            "Easy Going",
            "Easily Trained",
            "Energetic",
            "Even Tempered",
            "Excitable",
            "Extroverted",

            "Focused",
            "Friendly",

            "Good on Leash",

            "Hyper",

            "Independent",
            "Insistent",
            "Intelligent",
            "Introverted",

            "Kid Friendly",

            "Lively",
            "Loyal",

            "Needy",

            "Passive",
            "Pet Friendly",
            "Playful",
            "Placid",
            "Possessive",
            "Potty Trained",

            "Quiet",

            "Reactive",

            "Shy",
            "Skittish",
            "Sociable",
            "Strong",
            "Submissive",
            "Sweet",

            "Timid",

            "Vocal",

            "Willful"
    };

    public static final String[] spayedNeuteredList = {
            "Y",
            "N"
    };

    //=======================================================================//

    /*
     * For quick verification / lookup of attributes
     */

    public static final Set<String> types
            = new HashSet<>(Arrays.asList(typeList));
    public static final Set<String> species
            = new HashSet<>(Arrays.asList(speciesList));
    public static final Set<String> catBreeds
            = new HashSet<>(Arrays.asList(catBreedList));
    public static final Set<String> dogBreeds
            = new HashSet<>(Arrays.asList(dogBreedList));
    public static final Set<String> furTypes
            = new HashSet<>(Arrays.asList(furTypeList));
    public static final Set<String> furColors
            = new HashSet<>(Arrays.asList(furColorList));
    public static final Set<String> furLengths
            = new HashSet<>(Arrays.asList(furLengthList));
    public static final Set<String> sizes
            = new HashSet<>(Arrays.asList(sizeList));
    public static final Set<String> health
            = new HashSet<>(Arrays.asList(healthList));
    public static final Set<String> gender
            = new HashSet<>(Arrays.asList(genderList));
    public static final Set<String> temperament
            = new HashSet<>(Arrays.asList(temperamentList));
    public static final Set<String> spayedNeutered
            = new HashSet<>(Arrays.asList(spayedNeuteredList));

    private Attribute() {}

    //=======================================================================//

    /*
     * Static / Utility functions
     */

    /**
     * Returns the attribute list associated with the given type.
     *
     * @param type Attribute type / category
     * @return Attribute list associated with type, or <code>null</code>
     *         if the type is not defined by the system
     */
    public static String[] mapAttributeList(String type) {
        return switch(type) {
            case "Species" -> speciesList;
            case "Cat Breed" -> catBreedList;
            case "Dog Breed" -> dogBreedList;
            case "Fur Type" -> furTypeList;
            case "Fur Color" -> furColorList;
            case "Fur Length" -> furLengthList;
            case "Size" -> sizeList;
            case "Health" -> healthList;
            case "Gender" -> genderList;
            case "Spayed / Neutered" -> spayedNeuteredList;
            case "Temperament" -> temperamentList;

            default -> null;
        };
    }

    /**
     * A small helper function if the user does not remember the delimiting
     * regular expression. Breaks a string into it's type and attribute.
     *
     * @param attribute string to split
     * @return type and attribute, separately
     */
    public static String[] splitAttribute(String attribute) {
        return attribute.split(":");
    }

    /**
     * Small helper function to simply
     *
     * @param type      Category / type attribute falls under
     * @param attribute Criteria / attribute
     * @return Concatenated string of type and attribute separated by a delimiter
     */
    public static String buildAttribute(String type, String attribute) {
        return type + ":" + attribute;
    }

    /**
     * Small helper function to check if <code>type</code> is defined
     * by the system
     *
     * @param type string to check
     * @return if the string is defined in <code>types</code>
     */
    public static boolean verifyType(String type) {
        return types.contains(type);
    }

    /**
     * Helper function to determine if a split string only contains
     * <code>type</code> and <code>attribute</code>, and that
     * neither is empty
     *
     * @param splitResult split array to check
     * @return if split string is a valid attribute
     */
    public static boolean verifyAttributeFormatSplit(String[] splitResult) {
        return (splitResult.length == 2
                && !splitResult[TYPE].isEmpty()
                && !splitResult[ATTR].isEmpty()
        );
    }

    /**
     * Verifies if a split string has a system-defined <code>type</code>
     * and a <code>attribute</code> that matches it.
     *
     * @param attribute split string to check
     * @return if an attribute is properly formatted
     */
    public static boolean verifyAttributeFormat(String[] attribute) {
        if (attribute == null || attribute.length == 0) {
            return false;
        }

        return isDefined(attribute);
    }

    /**
     * Similar to the other <code>verifyAttributeFormat()</code>,
     * but this one can perform the string split.
     *
     * @param attribute string to split and check
     * @return if an attribute is properly formatted
     */
    public static boolean verifyAttributeFormat(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return false;
        }

        String[] values = attribute.split(":");

        return isDefined(values);
    }

    private static boolean isDefined(String[] values) {
        if (!verifyAttributeFormatSplit(values)) {
            return false;
        }
        if (verifyType(values[TYPE])) {
            return switch(values[TYPE]) {
                case "Species" -> species.contains(values[ATTR]);
                case "Cat Breed" -> catBreeds.contains(values[ATTR]);
                case "Dog Breed" -> dogBreeds.contains(values[ATTR]);
                case "Fur Type" -> furTypes.contains(values[ATTR]);
                case "Fur Color" -> furColors.contains(values[ATTR]);
                case "Fur Length" -> furLengths.contains(values[ATTR]);
                case "Size" -> sizes.contains(values[ATTR]);
                case "Health" -> health.contains(values[ATTR]);
                case "Gender" -> gender.contains(values[ATTR]);
                case "Temperament" -> temperament.contains(values[ATTR]);
                case "Spayed / Neutered" -> spayedNeutered.contains(values[ATTR]);
                case "Age" -> values[ATTR].matches("^([1-9]|[1-4][0-9]|50)$");                    // 1-50
                case "Weight" -> values[ATTR].matches("^([1-9]|[1-9][0-9]|[1-3][0-9]{2}|400)$");  // 1-400
                default -> false;
            };
        }

        return false;
    }
}