package petadoption.api.user;
// using integer from 1-5 to denote preferences
// 1 is the worst, 5 is the best
package petadoption.api.user;

import lombok.Data;

@Data
public class UserPreference {

    private int preference1; // Example preference
    private int preference2; // Another preference
    private int preference3; // Another preference
    // Add more preferences as needed

    public void setPreference1(int preference1) {
        validatePreference(preference1);
        this.preference1 = preference1;
    }

    public void setPreference2(int preference2) {
        validatePreference(preference2);
        this.preference2 = preference2;
    }

    public void setPreference3(int preference3) {
        validatePreference(preference3);
        this.preference3 = preference3;
    }

    // Add setter methods for more preferences if needed

    private void validatePreference(int preference) {
        if (preference < 1 || preference > 5) {
            throw new IllegalArgumentException("Preference value must be between 1 and 5.");
        }
    }
}
